import { useCatalog } from "@/catalogStore";
import {
  CategoryForm,
  EditCategories,
  EditItem,
  EditProducts,
} from "@/components/Editors";
import ManageOrders from "@/components/ManageOrders";
import PayoutScreen from "@/components/PayoutScreen";
import ProductDetail from "@/components/ProductDetail";
import TabBar from "@/components/TabBar";
import { useManageState } from "@/manageStore";
import { useOrderState } from "@/orderStore";
import { usePayoutOpen } from "@/payoutStore";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function TabsLayout() {
  const payoutOpen = usePayoutOpen();
  const { selectedId } = useOrderState();
  const { open: manageOpen } = useManageState();
  const { screen } = useCatalog();

  const showProducts = screen === "products" || screen === "item";
  const showCategories = screen === "categories" || screen === "category";

  return (
    <View style={{ flex: 1 }}>
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
      {showProducts && (
        <View style={StyleSheet.absoluteFill}>
          <EditProducts />
        </View>
      )}
      {showCategories && (
        <View style={StyleSheet.absoluteFill}>
          <EditCategories />
        </View>
      )}
      {screen === "item" && (
        <View style={StyleSheet.absoluteFill}>
          <EditItem />
        </View>
      )}
      {screen === "category" && (
        <View style={StyleSheet.absoluteFill}>
          <CategoryForm />
        </View>
      )}
      {manageOpen && (
        <View style={StyleSheet.absoluteFill}>
          <ManageOrders />
        </View>
      )}
      {selectedId && (
        <View style={StyleSheet.absoluteFill}>
          <ProductDetail />
        </View>
      )}
      {payoutOpen && (
        <View style={StyleSheet.absoluteFill}>
          <PayoutScreen />
        </View>
      )}
    </View>
  );
}
