import Kitty from "@/assets/icons/kitty.svg";
import MailIcon from "@/assets/icons/mail.svg";

import { TintedIcon } from "@/components/AuthKit";
import { showNotice } from "@/manageStore";

import { LinearGradient } from "expo-linear-gradient";
import { useRouter, type Href } from "expo-router";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

const COLORS = {
  background: "#FBE6E2",
  pink: "#E9698A",
  navy: "#243759",
  border: "#F3A3AF",
  inputBg: "#E6DDDB",
  white: "#FFFFFF",
};

type Go = (page: string, message?: string, params?: { email?: string }) => void;

export default function recover({ go }: { go?: Go }) {
  const router = useRouter();
  const { width: SW, height: SH } = useWindowDimensions();

  const FW = Math.min(SW, SH * (390 / 844));
  const u = FW / 390;
  const styles = useMemo(() => createStyles(u), [u]);

  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = (
    targetPage: string,
    path: Href,
    message?: string,
    params?: { email?: string },
  ) => {
    if (go) {
      go(targetPage, message, params);
    } else {
      if (message) showNotice(message, "auth");
      router.replace(path);
    }
  };

  const onSendCode = () => {
    const trimmed = email.trim();
    if (!trimmed) return setErrorMsg("please enter your email address.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return setErrorMsg("please enter a valid email address.");
    }
    setErrorMsg("");
    navigate(
      "verify",
      { pathname: "/verify", params: { email: trimmed } } as Href,
      undefined,
      { email: trimmed },
    );
  };

  const bubble = (size: number, left: number, top: number, opacity = 0.42) => (
    <LinearGradient
      colors={[`rgba(255,255,255,${opacity})`, "rgba(255,255,255,0)"]}
      start={{ x: 0.15, y: 0.15 }}
      end={{ x: 0.85, y: 0.85 }}
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: size / 2,
        left,
        top,
      }}
    />
  );

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.phone}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
          contentContainerStyle={{
            flexGrow: 1,
            minHeight: Math.max(SH, 844 * u),
            justifyContent: "space-between",
          }}
        >
          {/* header */}
          <View style={styles.header}>
            {bubble(148 * u, SW * 0.14, -46 * u, 0.44)}
            {bubble(215 * u, SW * 0.46, 6 * u, 0.36)}
            {bubble(34 * u, SW * 0.27, 172 * u, 0.45)}
          </View>

          {/* center content */}
          <View style={[styles.content, { maxWidth: FW }]}>
            <View style={styles.logo}>
              <TintedIcon
                Icon={Kitty}
                width={66 * u}
                height={62 * u}
                color={COLORS.navy}
              />
            </View>

            <Text style={styles.title}>{"recover\naccount"}</Text>
            <Text style={styles.subtitle}>
              {
                "please enter your email address\nto receive a verification code"
              }
            </Text>

            <View style={styles.form}>
              <View style={styles.field}>
                <Text style={styles.label}>email</Text>
                <View style={styles.inputBox}>
                  <TintedIcon
                    Icon={MailIcon}
                    width={20 * u}
                    height={20 * u}
                    color={COLORS.pink}
                  />
                  <View style={styles.divider} />
                  <TextInput
                    value={email}
                    onChangeText={(t) => {
                      setEmail(t);
                      setErrorMsg("");
                    }}
                    placeholder="dwyane.sido@example.com"
                    placeholderTextColor="rgba(36, 55, 89, 0.42)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    selectionColor={COLORS.pink}
                    style={styles.input}
                  />
                </View>
              </View>

              {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

              <TouchableOpacity
                style={styles.btn}
                onPress={onSendCode}
                activeOpacity={0.85}
              >
                <Text style={styles.btnText}>send code</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>remember your credentials? </Text>
              <Text
                style={styles.linkText}
                onPress={() => navigate("signin", "/")}
              >
                log in
              </Text>
            </View>
          </View>

          {/* footer */}
          <View style={styles.bottom}>
            {bubble(34 * u, SW * 0.47, 14 * u, 0.44)}
            {bubble(110 * u, SW * 0.56, 12 * u, 0.42)}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const createStyles = (u: number) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      width: "100%",
      backgroundColor: COLORS.background,
    },
    phone: {
      flex: 1,
      width: "100%",
      backgroundColor: COLORS.background,
    },
    header: {
      width: "100%",
      height: 266 * u,
      backgroundColor: COLORS.pink,
      borderBottomLeftRadius: 24 * u,
      borderBottomRightRadius: 24 * u,
      overflow: "hidden",
      position: "relative",
    },
    content: {
      flex: 1,
      width: "100%",
      alignSelf: "center",
      alignItems: "center",
      paddingTop: 18 * u,
      paddingBottom: 20 * u,
    },
    logo: {
      width: 66 * u,
      height: 62 * u,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 4 * u,
    },
    title: {
      fontFamily: "PlayfairDisplay_900Black_Italic",
      fontSize: 40 * u,
      lineHeight: 42 * u,
      color: COLORS.navy,
      textAlign: "center",
      includeFontPadding: false,
      marginBottom: 10 * u,
    },
    subtitle: {
      fontFamily: "Poppins_400Regular",
      fontSize: 12.5 * u,
      lineHeight: 18 * u,
      color: COLORS.navy,
      textAlign: "center",
      paddingHorizontal: 24 * u,
      marginBottom: 18 * u,
    },
    form: {
      width: 276 * u,
      alignSelf: "center",
    },
    field: {
      width: "100%",
      marginBottom: 12 * u,
    },
    label: {
      fontFamily: "Poppins_400Regular",
      fontSize: 11 * u,
      color: COLORS.navy,
      marginBottom: 5 * u,
    },
    inputBox: {
      width: "100%",
      height: 44 * u,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: COLORS.inputBg,
      borderWidth: 1.2 * u,
      borderColor: COLORS.border,
      borderRadius: 12 * u,
      paddingHorizontal: 12 * u,
    },
    divider: {
      width: 1 * u,
      height: 24 * u,
      backgroundColor: COLORS.border,
      marginHorizontal: 10 * u,
    },
    input: {
      flex: 1,
      minWidth: 0,
      height: "100%",
      fontFamily: "Poppins_400Regular",
      fontSize: 12 * u,
      color: COLORS.navy,
      paddingVertical: 0,
      ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {}),
    },
    btn: {
      width: "100%",
      height: 46 * u,
      borderRadius: 999,
      backgroundColor: COLORS.pink,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 12 * u,
    },
    btnText: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: 13 * u,
      color: COLORS.white,
    },
    footerRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 18 * u,
    },
    footerText: {
      fontFamily: "Poppins_400Regular",
      fontSize: 11 * u,
      color: COLORS.navy,
    },
    linkText: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: 11 * u,
      color: COLORS.pink,
      textDecorationLine: "underline",
    },
    bottom: {
      width: "100%",
      height: 74 * u,
      position: "relative",
      backgroundColor: COLORS.pink,
      borderTopLeftRadius: 24 * u,
      borderTopRightRadius: 24 * u,
      overflow: "hidden",
    },
    error: {
      fontFamily: "Poppins_400Regular",
      fontSize: 11 * u,
      color: COLORS.pink,
      marginTop: 2 * u,
      marginBottom: 4 * u,
    },
  });
