import { useLoggedIn } from "@/auth";
import { Stack } from "expo-router";

export default function RootLayout() {
  const loggedIn = useLoggedIn();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!loggedIn}>
        <Stack.Screen name="_sign-in" />
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="recover" />
      </Stack.Protected>
      <Stack.Protected guard={loggedIn}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
    </Stack>
  );
}
