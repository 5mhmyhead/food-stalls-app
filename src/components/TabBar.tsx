import { useCatalog } from "@/catalogStore";
import { useManageState } from "@/manageStore";
import { useOrderDetailsState } from "@/orderDetailsStore";
import { useOrderState } from "@/orderStore";
import { usePayoutOpen } from "@/payoutStore";
import { useSettings } from "@/settingsStore";
import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Children,
  cloneElement,
  isValidElement,
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
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { SvgProps } from "react-native-svg";

import HistoryIcon from "@/assets/icons/history.svg";
import HomeIcon from "@/assets/icons/home.svg";
import MenuIcon from "@/assets/icons/menu.svg";
import OrdersIcon from "@/assets/icons/orders.svg";
import SettingsIcon from "@/assets/icons/settings.svg";

const { width: SW, height: SH } = Dimensions.get("window");
const FW = Platform.OS === "web" ? Math.min(SW, SH * (390 / 844)) : SW;

const ACTIVE = "#e76d8a";
const INACTIVE = "#FFFFFF";
const FOCUS_BOOST = 1;
const native = Platform.OS !== "web";

const BAR_WIDTH = FW - 20;
const PAD_X = 10;
const PAD_Y = 7;
const PILL_WIDTH = 108;

type IconSet =
  | "ionicons"
  | "material"
  | "community"
  | "feather"
  | "fontawesome";

type TabItem = {
  route: string;
  component?: ComponentType<SvgProps>;
  focusedComponent?: ComponentType<SvgProps>;
  set?: IconSet;
  name?: string;
  focusedName?: string;
  size?: number;
  label?: string;
  render?: (color: string, focused: boolean) => ReactElement;
};

const ICON_SETS: Record<IconSet, ComponentType<any>> = {
  ionicons: Ionicons,
  material: MaterialIcons,
  community: MaterialCommunityIcons,
  feather: Feather,
  fontawesome: FontAwesome5,
};

const TAB_ITEMS: TabItem[] = [
  { route: "home", label: "Home", component: HomeIcon, size: 16 },
  { route: "menu", label: "Menu", component: MenuIcon, size: 16 },
  { route: "orders", label: "Orders", component: OrdersIcon, size: 16 },
  { route: "history", label: "History", component: HistoryIcon, size: 18 },
  { route: "settings", label: "Settings", component: SettingsIcon, size: 16 },
];

const TAB_ROUTE_NAMES = new Set(TAB_ITEMS.map((item) => item.route));

function recolor(node: ReactNode, color: string): ReactNode {
  if (!isValidElement(node)) return node;

  const props: any = node.props;
  const next: any = {};

  if (props.fill !== undefined && props.fill !== "none") next.fill = color;
  if (props.stroke !== undefined && props.stroke !== "none")
    next.stroke = color;
  if (props.color !== undefined) next.color = color;

  const children =
    props.children !== undefined
      ? Children.map(props.children, (child) => recolor(child, color))
      : undefined;

  return children !== undefined
    ? cloneElement(node, next, children)
    : cloneElement(node, next);
}

const svgCache = new WeakMap<ComponentType<SvgProps>, Map<string, ReactNode>>();

function getRecoloredSvg(
  Svg: ComponentType<SvgProps>,
  color: string,
): ReactNode {
  let colorMap = svgCache.get(Svg);
  if (!colorMap) {
    colorMap = new Map();
    svgCache.set(Svg, colorMap);
  }
  if (colorMap.has(color)) return colorMap.get(color);

  let content: ReactNode;
  try {
    const tree = (Svg as any)({
      width: "100%",
      height: "100%",
      color,
      fill: color,
    });
    content = recolor(tree, color);
  } catch {
    content = <Svg width="100%" height="100%" color={color} fill={color} />;
  }

  colorMap.set(color, content);
  return content;
}

const ColoredSvg = memo(function ColoredSvg({
  Svg,
  size,
  color,
}: {
  Svg: ComponentType<SvgProps>;
  size: number;
  color: string;
}) {
  return (
    <View style={{ width: size, height: size }}>
      {getRecoloredSvg(Svg, color)}
    </View>
  );
});

const TabIcon = memo(function TabIcon({
  item,
  color,
  focused,
}: {
  item: TabItem;
  color: string;
  focused: boolean;
}) {
  const size = (item.size ?? 16) + (focused ? FOCUS_BOOST : 0);

  if (item.render) return item.render(color, focused);

  const Svg =
    focused && item.focusedComponent ? item.focusedComponent : item.component;
  if (Svg) return <ColoredSvg Svg={Svg} size={size} color={color} />;

  const Icon = ICON_SETS[item.set ?? "ionicons"];
  const name = focused && item.focusedName ? item.focusedName : item.name;

  return <Icon name={name} size={size} color={color} />;
});

