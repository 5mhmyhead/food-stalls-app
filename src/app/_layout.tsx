<<<<<<< Updated upstream
import TabBar from "@/components/TabBar";
import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs 
      screenOptions={{ headerShown: false }} 
      tabBar={(props: any) => <TabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="menu" options={{ title: "Menu" }} />
      <Tabs.Screen name="orders" options={{ title: "Orders" }} />
      <Tabs.Screen name="history" options={{ title: "History" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
=======
import { useLoggedIn } from "@/auth";
import {
  Stack,
  useRootNavigationState,
  useRouter,
  useSegments,
} from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const loggedIn = useLoggedIn();
  const router = useRouter();
  const segments = useSegments();
  const navState = useRootNavigationState();

  useEffect(() => {
    if (!navState?.key) return;

    const inAuthGroup =
      segments[0] === "sign-in" ||
      segments[0] === "sign-up" ||
      segments[0] === "recover";

    if (!loggedIn && !inAuthGroup) {
      router.replace("/sign-in");
    } else if (loggedIn && inAuthGroup) {
      router.replace("/");
    }
  }, [loggedIn, segments, navState?.key]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="recover" />
      <Stack.Screen name="(tabs)" />
    </Stack>
>>>>>>> Stashed changes
  );
}
