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
  );
}
