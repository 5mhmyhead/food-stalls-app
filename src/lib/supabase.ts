import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

export const supabaseUrl = (process.env.EXPO_PUBLIC_SUPABASE_URL || "")
  .replace(/^["']|["']$/g, "")
  .trim();

export const supabaseAnonKey = (process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "")
  .replace(/^["']|["']$/g, "")
  .trim();

const isServer = Platform.OS === "web" && typeof window === "undefined";

const storage = isServer
  ? {
      getItem: async () => null,
      setItem: async () => {},
      removeItem: async () => {},
    }
  : AsyncStorage;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    autoRefreshToken: !isServer,
    persistSession: !isServer,
    detectSessionInUrl: false,
  },
});
