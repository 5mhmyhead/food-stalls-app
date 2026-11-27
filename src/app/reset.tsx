import Kitty from "@/assets/icons/kitty.svg";
import LockIcon from "@/assets/icons/lock.svg";

import { session } from "@/auth";
import { TintedIcon } from "@/components/AuthKit";
import { showNotice } from "@/manageStore";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter, type Href } from "expo-router";
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

export default function reset({
  go,
  email: emailProp,
}: {
  go?: Go;
  email?: string;
}) {
  const router = useRouter();
  const routeParams = useLocalSearchParams<{ email?: string }>();
  const email = emailProp ?? routeParams.email ?? "";

  const { width: SW, height: SH } = useWindowDimensions();

  const FW = Math.min(SW, SH * (390 / 844));
  const u = FW / 390;
  const styles = useMemo(() => createStyles(u), [u]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  const onSavePassword = async () => {
    if (submitting) return;
    if (!password || !confirm) {
      return setErrorMsg("please fill out both password fields.");
    }
    if (password !== confirm) return setErrorMsg("passwords do not match.");

    setErrorMsg("");
    setSubmitting(true);
    const err = await session.recoverAccount({ email, password, confirm });
    setSubmitting(false);

    if (err) return setErrorMsg(err);
    navigate("signin", "/", "password\nreset!");
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

  const renderPasswordInput = ({
    label,
    value,
    onChangeText,
    visible,
    onToggle,
  }: {
    label: string;
    value: string;
    onChangeText: (v: string) => void;
    visible: boolean;
    onToggle: () => void;
  }) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputBox}>
        <TintedIcon
          Icon={LockIcon}
          width={20 * u}
          height={20 * u}
          color={COLORS.pink}
        />
        <View style={styles.divider} />
        <TextInput
          value={value}
          onChangeText={(t) => {
            onChangeText(t);
            setErrorMsg("");
          }}
          placeholder="••••••••••••"
          placeholderTextColor="rgba(36, 55, 89, 0.42)"
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
          selectionColor={COLORS.pink}
          style={styles.input}
        />
        <TouchableOpacity onPress={onToggle} hitSlop={8}>
          <Ionicons
            name={visible ? "eye-outline" : "eye-off-outline"}
            size={18 * u}
            color={COLORS.navy}
          />
        </TouchableOpacity>
      </View>
    </View>
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
              onPress={() =>
                navigate(
                  "verify",
                  { pathname: "/verify", params: { email } } as Href,
                  undefined,
                  { email },
                )
              }
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

            <Text style={styles.title}>{"reset\npassword"}</Text>
            <Text style={styles.subtitle}>
              enter a new password to reset the password
            </Text>

            <View style={styles.form}>
              {renderPasswordInput({
                label: "password",
                value: password,
                onChangeText: setPassword,
                visible: showPassword,
                onToggle: () => setShowPassword((v) => !v),
              })}

              {renderPasswordInput({
                label: "confirm password",
                value: confirm,
                onChangeText: setConfirm,
                visible: showConfirm,
                onToggle: () => setShowConfirm((v) => !v),
              })}

              {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

              <TouchableOpacity
                style={[styles.btn, submitting && { opacity: 0.65 }]}
                onPress={onSavePassword}
                disabled={submitting}
                activeOpacity={0.85}
              >
                <Text style={styles.btnText}>
                  {submitting ? "saving..." : "save password"}
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
