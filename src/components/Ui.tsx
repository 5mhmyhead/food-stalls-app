import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  Children,
  cloneElement,
  isValidElement,
  memo,
  type ComponentType,
  type ReactNode,
} from "react";
import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  type ImageSourcePropType,
  type ViewStyle,
} from "react-native";

const { width: SW, height: SH } = Dimensions.get("window");
export const FW = Math.min(SW, SH * (390 / 844));
export const u = FW / 390;

export const COLORS = {
  bg: "#FDEDEA",
  cream: "#F8E9E5",
  card: "#E8DBD9",
  pink: "#E8708C",
  soft: "#F4A3B3",
  navy: "#243759",
  border: "#DFD3D1",
  white: "#FFFFFF",
};

export const F = {
  title: "PlayfairDisplay_900Black_Italic",
  reg: "Poppins_400Regular",
  semi: "Poppins_600SemiBold",
  bold: "Poppins_700Bold",
};

export type SvgIcon = ComponentType<{
  width?: number | string;
  height?: number | string;
  color?: string;
  fill?: string;
  stroke?: string;
}>;

function recolorNode(node: ReactNode, color: string): ReactNode {
  if (!isValidElement(node)) return node;
  const props: any = node.props;
  const next: any = {};

  if (props.fill !== undefined && props.fill !== "none") next.fill = color;
  if (props.stroke !== undefined && props.stroke !== "none")
    next.stroke = color;
  if (props.color !== undefined) next.color = color;

  const children =
    props.children !== undefined
      ? Children.map(props.children, (child) => recolorNode(child, color))
      : undefined;

  return children !== undefined
    ? cloneElement(node, next, children)
    : cloneElement(node, next);
}

const iconCache = new WeakMap<SvgIcon, Map<string, ReactNode>>();

function getTintedSvg(Icon: SvgIcon, color: string): ReactNode {
  let map = iconCache.get(Icon);
  if (!map) {
    map = new Map();
    iconCache.set(Icon, map);
  }
  if (map.has(color)) return map.get(color);

  let tree: ReactNode;
  try {
    const raw = (Icon as any)({
      width: "100%",
      height: "100%",
      color,
      fill: color,
    });
    tree = recolorNode(raw, color);
  } catch {
    tree = <Icon width="100%" height="100%" color={color} fill={color} />;
  }
  map.set(color, tree);
  return tree;
}

export const TintedIcon = memo(function TintedIcon({
  Icon,
  width,
  height,
  color,
}: {
  Icon: SvgIcon;
  width: number;
  height: number;
  color: string;
}) {
  return <View style={{ width, height }}>{getTintedSvg(Icon, color)}</View>;
});

export function Heading({
  size = 24,
  center,
  children,
}: {
  size?: number;
  center?: boolean;
  children: ReactNode;
}) {
  return (
    <Text
      style={{
        fontFamily: F.title,
        fontSize: size * u,
        color: COLORS.navy,
        textAlign: center ? "center" : "left",
      }}
    >
      {children}
    </Text>
  );
}

