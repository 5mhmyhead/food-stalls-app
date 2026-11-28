import { supabase, supabaseAnonKey, supabaseUrl } from "@/lib/supabase";
import { showNotice } from "@/manageStore";
import {
  resetSettings,
  syncUserFromProfile,
  useSettings,
} from "@/settingsStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSyncExternalStore } from "react";

type AuthState = {
  loggedIn: boolean;
  initialized: boolean;
  userId: string | null;
};

let state: AuthState = {
  loggedIn: false,
  initialized: false,
  userId: null,
};

const USERNAME_CACHE_KEY = "kawaiicount:username_email_map:v1";

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const setState = (next: Partial<AuthState>) => {
  state = { ...state, ...next };
  emit();
};

function sanitizeInput(raw: string): string {
  return raw.replace(/[\s\u200B-\u200D\uFEFF]/g, "").trim();
}

async function readUsernameCache(): Promise<Record<string, string>> {
  try {
    const raw = await AsyncStorage.getItem(USERNAME_CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

async function saveUsernameToCache(username: string, email: string) {
  const cleanUser = sanitizeInput(username).toLowerCase();
  const cleanEmail = sanitizeInput(email).toLowerCase();
  if (!cleanUser || !cleanEmail || !cleanEmail.includes("@")) return;

  try {
    const map = await readUsernameCache();
    map[cleanUser] = cleanEmail;
    await AsyncStorage.setItem(USERNAME_CACHE_KEY, JSON.stringify(map));
  } catch {}
}

async function lookupEmailByUsername(
  username: string,
): Promise<{ email: string | null; username: string }> {
  const cleanUser = sanitizeInput(username);
  const normalizedKey = cleanUser.toLowerCase();
  const urlClean = supabaseUrl.trim();
  const keyClean = supabaseAnonKey.trim();

  // 1. Check local device cache
  const localMap = await readUsernameCache();
  if (localMap[normalizedKey]) {
    return {
      email: localMap[normalizedKey],
      username: cleanUser,
    };
  }

  // 2. Direct Supabase client query (exact match)
  try {
    const { data: exactRow } = await supabase
      .from("profiles")
      .select("email, username")
      .eq("username", cleanUser)
      .limit(1)
      .maybeSingle();

    if (exactRow?.email) {
      const resolvedEmail = sanitizeInput(exactRow.email).toLowerCase();
      const resolvedUsername = exactRow.username?.trim() || cleanUser;
      await saveUsernameToCache(resolvedUsername, resolvedEmail);
      return {
        email: resolvedEmail,
        username: resolvedUsername,
      };
    }
  } catch {}

  // 3. Direct REST table lookup (case-insensitive)
  if (urlClean && keyClean) {
    try {
      const endpoint = `${urlClean}/rest/v1/profiles?select=email,username&username=ilike.${encodeURIComponent(cleanUser)}&limit=1`;
      const res = await fetch(endpoint, {
        method: "GET",
        headers: {
          apikey: keyClean,
          Authorization: `Bearer ${keyClean}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        const rows = (await res.json()) as Array<{
          email?: string;
          username?: string;
        }>;
        if (rows?.[0]?.email) {
          const resolvedEmail = sanitizeInput(rows[0].email).toLowerCase();
          const resolvedUsername = rows[0].username?.trim() || cleanUser;
          await saveUsernameToCache(resolvedUsername, resolvedEmail);
          return {
            email: resolvedEmail,
            username: resolvedUsername,
          };
        }
      }
    } catch {}
  }

  // 4. RPC lookup if present on backend
  try {
    const { data: rpcEmail } = await supabase.rpc("get_email_by_username", {
      p_username: cleanUser,
    });

    if (typeof rpcEmail === "string" && rpcEmail.includes("@")) {
      const resolvedEmail = sanitizeInput(rpcEmail).toLowerCase();
      await saveUsernameToCache(cleanUser, resolvedEmail);
      return {
        email: resolvedEmail,
        username: cleanUser,
      };
    }
  } catch {}

  return {
    email: null,
    username: cleanUser,
  };
}

async function hydrateProfile(
  userId: string,
  fallbackEmail?: string | null,
  metadataUsername?: string | null,
): Promise<string> {
  const { data } = await supabase
    .from("profiles")
    .select("id, username, account_type, email")
    .eq("id", userId)
    .maybeSingle();

  let metaName = metadataUsername?.trim() || "";
  if (!metaName && !data?.username) {
    const { data: userData } = await supabase.auth.getUser();
    metaName =
      (userData.user?.user_metadata?.username as string | undefined)?.trim() ||
      "";
  }

  const resolvedName =
    data?.username?.trim() ||
    metaName ||
    (fallbackEmail ? fallbackEmail.split("@")[0] : "User");

  const resolvedEmail = (data?.email || fallbackEmail || "").trim();
  const resolvedRole = data?.account_type || "WORKER";

  if (!data) {
    await supabase.from("profiles").upsert({
      id: userId,
      username: resolvedName,
      email: resolvedEmail,
      account_type: resolvedRole,
    });
  }

  if (resolvedName && resolvedEmail) {
    await saveUsernameToCache(resolvedName, resolvedEmail);
  }

  syncUserFromProfile({
    username: resolvedName,
    email: resolvedEmail,
    accountType: resolvedRole,
  });

  return resolvedName;
}

export async function initAuth() {
  const {
    data: { session: currentSession },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    await supabase.auth.signOut({ scope: "local" });
  }

  if (currentSession?.user) {
    await hydrateProfile(
      currentSession.user.id,
      currentSession.user.email,
      currentSession.user.user_metadata?.username,
    );
    setState({
      loggedIn: true,
      initialized: true,
      userId: currentSession.user.id,
    });
  } else {
    setState({
      loggedIn: false,
      initialized: true,
      userId: null,
    });
  }

  supabase.auth.onAuthStateChange(async (_event, nextSession) => {
    if (nextSession?.user) {
      await hydrateProfile(
        nextSession.user.id,
        nextSession.user.email,
        nextSession.user.user_metadata?.username,
      );
      setState({
        loggedIn: true,
        initialized: true,
        userId: nextSession.user.id,
      });
    } else {
      resetSettings();
      setState({
        loggedIn: false,
        initialized: true,
        userId: null,
      });
    }
  });
}

export const session = {
  async signInWithCredentials(
    identifier: string,
    password: string,
  ): Promise<string | null> {
    const cleanId = sanitizeInput(identifier);
    if (!cleanId) return "Please enter your username or email.";
    if (!password) return "Please enter your password.";

    let loginEmail = cleanId;
    let knownUsername = "";

    if (cleanId.includes("@")) {
      const normalizedEmail = cleanId.toLowerCase();
      if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
        return "Please enter a valid email address.";
      }
      loginEmail = normalizedEmail;
    } else {
      const resolved = await lookupEmailByUsername(cleanId);
      if (!resolved.email) {
        return "Account not found. Check your username or sign in with your email.";
      }
      loginEmail = resolved.email;
      knownUsername = resolved.username;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password,
    });

    if (error || !data.user) {
      return error?.message || "Invalid login credentials.";
    }

    const displayName =
      (await hydrateProfile(
        data.user.id,
        data.user.email,
        data.user.user_metadata?.username || knownUsername,
      )) ||
      knownUsername ||
      "User";

    if (displayName && data.user.email) {
      await saveUsernameToCache(displayName, data.user.email);
    }

    setState({
      loggedIn: true,
      initialized: true,
      userId: data.user.id,
    });

    showNotice(`Welcome Back!\n${displayName}`);

    return null;
  },

  async signUpAccount(params: {
    username: string;
    email: string;
    password: string;
    confirm: string;
  }): Promise<string | null> {
    const cleanUser = sanitizeInput(params.username);
    const cleanEmail = sanitizeInput(params.email).toLowerCase();

    if (!cleanUser) return "Please enter a username.";
    if (!cleanEmail || !/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      return "Please enter a valid email address.";
    }
    if (params.password.length < 8) {
      return "Password must be at least 8 characters.";
    }
    if (params.password !== params.confirm) {
      return "Passwords do not match.";
    }

    const existing = await lookupEmailByUsername(cleanUser);
    if (existing.email) {
      return "That username is already taken.";
    }

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password: params.password,
      options: {
        data: {
          username: cleanUser,
        },
      },
    });

    if (error) {
      return error.message;
    }

    await saveUsernameToCache(cleanUser, cleanEmail);

    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        username: cleanUser,
        email: cleanEmail,
        account_type: "WORKER",
      });
    }

    if (data.user && data.session) {
      await supabase.auth.signOut({ scope: "local" });
      resetSettings();
      setState({
        loggedIn: false,
        initialized: true,
        userId: null,
      });
    }

    return null;
  },

  async recoverAccount(params: {
    email: string;
    password: string;
    confirm: string;
  }): Promise<string | null> {
    const cleanEmail = sanitizeInput(params.email).toLowerCase();

    if (!cleanEmail || !/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      return "Please enter a valid email address.";
    }
    if (params.password && params.password.length < 8) {
      return "Password must be at least 8 characters.";
    }
    if (params.password !== params.confirm) {
      return "Passwords do not match.";
    }

    const { data: profileRow } = await supabase
      .from("profiles")
      .select("id")
      .ilike("email", cleanEmail)
      .limit(1)
      .maybeSingle();

    if (!profileRow) {
      return "No account found with that email address.";
    }

    const {
      data: { session: activeSession },
    } = await supabase.auth.getSession();

    if (
      activeSession?.user?.email?.toLowerCase() === cleanEmail &&
      params.password
    ) {
      const { error: updateErr } = await supabase.auth.updateUser({
        password: params.password,
      });
      if (updateErr) return updateErr.message;
      return null;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail);
    if (error) {
      return error.message;
    }

    return null;
  },

  async signOut() {
    await supabase.auth.signOut({ scope: "local" });
    resetSettings();
    setState({
      loggedIn: false,
      initialized: true,
      userId: null,
    });
  },
};

export function useLoggedIn() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state.loggedIn,
    () => false,
  );
}

export function useAuthInitialized() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state.initialized,
    () => false,
  );
}

export function getCurrentUserId() {
  return state.userId;
}

export function useCurrentUsername() {
  return useSettings().username;
}
