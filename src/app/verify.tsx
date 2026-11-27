import Kitty from "@/assets/icons/kitty.svg";

import { TintedIcon } from "@/components/AuthKit";
import { showNotice } from "@/manageStore";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import { useEffect, useMemo, useState } from "react";
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

export default function verify({
  go,
  email: emailProp,
}: {
  go?: Go;
  email?: string;
}) {
  const router = useRouter();
  const routeParams = useLocalSearchParams<{ email?: string }>();
  const email = emailProp ?? routeParams.email ?? "dwyane.sido@example.com";

  const { width: SW, height: SH } = useWindowDimensions();

  const FW = Math.min(SW, SH * (390 / 844));
  const u = FW / 390;
  const styles = useMemo(() => createStyles(u), [u]);

  const [code, setCode] = useState("");
  const [seconds, setSeconds] = useState(50);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const formattedTime = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

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

  const onVerifyCode = () => {
    if (code.length !== 6) return setErrorMsg("please enter the 6-digit code.");
    setErrorMsg("");
    navigate(
      "reset",
      { pathname: "/reset", params: { email } } as Href,
      undefined,
      { email },
    );
  };

  const onResend = () => {
    if (seconds > 0) return;
    setCode("");
    setSeconds(50);
    setErrorMsg("");
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

  const backLeft = Math.max(24 * u, (SW - FW) / 2 + 24 * u);

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
            {bubble(150 * u, SW * 0.38, 18 * u, 0.45)}
            {bubble(96 * u, SW * 0.56, 94 * u, 0.44)}
            {bubble(32 * u, SW * 0.62, 42 * u, 0.42)}

            <TouchableOpacity
              style={[styles.backBtn, { left: backLeft }]}
              onPress={() => navigate("recover", "/recover")}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={18 * u} color={COLORS.navy} />
            </TouchableOpacity>
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

            <Text style={styles.title}>verify code</Text>
            <Text style={styles.subtitle}>
              {"please enter the code that was sent\nto "}
              <Text style={styles.linkText}>{email}</Text>
            </Text>

            <View style={styles.otpWrap}>
              <View style={styles.otpRow} pointerEvents="none">
                {Array.from({ length: 6 }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.otpBox,
                      code.length === i && styles.otpBoxActive,
                    ]}
                  >
                    <Text style={styles.otpDigit}>{code[i] || ""}</Text>
                  </View>
                ))}
              </View>
              <TextInput
                value={code}
                onChangeText={(t) => {
                  setCode(t.replace(/[^0-9]/g, "").slice(0, 6));
                  setErrorMsg("");
                }}
                keyboardType="number-pad"
                maxLength={6}
                caretHidden
                style={styles.hiddenOtp}
              />
            </View>

            <View style={styles.form}>
              {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

              <TouchableOpacity
                style={styles.btn}
                onPress={onVerifyCode}
                activeOpacity={0.85}
              >
                <Text style={styles.btnText}>verify code</Text>
              </TouchableOpacity>

              <Text style={styles.timer}>{formattedTime}</Text>

              <TouchableOpacity onPress={onResend} disabled={seconds > 0}>
                <Text style={[styles.resend, seconds > 0 && { opacity: 0.45 }]}>
                  resend code
                </Text>
              </TouchableOpacity>
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
      height: 210 * u,
      backgroundColor: COLORS.pink,
      borderBottomLeftRadius: 24 * u,
      borderBottomRightRadius: 24 * u,
      overflow: "hidden",
      position: "relative",
    },
    backBtn: {
      position: "absolute",
      top: 64 * u,
      width: 36 * u,
      height: 36 * u,
      borderRadius: 9 * u,
      backgroundColor: COLORS.background,
      alignItems: "center",
      justifyContent: "center",
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
    linkText: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: 12.5 * u,
      color: COLORS.pink,
      textDecorationLine: "underline",
    },
    otpWrap: {
      width: 288 * u,
      height: 42 * u,
      position: "relative",
      marginTop: 8 * u,
      marginBottom: 24 * u,
    },
    otpRow: {
      width: "100%",
      height: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    otpBox: {
      width: 42 * u,
      height: 42 * u,
      borderWidth: 1.2 * u,
      borderColor: COLORS.border,
      borderRadius: 10 * u,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.inputBg,
    },
    otpBoxActive: {
      borderColor: COLORS.pink,
    },
    otpDigit: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: 16 * u,
      color: COLORS.navy,
    },
    hiddenOtp: {
      position: "absolute",
      inset: 0,
      opacity: 0.02,
      color: "transparent",
    },
    form: {
      width: 276 * u,
      alignSelf: "center",
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
    timer: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: 16 * u,
      color: COLORS.navy,
      textAlign: "center",
      marginTop: 20 * u,
    },
    resend: {
      fontFamily: "Poppins_600SemiBold",
      fontSize: 11.5 * u,
      color: COLORS.pink,
      textAlign: "center",
      textDecorationLine: "underline",
      marginTop: 8 * u,
    },
    bottom: {
      width: "100%",
      height: 96 * u,
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