function FadeLabel({ text }: { text: string }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 150,
      delay: 20,
      easing: Easing.out(Easing.quad),
      useNativeDriver: native,
    }).start();
  }, []);

  return (
    <Animated.Text style={[styles.label, { opacity }]} numberOfLines={1}>
      {text}
    </Animated.Text>
  );
}

export default function TabBar({ state, descriptors, navigation }: any) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const current = state.routes[state.index]?.name;

  const payoutOpen = usePayoutOpen();
  const { open: orderDetailsOpen } = useOrderDetailsState();
  const { selectedId } = useOrderState();
  const { open: manageOpen } = useManageState();
  const { screen: catalogScreen } = useCatalog();
  const { screen: settingsScreen } = useSettings();

  const currentCatalog = String(catalogScreen ?? "");
  const currentSettings = String(settingsScreen ?? "");

  const hasOverlayOpen =
    Boolean(payoutOpen) ||
    Boolean(orderDetailsOpen) ||
    Boolean(selectedId) ||
    Boolean(manageOpen) ||
    ["products", "item", "categories", "category"].includes(currentCatalog) ||
    ["account", "security", "preferences"].includes(currentSettings);

  const visible = TAB_ITEMS.filter((item) =>
    state.routes.some((r: any) => r.name === item.route),
  );
  const count = visible.length;
  const routeIndex = Math.max(
    0,
    visible.findIndex((item) => item.route === current),
  );

  const [activeIndex, setActiveIndex] = useState(routeIndex);
  const [inner, setInner] = useState(BAR_WIDTH - PAD_X * 2);
  const slotWidth = (inner - PILL_WIDTH) / Math.max(count - 1, 1);
  const pillX = useRef(new Animated.Value(0)).current;
  const placed = useRef(false);

  useEffect(() => {
    setActiveIndex(routeIndex);
  }, [routeIndex]);

  useEffect(() => {
    const value = activeIndex * slotWidth;
    if (!placed.current) {
      pillX.setValue(value);
      placed.current = true;
      return;
    }
    Animated.spring(pillX, {
      toValue: value,
      damping: 20,
      stiffness: 280,
      mass: 0.7,
      useNativeDriver: native,
    }).start();
  }, [activeIndex, slotWidth]);

  if (!TAB_ROUTE_NAMES.has(current) || hasOverlayOpen) return null;

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrapper, { bottom: insets.bottom + 15 }]}
    >
      <View
        style={styles.container}
        onLayout={(e) => setInner(e.nativeEvent.layout.width - PAD_X * 2)}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            styles.pill,
            { width: PILL_WIDTH, transform: [{ translateX: pillX }] },
          ]}
        />

        {visible.map((item, index) => {
          const route = state.routes.find((r: any) => r.name === item.route);
          if (!route) return null;
          const isFocused = index === activeIndex;

          const handleSelect = () => {
            if (index === routeIndex) return;
            Keyboard.dismiss();
            setActiveIndex(index);
            if (navigation?.jumpTo) {
              navigation.jumpTo(route.name);
            } else {
              router.navigate(`/(tabs)/${route.name}` as any);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPressIn={handleSelect}
              hitSlop={12}
              pressRetentionOffset={20}
              unstable_pressDelay={0}
              style={[
                styles.tab,
                { width: isFocused ? PILL_WIDTH : slotWidth },
              ]}
            >
              <TabIcon
                item={item}
                color={isFocused ? ACTIVE : INACTIVE}
                focused={isFocused}
              />
              {isFocused && (
                <FadeLabel
                  text={
                    item.label ??
                    descriptors?.[route.key]?.options?.title ??
                    item.route
                  }
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 50,
    elevation: 50,
  },
  container: {
    width: BAR_WIDTH,
    flexDirection: "row",
    backgroundColor: ACTIVE,
    borderRadius: 50,
    paddingVertical: PAD_Y,
    paddingHorizontal: PAD_X,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  pill: {
    position: "absolute",
    left: PAD_X,
    top: PAD_Y,
    bottom: PAD_Y,
    borderRadius: 50,
    backgroundColor: INACTIVE,
  },
  tab: {
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
  },
  label: {
    color: ACTIVE,
    fontFamily: "Poppins_700Bold",
    fontSize: 13,
  },
});
