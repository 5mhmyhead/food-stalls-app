import {
  PlayfairDisplay_900Black_Italic,
  useFonts,
} from "@expo-google-fonts/playfair-display";
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

const { width: SW, height: SH } = Dimensions.get("window");
export const FW = Math.min(SW, SH * (390 / 844));
export const u = FW / 390;

export const COLORS = {
  bg: "#FFFFFF",
  pink: "#E8708C",
  soft: "#F4A3B3",
  navy: "#243759",
  card: "#EBD9D5",
  border: "#F2BFCB",
  cream: "#F8E9E5",
  purple: "#B7A8DA",
};

export const F = {
  title: "PlayfairDisplay_900Black_Italic",
  reg: "Poppins_400Regular",
  semi: "Poppins_600SemiBold",
  bold: "Poppins_700Bold",
};

type BubbleSpec = { size: number; top: number; left: number };

type PageProps = {
  headerHeight: number;
  bubbles?: BubbleSpec[];
  left?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
};

export function Page({
  headerHeight,
  bubbles = [],
  left,
  right,
  children,
}: PageProps) {
  const [loaded] = useFonts({
    PlayfairDisplay_900Black_Italic,
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!loaded) return null;

  return (
    <View style={styles.outer}>
      <View style={styles.frame}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 130 * u }}
        >
          <View style={[styles.top, { height: headerHeight * u }]}>
            {bubbles.map((b, i) => (
              <LinearGradient
                key={i}
                colors={["rgba(255,255,255,0.55)", "rgba(255,255,255,0)"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={{
                  position: "absolute",
                  width: b.size * u,
                  height: b.size * u,
                  borderRadius: (b.size * u) / 2,
                  top: b.top * u,
                  left: b.left * u,
                }}
              />
            ))}
            <View style={styles.topRow}>
              <View style={styles.rowGap}>{left}</View>
              <View style={styles.rowGap}>{right}</View>
            </View>
          </View>
          <View style={styles.body}>{children}</View>
        </ScrollView>
      </View>
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
    <TouchableOpacity
      style={styles.iconBtn}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Ionicons name={name} size={20 * u} color={COLORS.navy} />
    </TouchableOpacity>
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
    <TouchableOpacity
      style={styles.labelBtn}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Ionicons name={icon} size={18 * u} color={COLORS.navy} />
      <Text style={styles.labelBtnText}>{title}</Text>
    </TouchableOpacity>
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
    variant === "solid"
      ? COLORS.pink
      : variant === "soft"
        ? COLORS.soft
        : COLORS.navy;
  return (
    <TouchableOpacity
      style={[styles.pill, { backgroundColor: bg }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={styles.pillText}>{title}</Text>
    </TouchableOpacity>
  );
}

export function Card({
  children,
  style,
  selected,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  selected?: boolean;
}) {
  return (
    <View
      style={[
        styles.card,
        selected && { borderColor: COLORS.pink, borderWidth: 1.5 },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function Heading({
  children,
  size = 30,
  center,
}: {
  children: React.ReactNode;
  size?: number;
  center?: boolean;
}) {
  return (
    <Text
      style={{
        fontFamily: F.title,
        fontSize: size * u,
        lineHeight: size * 1.15 * u,
        color: COLORS.navy,
        textAlign: center ? "center" : "left",
      }}
    >
      {children}
    </Text>
  );
}

export function SearchBar({
  placeholder,
  value,
  onChangeText,
}: {
  placeholder: string;
  value?: string;
  onChangeText?: (t: string) => void;
}) {
  return (
    <View style={styles.search}>
      <Ionicons name="search-outline" size={18 * u} color={COLORS.pink} />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor={COLORS.navy}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
      />
      {value ? (
        <TouchableOpacity
          onPress={() => onChangeText && onChangeText("")}
          activeOpacity={0.85}
        >
          <Ionicons name="close-circle" size={18 * u} color={COLORS.pink} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export function Thumb({
  width,
  height,
  color = "#C9B3A8",
  source,
}: {
  width: number | string;
  height: number;
  color?: string;
  source?: any;
}) {
  const size: any = { width, height: height * u };
  if (source) {
    return (
      <Image source={source} style={[size, styles.thumb]} resizeMode="cover" />
    );
  }
  return (
    <View style={[size, styles.thumb, { backgroundColor: color }]}>
      <Ionicons
        name="fast-food-outline"
        size={26 * u}
        color="rgba(255,255,255,0.8)"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { flex: 1, alignItems: "center", backgroundColor: COLORS.bg },
  frame: { width: FW, flex: 1, backgroundColor: COLORS.bg, overflow: "hidden" },
  top: {
    backgroundColor: COLORS.pink,
    borderBottomLeftRadius: 28 * u,
    borderBottomRightRadius: 28 * u,
    overflow: "hidden",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 44 * u,
    paddingHorizontal: 22 * u,
  },
  rowGap: { flexDirection: "row", alignItems: "center", gap: 10 * u },
  body: { paddingHorizontal: 22 * u, paddingTop: 22 * u },
  iconBtn: {
    width: 38 * u,
    height: 38 * u,
    borderRadius: 11 * u,
    backgroundColor: COLORS.cream,
    alignItems: "center",
    justifyContent: "center",
  },
  labelBtn: {
    height: 38 * u,
    borderRadius: 11 * u,
    backgroundColor: COLORS.cream,
    paddingHorizontal: 12 * u,
    flexDirection: "row",
    alignItems: "center",
    gap: 6 * u,
  },
  labelBtnText: { fontFamily: F.semi, fontSize: 13 * u, color: COLORS.navy },
  pill: {
    flex: 1,
    height: 32 * u,
    borderRadius: 16 * u,
    alignItems: "center",
    justifyContent: "center",
  },
  pillText: { fontFamily: F.semi, fontSize: 11.5 * u, color: "#FFFFFF" },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18 * u,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16 * u,
  },
  search: {
    height: 34 * u,
    borderRadius: 10 * u,
    borderWidth: 1.5,
    borderColor: COLORS.pink,
    backgroundColor: "#F6D5D8",
    paddingHorizontal: 10 * u,
    flexDirection: "row",
    alignItems: "center",
    gap: 8 * u,
  },
  searchInput: {
    flex: 1,
    fontFamily: F.reg,
    fontSize: 12 * u,
    color: COLORS.navy,
    paddingVertical: 0,
  },
  thumb: {
    borderRadius: 12 * u,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});
