import Kitty from "@/assets/icons/kitty.svg";
import LockIcon from "@/assets/icons/lock.svg";
import MailIcon from "@/assets/icons/mail.svg";
import UserIcon from "@/assets/icons/user.svg";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import type { ComponentType, ReactNode } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SW, height: SH } = Dimensions.get("window");
export const FW = Math.min(SW, SH * (390 / 844));
export const u = FW / 390;

const SafeMaskedView = MaskedView as unknown as ComponentType<any>;
export type SvgIcon = ComponentType<{ width: number; height: number }>;

const FIELD_ICONS: Record<string, SvgIcon> = {
  "person-circle-outline": UserIcon,
  "lock-closed-outline": LockIcon,
  "mail-outline": MailIcon,
};

export function TintedIcon({
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
  return (
    <SafeMaskedView
      style={{ width, height }}
      maskElement={
        <View style={{ width, height, backgroundColor: "transparent" }}>
          <Icon width={width} height={height} />
        </View>
      }
    >
      <View style={{ flex: 1, backgroundColor: color }} />
    </SafeMaskedView>
  );
}

export type BubbleDir = "down" | "up" | "right" | "upright" | "downright";

export type BubbleSpec = {
  size: number;
  pos: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  dir: BubbleDir;
};

export function bubble(
  size: number,
  pos: BubbleSpec["pos"],
  dir: BubbleDir = "down",
): BubbleSpec {
  return { size, pos, dir };
}

const GRADIENT_DIRS: Record<
  BubbleDir,
  { start: { x: number; y: number }; end: { x: number; y: number } }
> = {
  down: { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
  up: { start: { x: 0.5, y: 1 }, end: { x: 0.5, y: 0 } },
  right: { start: { x: 0, y: 0.5 }, end: { x: 1, y: 0.5 } },
  upright: { start: { x: 0.15, y: 0.85 }, end: { x: 0.85, y: 0.15 } },
  downright: { start: { x: 0.15, y: 0.15 }, end: { x: 0.85, y: 0.85 } },
};

function AuthBubble({ size, pos, dir }: BubbleSpec) {
  const { start, end } = GRADIENT_DIRS[dir];
  return (
    <LinearGradient
      colors={["rgba(255,255,255,0.34)", "rgba(255,255,255,0.0)"]}
      start={start}
      end={end}
      style={{
        position: "absolute",
        width: size * u,
        height: size * u,
        borderRadius: (size * u) / 2,
        ...(pos.top !== undefined ? { top: pos.top * u } : {}),
        ...(pos.bottom !== undefined ? { bottom: pos.bottom * u } : {}),
        ...(pos.left !== undefined ? { left: pos.left * u } : {}),
        ...(pos.right !== undefined ? { right: pos.right * u } : {}),
      }}
    />
  );
}

export function TopDecor({
  height,
  bubbles,
}: {
  height: number;
  bubbles: BubbleSpec[];
}) {
  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        height: height * u,
        backgroundColor: "#E8708C",
        borderBottomLeftRadius: 34 * u,
        borderBottomRightRadius: 34 * u,
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
          <AuthBubble key={i} {...b} />
        ))}
      </View>
    </View>
  );
}

export function BottomDecor({
  height,
  bubbles,
}: {
  height: number;
  bubbles: BubbleSpec[];
}) {
  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        height: height * u,
        backgroundColor: "#E8708C",
        borderTopLeftRadius: 34 * u,
        borderTopRightRadius: 34 * u,
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
          <AuthBubble key={i} {...b} />
        ))}
      </View>
    </View>
  );
}

export function CatLogo() {
  return (
    <View
      style={{
        width: 54 * u,
        height: 44 * u,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 4 * u,
      }}
    >
      <TintedIcon Icon={Kitty} width={70 * u} height={60 * u} color="#253657" />
    </View>
  );
}

export function Field({
  label,
  icon,
  value,
  onChangeText,
  secure,
}: {
  label: string;
  icon: keyof typeof FIELD_ICONS | SvgIcon;
  value: string;
  onChangeText: (text: string) => void;
  secure?: boolean;
}) {
  const IconComp =
    typeof icon === "string" ? (FIELD_ICONS[icon] ?? UserIcon) : icon;

  return (
    <View style={{ marginBottom: 11 * u }}>
      <Text
        style={{
          fontFamily: "Poppins_400Regular",
          fontSize: 10.5 * u,
          color: "#243759",
          marginBottom: 4 * u,
          marginLeft: 2 * u,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: 44 * u,
          backgroundColor: "#E8DBD9",
          borderWidth: 1,
          borderColor: "#E8708C",
          borderRadius: 12 * u,
          paddingHorizontal: 13 * u,
        }}
      >
        <TintedIcon
          Icon={IconComp}
          width={19 * u}
          height={19 * u}
          color="#E8708C"
        />
        <View
          style={{
            width: 1,
            height: 22 * u,
            backgroundColor: "#E8708C",
            marginHorizontal: 11 * u,
          }}
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secure}
          autoCapitalize="none"
          autoCorrect={false}
          selectionColor="#E8708C"
          style={{
            flex: 1,
            fontFamily: "Poppins_400Regular",
            fontSize: 13 * u,
            color: "#243759",
            paddingVertical: 0,
            ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {}),
          }}
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
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        height: 44 * u,
        borderRadius: 999,
        backgroundColor: "#E8708C",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10 * u,
      }}
    >
      <Text
        style={{
          fontFamily: "Poppins_600SemiBold",
          fontSize: 13.5 * u,
          color: "#FFFFFF",
        }}
      >
        {title}
      </Text>
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
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 4 * u,
        marginTop: 14 * u,
      }}
    >
      <Text
        style={{
          fontFamily: "Poppins_400Regular",
          fontSize: 11 * u,
          color: "#243759",
        }}
      >
        {prefix}
      </Text>
      <Text
        onPress={onPress}
        style={{
          fontFamily: "Poppins_600SemiBold",
          fontSize: 11 * u,
          color: "#E8708C",
        }}
      >
        {link}
      </Text>
    </View>
  );
}

export function AuthScreen({
  contentTop,
  top,
  bottom,
  children,
}: {
  contentTop: number;
  top: ReactNode;
  bottom: ReactNode;
  children: ReactNode;
}) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, width: "100%", backgroundColor: "#FDEDEA" }}
    >
      {top}
      {bottom}
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: contentTop * u,
          paddingBottom: 95 * u,
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: FW,
            alignSelf: "center",
            paddingHorizontal: 32 * u,
          }}
        >
          {children}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export const authStyles = StyleSheet.create({
  title: {
    fontFamily: "PlayfairDisplay_900Black_Italic",
    fontSize: 36 * u,
    lineHeight: 42 * u,
    color: "#243759",
    textAlign: "center",
    marginBottom: 16 * u,
  },
  forgot: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 11 * u,
    color: "#E8708C",
    alignSelf: "flex-end",
    marginTop: -2 * u,
    marginBottom: 6 * u,
  },
});
