import {
  PlayfairDisplay_900Black_Italic,
  useFonts,
} from "@expo-google-fonts/playfair-display";
import {
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Kitty from "../../assets/icons/kitty.svg";

const { width: SW, height: SH } = Dimensions.get("window");
const FW = Math.min(SW, SH * (390 / 844));
const u = FW / 390;

export const COLORS = {
  bg: "#F9E8E2",
  pink: "#E8708C",
  navy: "#243759",
  border: "#F2B3C2",
};

type Dir = "down" | "up" | "left" | "right" | "upright" | "downright";

const DIRS: Record<
  Dir,
  { start: { x: number; y: number }; end: { x: number; y: number } }
> = {
  down: { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
  up: { start: { x: 0.5, y: 1 }, end: { x: 0.5, y: 0 } },
  right: { start: { x: 0, y: 0.5 }, end: { x: 1, y: 0.5 } },
  left: { start: { x: 1, y: 0.5 }, end: { x: 0, y: 0.5 } },
  upright: { start: { x: 0, y: 1 }, end: { x: 1, y: 0 } },
  downright: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
};

export type BubbleSpec = { size: number; pos: ViewStyle; dir: Dir };

export function bubble(
  size: number,
  pos: { top?: number; bottom?: number; left?: number; right?: number },
  dir: Dir = "down",
): BubbleSpec {
  const scaled: Record<string, number> = {};
  Object.entries(pos).forEach(([k, v]) => {
    if (v !== undefined) scaled[k] = v * u;
  });
  return { size: size * u, pos: scaled as ViewStyle, dir };
}

function Bubble({ spec }: { spec: BubbleSpec }) {
  const d = DIRS[spec.dir];
  return (
    <LinearGradient
      colors={["rgba(255,255,255,0.6)", "rgba(255,255,255,0)"]}
      start={d.start}
      end={d.end}
      style={[
        {
          position: "absolute",
          width: spec.size,
          height: spec.size,
          borderRadius: spec.size / 2,
        },
        spec.pos,
      ]}
    />
  );
}

export function TopDecor({
  height,
  bubbles = [],
}: {
  height: number;
  bubbles?: BubbleSpec[];
}) {
  return (
    <View style={[styles.topBlock, { height: height * u }]}>
      {bubbles.map((b, i) => (
        <Bubble key={i} spec={b} />
      ))}
    </View>
  );
}

export function BottomDecor({
  height,
  bubbles = [],
}: {
  height: number;
  bubbles?: BubbleSpec[];
}) {
  return (
    <View style={[styles.bottomBlock, { height: height * u }]}>
      {bubbles.map((b, i) => (
        <Bubble key={i} spec={b} />
      ))}
    </View>
  );
}

export function CatLogo() {
  return (
    <View style={styles.logo}>
      <Kitty width="100%" height="100%" color={COLORS.navy} />
    </View>
  );
}

type FieldProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  onChangeText: (t: string) => void;
  secure?: boolean;
};

export function Field({
  label,
  icon,
  value,
  onChangeText,
  secure,
}: FieldProps) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputBox}>
        <Ionicons name={icon} size={20 * u} color={COLORS.pink} />
        <View style={styles.divider} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secure}
          autoCapitalize="none"
        />
      </View>
    </View>
  );
}

export function PrimaryButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

export function FooterLink({
  prefix,
  link,
  onPress,
}: {
  prefix: string;
  link: string;
  onPress: () => void;
}) {
  return (
    <Text style={styles.footer}>
      {prefix}{" "}
      <Text style={styles.footerLink} onPress={onPress}>
        {link}
      </Text>
    </Text>
  );
}

export function AuthScreen({
  top,
  bottom,
  contentTop,
  children,
}: {
  top: React.ReactNode;
  bottom: React.ReactNode;
  contentTop: number;
  children: React.ReactNode;
}) {
  const [loaded] = useFonts({
    PlayfairDisplay_900Black_Italic,
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!loaded) return null;

  return (
    <View style={styles.outer}>
      <View style={styles.frame}>
        {top}
        {bottom}
        <View style={[styles.content, { top: contentTop * u }]}>
          <View style={styles.form}>{children}</View>
        </View>
      </View>
    </View>
  );
}

export const authStyles = StyleSheet.create({
  title: {
    fontFamily: "PlayfairDisplay_900Black_Italic",
    fontSize: 46 * u,
    lineHeight: 50 * u,
    color: COLORS.navy,
    textAlign: "center",
    marginBottom: 16 * u,
  },
  forgot: {
    alignSelf: "flex-end",
    fontFamily: "Poppins_400Regular",
    color: COLORS.pink,
    fontSize: 11 * u,
    marginBottom: 12 * u,
  },
});

const styles = StyleSheet.create({
  outer: { flex: 1, alignItems: "center", backgroundColor: COLORS.bg },
  frame: {
    width: FW,
    flex: 1,
    backgroundColor: COLORS.bg,
    overflow: "hidden",
  },
  content: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  topBlock: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.pink,
    borderBottomLeftRadius: 24 * u,
    borderBottomRightRadius: 24 * u,
    overflow: "hidden",
  },
  bottomBlock: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.pink,
    borderTopLeftRadius: 24 * u,
    borderTopRightRadius: 24 * u,
    overflow: "hidden",
  },
  form: { width: 242 * u, alignItems: "stretch" },
  logo: {
    alignSelf: "center",
    width: 64 * u,
    height: 50 * u,
    marginBottom: 6 * u,
  },
  fieldWrap: { marginBottom: 12 * u },
  label: {
    fontFamily: "Poppins_400Regular",
    color: COLORS.navy,
    fontSize: 11.5 * u,
    marginBottom: 5 * u,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    height: 35 * u,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9 * u,
    paddingHorizontal: 8 * u,
  },
  divider: {
    width: 1,
    height: 16 * u,
    backgroundColor: COLORS.navy,
    marginHorizontal: 7 * u,
  },
  input: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    color: COLORS.navy,
    fontSize: 12 * u,
    paddingVertical: 0,
  },
  button: {
    height: 33 * u,
    borderRadius: 17 * u,
    backgroundColor: COLORS.pink,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8 * u,
  },
  buttonText: {
    fontFamily: "Poppins_400Regular",
    color: "#FFFFFF",
    fontSize: 11.5 * u,
  },
  footer: {
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
    color: COLORS.navy,
    fontSize: 11 * u,
    marginTop: 16 * u,
  },
  footerLink: { fontFamily: "Poppins_700Bold", color: COLORS.pink },
});
