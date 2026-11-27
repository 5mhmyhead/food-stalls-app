import { supabase } from "@/lib/supabase";
import { showNotice } from "@/manageStore";
import {
  resetSettings,
  syncUserFromProfile,
  useSettings,
} from "@/settingsStore";
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

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const setState = (next: Partial<AuthState>) => {
  state = { ...state, ...next };
  emit();
};

const USERNAME_CACHE_KEY = "auth_username_email_map";

function getCachedEmail(username: string): string | null {
  try {
    if (typeof localStorage === "undefined") return null;
    const raw = localStorage.getItem(USERNAME_CACHE_KEY);
    if (!raw) return null;
    const map = JSON.parse(raw) as Record<string, string>;
    return map[username.trim().toLowerCase()] || null;
  } catch {
    return null;
  }
}

function cacheUsernameEmail(username: string, email: string) {
  try {
    if (typeof localStorage === "undefined" || !username || !email) return;
    const raw = localStorage.getItem(USERNAME_CACHE_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, string>) : {};
    map[username.trim().toLowerCase()] = email.trim().toLowerCase();
    localStorage.setItem(USERNAME_CACHE_KEY, JSON.stringify(map));
  } catch {}
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

  const resolvedEmail = data?.email || fallbackEmail || "";
  const resolvedRole = data?.account_type || "WORKER";

  if (resolvedName && resolvedEmail) {
    cacheUsernameEmail(resolvedName, resolvedEmail);
  }

  if (!data) {
    await supabase.from("profiles").upsert({
      id: userId,
      username: resolvedName,
      email: resolvedEmail,
      account_type: resolvedRole,
    });
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
  } = await supabase.auth.getSession();

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
    const cleanId = identifier.trim();
    if (!cleanId) return "Please enter your username or email.";
    if (!password) return "Please enter your password.";

    let loginEmail = cleanId;
    let knownUsername = "";

    if (!cleanId.includes("@")) {
      const { data: profileRow, error: lookupError } = await supabase
        .from("profiles")
        .select("email, username")
        .ilike("username", cleanId)
        .maybeSingle();

      const resolvedEmail = profileRow?.email || getCachedEmail(cleanId);

      if (lookupError && !resolvedEmail) {
        return lookupError.message;
      }
      if (!resolvedEmail) {
        return "Account not found. Check your username or sign up with email.";
      }
      loginEmail = resolvedEmail;
      knownUsername = profileRow?.username || cleanId;
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
    const cleanUser = params.username.trim();
    const cleanEmail = params.email.trim().toLowerCase();

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

    const { data: existingUsername } = await supabase
      .from("profiles")
      .select("id")
      .ilike("username", cleanUser)
      .maybeSingle();

    if (existingUsername) {
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

    cacheUsernameEmail(cleanUser, cleanEmail);

    if (data.user && data.session) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        username: cleanUser,
        email: cleanEmail,
        account_type: "WORKER",
      });

      await supabase.auth.signOut();
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
    const cleanEmail = params.email.trim().toLowerCase();

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
    await supabase.auth.signOut();
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
