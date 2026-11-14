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
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { SvgProps } from "react-native-svg";

import HistoryIcon from "@/assets/icons/history.svg";
import HomeIcon from "@/assets/icons/home.svg";
import MenuIcon from "@/assets/icons/menu.svg";
import OrdersIcon from "@/assets/icons/orders.svg";
import SettingsIcon from "@/assets/icons/settings.svg";

const hiddenOn = ["sign-in", "sign-up", "recover", "payout"];

const { width: SW, height: SH } = Dimensions.get("window");
const FW = Math.min(SW, SH * (390 / 844));

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
  { route: "home", component: HomeIcon, size: 16 },
  { route: "menu", component: MenuIcon, size: 16 },
  { route: "orders", component: OrdersIcon, size: 16 },
  { route: "history", component: HistoryIcon, size: 18 },
  { route: "settings", component: SettingsIcon, size: 16 },
];

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

function ColoredSvg({
  Svg,
  size,
  color,
}: {
  Svg: ComponentType<SvgProps>;
  size: number;
  color: string;
}) {
  let content: ReactNode;

  try {
    const tree = (Svg as any)({ width: "100%", height: "100%", color });
    content = recolor(tree, color);
  } catch {
    content = <Svg width="100%" height="100%" color={color} />;
  }

  return <View style={{ width: size, height: size }}>{content}</View>;
}

function TabIcon({
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
}

function FadeLabel({ text }: { text: string }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 260,
      delay: 90,
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

export default function TabBar({ state, descriptors }: any) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const current = state.routes[state.index].name;

  const visible = TAB_ITEMS.filter((item) =>
    state.routes.some((r: any) => r.name === item.route),
  );
  const count = visible.length;
  const activeIndex = Math.max(
    0,
    visible.findIndex((item) => item.route === current),
  );

  const [inner, setInner] = useState(BAR_WIDTH - PAD_X * 2);
  const slotWidth = (inner - PILL_WIDTH) / Math.max(count - 1, 1);
  const pillX = useRef(new Animated.Value(0)).current;
  const placed = useRef(false);

  useEffect(() => {
    const value = activeIndex * slotWidth;
    if (!placed.current) {
      pillX.setValue(value);
      placed.current = true;
      return;
    }
    Animated.spring(pillX, {
      toValue: value,
      damping: 16,
      stiffness: 170,
      mass: 0.9,
      useNativeDriver: native,
    }).start();
  }, [activeIndex, slotWidth]);

  if (hiddenOn.includes(current)) return null;

  return (
    <View style={[styles.wrapper, { bottom: insets.bottom + 15 }]}>
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
          const isFocused = index === activeIndex;

          const onPress = () => {
            if (isFocused) return;
            router.navigate(`/${route.name}` as any);
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.8}
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
                  text={item.label ?? descriptors[route.key].options.title}
                />
              )}
            </TouchableOpacity>
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
