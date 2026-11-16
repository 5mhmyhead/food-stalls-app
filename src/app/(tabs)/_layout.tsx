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
import { useOrderState } from "@/orderStore";
import { usePayoutOpen } from "@/payoutStore";
import { useSettings } from "@/settingsStore";
import { Tabs } from "expo-router";
import {
  memo,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Platform,
  StyleSheet,
  View,
} from "react-native";

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
  const [rendered, setRendered] = useState(visible);
  const progress = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    if (visible) {
      setRendered(true);
      Animated.spring(progress, {
        toValue: 1,
        damping: 26,
        stiffness: 260,
        mass: 0.85,
        overshootClamping: true,
        useNativeDriver: native,
      }).start();
      return undefined;
    }

    if (rendered) {
      Animated.timing(progress, {
        toValue: 0,
        duration: 200,
        easing: Easing.bezier(0.32, 0.72, 0, 1),
        useNativeDriver: native,
      }).start(({ finished }) => {
        if (finished) setRendered(false);
      });
    }

    return undefined;
  }, [visible]);

  if (!rendered) return null;

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [SW, 0],
  });

  return (
    <Animated.View
      pointerEvents={visible ? "auto" : "none"}
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
  const [rendered, setRendered] = useState(visible);
  const progress = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    if (visible) {
      setRendered(true);
      Animated.spring(progress, {
        toValue: 1,
        damping: 26,
        stiffness: 250,
        mass: 0.85,
        overshootClamping: true,
        useNativeDriver: native,
      }).start();
      return undefined;
    }

    if (rendered) {
      Animated.timing(progress, {
        toValue: 0,
        duration: 210,
        easing: Easing.bezier(0.32, 0.72, 0, 1),
        useNativeDriver: native,
      }).start(({ finished }) => {
        if (finished) setRendered(false);
      });
    }

    return undefined;
  }, [visible]);

  if (!rendered) return null;

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [SH, 0],
  });

  return (
    <Animated.View
      pointerEvents={visible ? "auto" : "none"}
      style={[
        StyleSheet.absoluteFill,
        { zIndex: 100, elevation: 100, transform: [{ translateY }] },
      ]}
    >
      {children}
    </Animated.View>
  );
}

const AppOverlays = memo(function AppOverlays(): ReactElement {
  const payoutOpen = usePayoutOpen();
  const { open: orderDetailsOpen } = useOrderDetailsState();
  const { selectedId } = useOrderState();
  const { open: manageOpen } = useManageState();
  const { screen } = useCatalog();
  const { screen: settingsScreen } = useSettings();

  const currentCatalog = String(screen ?? "");
  const currentSettings = String(settingsScreen ?? "");

  const showProducts =
    currentCatalog === "products" || currentCatalog === "item";
  const showCategories =
    currentCatalog === "categories" || currentCatalog === "category";

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

      <SlideUp visible={Boolean(selectedId)}>
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
    <View style={{ flex: 1, overflow: "hidden" }}>
      <Tabs
        detachInactiveScreens={false}
        screenOptions={{
          headerShown: false,
          lazy: true,
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
