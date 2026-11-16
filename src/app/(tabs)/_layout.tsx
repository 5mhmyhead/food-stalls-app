import { useCatalog } from "@/catalogStore";
import * as Editors from "@/components/Editors";
import * as ManageOrdersMod from "@/components/ManageOrders";
import * as OrderDetailsMod from "@/components/OrderDetails";
import * as PayoutScreenMod from "@/components/PayoutScreen";
import * as ProductDetailMod from "@/components/ProductDetail";
import * as SettingsPages from "@/components/SettingsPages";
import TabBar from "@/components/TabBar";
import { useManageState } from "@/manageStore";
import { useOrderDetailsState } from "@/orderDetailsStore";
import { closeProduct, useOrderState } from "@/orderStore";
import { usePayoutOpen } from "@/payoutStore";
import { useSettings } from "@/settingsStore";
import { Tabs } from "expo-router";
import {
  memo,
  useEffect,
  useRef,
  type ComponentType,
  type ReactElement,
  type ReactNode,
} from "react";
import { Animated, Dimensions, Platform, StyleSheet, View } from "react-native";

const { width: SW, height: SH } = Dimensions.get("window");
const native = Platform.OS !== "web";

const EditProducts = (Editors as any).EditProducts as ComponentType<any>;
const EditCategories = (Editors as any).EditCategories as ComponentType<any>;
const EditItem = (Editors as any).EditItem as ComponentType<any>;
const CategoryForm = (Editors as any).CategoryForm as ComponentType<any>;

const ManageOrders = ((ManageOrdersMod as any).default ??
  ManageOrdersMod) as ComponentType<any>;
const OrderDetailsScreen = ((OrderDetailsMod as any).default ??
  OrderDetailsMod) as ComponentType<any>;
const PayoutScreen = ((PayoutScreenMod as any).default ??
  PayoutScreenMod) as ComponentType<any>;
const ProductDetail = ((ProductDetailMod as any).default ??
  ProductDetailMod) as ComponentType<any>;

const AccountPage = (SettingsPages as any).AccountPage as ComponentType<any>;
const SecurityPage = (SettingsPages as any).SecurityPage as ComponentType<any>;
const PreferencesPage = (SettingsPages as any)
  .PreferencesPage as ComponentType<any>;

function Slide({
  visible,
  children,
}: {
  visible: boolean;
  children?: ReactNode;
}): ReactElement | null {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      progress.setValue(0);
      return;
    }
    Animated.spring(progress, {
      toValue: 1,
      damping: 26,
      stiffness: 260,
      mass: 0.85,
      overshootClamping: true,
      useNativeDriver: native,
    }).start();
  }, [visible]);

  if (!visible) return null;

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [SW, 0],
  });

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        { zIndex: 100, elevation: 100, transform: [{ translateX }] },
      ]}
    >
      {children}
    </Animated.View>
  );
}

function SlideUp({
  visible,
  children,
}: {
  visible: boolean;
  children?: ReactNode;
}): ReactElement | null {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      progress.setValue(0);
      return;
    }
    Animated.spring(progress, {
      toValue: 1,
      damping: 26,
      stiffness: 250,
      mass: 0.85,
      overshootClamping: true,
      useNativeDriver: native,
    }).start();
  }, [visible]);

  if (!visible) return null;

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [SH, 0],
  });

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        { zIndex: 100, elevation: 100, transform: [{ translateY }] },
      ]}
    >
      {children}
    </Animated.View>
  );
}

const AppOverlays = memo(function AppOverlays(): ReactElement | null {
  const payoutOpen = usePayoutOpen();
  const { open: orderDetailsOpen } = useOrderDetailsState();
  const { selectedId } = useOrderState();
  const { open: manageOpen } = useManageState();
  const { screen, products } = useCatalog();
  const { screen: settingsScreen } = useSettings();

  const validProduct = Boolean(
    selectedId && products.some((p) => p.id === selectedId),
  );

  useEffect(() => {
    if (selectedId && !validProduct) {
      closeProduct();
    }
  }, [selectedId, validProduct]);

  const currentCatalog = String(screen ?? "");
  const currentSettings = String(settingsScreen ?? "");

  const showProducts =
    currentCatalog === "products" || currentCatalog === "item";
  const showCategories =
    currentCatalog === "categories" || currentCatalog === "category";

  const anyActive =
    showProducts ||
    showCategories ||
    currentCatalog === "item" ||
    currentCatalog === "category" ||
    Boolean(manageOpen) ||
    validProduct ||
    Boolean(payoutOpen) ||
    Boolean(orderDetailsOpen) ||
    currentSettings === "account" ||
    currentSettings === "security" ||
    currentSettings === "preferences";

  if (!anyActive) return null;

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <Slide visible={showProducts}>
        <EditProducts />
      </Slide>

      <Slide visible={showCategories}>
        <EditCategories />
      </Slide>

      <SlideUp visible={currentCatalog === "item"}>
        <EditItem />
      </SlideUp>

      <SlideUp visible={currentCatalog === "category"}>
        <CategoryForm />
      </SlideUp>

      <Slide visible={Boolean(manageOpen)}>
        <ManageOrders />
      </Slide>

      <SlideUp visible={validProduct}>
        <ProductDetail />
      </SlideUp>

      <SlideUp visible={Boolean(payoutOpen)}>
        <PayoutScreen />
      </SlideUp>

      <SlideUp visible={Boolean(orderDetailsOpen)}>
        <OrderDetailsScreen />
      </SlideUp>

      <Slide visible={currentSettings === "account"}>
        <AccountPage />
      </Slide>

      <Slide visible={currentSettings === "security"}>
        <SecurityPage />
      </Slide>

      <Slide visible={currentSettings === "preferences"}>
        <PreferencesPage />
      </Slide>
    </View>
  );
});

export default function TabsLayout(): ReactElement {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        detachInactiveScreens={false}
        screenOptions={{
          headerShown: false,
          lazy: false,
          freezeOnBlur: false,
          animation: "none",
        }}
        tabBar={(props: any) => <TabBar {...props} />}
      >
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen name="home" options={{ title: "Home" }} />
        <Tabs.Screen name="menu" options={{ title: "Menu" }} />
        <Tabs.Screen name="orders" options={{ title: "Orders" }} />
        <Tabs.Screen name="history" options={{ title: "History" }} />
        <Tabs.Screen name="settings" options={{ title: "Settings" }} />
      </Tabs>

      <AppOverlays />
    </View>
  );
}