export function Card({
  selected,
  style,
  children,
}: {
  selected?: boolean;
  style?: ViewStyle;
  children: ReactNode;
}) {
  return (
    <View
      style={[
        {
          backgroundColor: COLORS.card,
          borderRadius: 16 * u,
          borderWidth: 1,
          borderColor: selected ? COLORS.pink : COLORS.border,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function IconBtn({
  name,
  onPress,
}: {
  name: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      hitSlop={8}
      unstable_pressDelay={0}
      style={({ pressed }) => ({
        width: 38 * u,
        height: 38 * u,
        borderRadius: 11 * u,
        backgroundColor: COLORS.bg,
        alignItems: "center",
        justifyContent: "center",
        opacity: pressed ? 0.78 : 1,
      })}
    >
      <Ionicons name={name} size={19 * u} color={COLORS.navy} />
    </Pressable>
  );
}

export function LabelBtn({
  title,
  icon,
  onPress,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      unstable_pressDelay={0}
      style={({ pressed }) => ({
        height: 38 * u,
        paddingHorizontal: 14 * u,
        borderRadius: 11 * u,
        backgroundColor: COLORS.bg,
        flexDirection: "row",
        alignItems: "center",
        gap: 7 * u,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <Ionicons name={icon} size={17 * u} color={COLORS.navy} />
      <Text
        style={{
          fontFamily: F.semi,
          fontSize: 12.5 * u,
          color: COLORS.navy,
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}

export function PillButton({
  title,
  variant = "solid",
  onPress,
}: {
  title: string;
  variant?: "solid" | "soft" | "navy";
  onPress?: () => void;
}) {
  const bg =
    variant === "navy"
      ? COLORS.navy
      : variant === "soft"
        ? "#F6C2CD"
        : COLORS.pink;
  const color = variant === "soft" ? COLORS.navy : COLORS.white;

  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      unstable_pressDelay={0}
      style={({ pressed }) => ({
        flex: 1,
        height: 36 * u,
        borderRadius: 999,
        backgroundColor: bg,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16 * u,
        opacity: pressed ? 0.82 : 1,
      })}
    >
      <Text
        style={{
          fontFamily: F.semi,
          fontSize: 12 * u,
          color,
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}

export function SearchBar({
  placeholder = "search for a meal...",
  value,
  onChangeText,
}: {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        height: 44 * u,
        backgroundColor: "#E8DBD9",
        borderWidth: 1,
        borderColor: "#E8708C",
        borderRadius: 12 * u,
        paddingHorizontal: 14 * u,
      }}
    >
      <Ionicons name="search-outline" size={20 * u} color="#E8708C" />
      <View
        style={{
          width: 1,
          height: 24 * u,
          backgroundColor: "#E8708C",
          marginLeft: 12 * u,
          marginRight: 12 * u,
        }}
      />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#243759"
        value={value}
        onChangeText={onChangeText}
        style={{
          flex: 1,
          fontFamily: F.reg,
          fontSize: 13 * u,
          color: "#243759",
          paddingVertical: 0,
          ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {}),
        }}
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText("")} hitSlop={8}>
          <Ionicons name="close-circle" size={16 * u} color="#E8708C" />
        </Pressable>
      )}
    </View>
  );
}

export function Thumb({
  width,
  height,
  color = "#F4A3B3",
  source,
}: {
  width: number | `${number}%`;
  height: number;
  color?: string;
  source?: ImageSourcePropType;
}) {
  return (
    <View
      style={{
        width,
        height: height * u,
        borderRadius: 12 * u,
        backgroundColor: color,
        overflow: "hidden",
      }}
    >
      {source ? (
        <Image
          source={source}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      ) : null}
    </View>
  );
}

export function Page({
  headerHeight = 145,
  bubbles = [],
  left,
  right,
  children,
}: {
  headerHeight?: number;
  bubbles?: { size: number; top: number; left?: number; right?: number }[];
  left?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 110 * u }}
      >
        <View
          style={{
            width: "100%",
            height: headerHeight * u,
            backgroundColor: COLORS.pink,
            borderBottomLeftRadius: 28 * u,
            borderBottomRightRadius: 28 * u,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: "100%",
              maxWidth: FW,
              height: "100%",
              alignSelf: "center",
            }}
          >
            {bubbles.map((b, i) => (
              <LinearGradient
                key={i}
                colors={["rgba(255,255,255,0.34)", "rgba(255,255,255,0.0)"]}
                start={{ x: 0.25, y: 0 }}
                end={{ x: 0.75, y: 1 }}
                style={{
                  position: "absolute",
                  width: b.size * u,
                  height: b.size * u,
                  borderRadius: (b.size * u) / 2,
                  top: b.top * u,
                  ...(b.left !== undefined ? { left: b.left * u } : {}),
                  ...(b.right !== undefined ? { right: b.right * u } : {}),
                }}
              />
            ))}

            {(left || right) && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 22 * u,
                  paddingTop: 46 * u,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8 * u,
                  }}
                >
                  {left}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8 * u,
                  }}
                >
                  {right}
                </View>
              </View>
            )}
          </View>
        </View>

        <View
          style={{
            width: "100%",
            maxWidth: FW,
            alignSelf: "center",
            paddingHorizontal: 22 * u,
            marginTop: 16 * u,
          }}
        >
          {children}
        </View>
      </ScrollView>
    </View>
  );
}
