import { session, useLoggedIn } from "@/auth";
import {
  AuthScreen,
  BottomDecor,
  CatLogo,
  Field,
  FooterLink,
  PrimaryButton,
  TopDecor,
  authStyles,
  bubble,
} from "@/components/AuthKit";
import { clearNotice, showNotice, useManageState } from "@/manageStore";
import { Stack } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Platform,
  Text,
  View,
} from "react-native";

const { width: SW, height: SH } = Dimensions.get("window");
const FW = Math.min(SW, SH * (390 / 844));
const u = FW / 390;
const native = Platform.OS !== "web";

type Go = (page: string, message?: string) => void;

function Toast() {
  const { notice } = useManageState();
  const loggedIn = useLoggedIn();
  const slide = useRef(new Animated.Value(0)).current;

  const visible = notice !== null && (notice.scope === "auth") === !loggedIn;

  useEffect(() => {
    if (notice && !visible) clearNotice();
  }, [notice?.id, visible]);

  useEffect(() => {
    if (!notice || !visible) return;
    slide.setValue(0);
    const animation = Animated.sequence([
      Animated.timing(slide, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.back(1.3)),
        useNativeDriver: native,
      }),
      Animated.delay(2800),
      Animated.timing(slide, {
        toValue: 0,
        duration: 320,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: native,
      }),
    ]);
    animation.start(({ finished }) => {
      if (finished) clearNotice();
    });
    return () => animation.stop();
  }, [notice?.id, visible]);

  if (!notice || !visible) return null;

  const translateY = slide.interpolate({
    inputRange: [0, 1],
    outputRange: [-160 * u, 0],
  });
  const opacity = slide.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0, 1, 1],
    extrapolate: "clamp",
  });

  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 28 * u,
        left: 0,
        right: 0,
        alignItems: "center",
        zIndex: 100,
        elevation: 100,
      }}
    >
      <Animated.View
        style={{
          width: FW - 36 * u,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#EBD9D5",
          borderWidth: 1,
          borderColor: "#F2BFCB",
          borderRadius: 14 * u,
          paddingVertical: 8 * u,
          paddingHorizontal: 12 * u,
          opacity,
          transform: [{ translateY }],
        }}
      >
        <CatLogo />
        <Text
          style={{
            flex: 1,
            fontFamily: "Poppins_600SemiBold",
            fontSize: 19 * u,
            lineHeight: 26 * u,
            color: "#243759",
            textAlign: "center",
          }}
        >
          {notice.text}
        </Text>
      </Animated.View>
    </View>
  );
}

function SignInForm({ go }: { go: Go }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AuthScreen
      contentTop={325}
      top={
        <TopDecor
          height={259}
          bubbles={[
            bubble(222, { top: 8, left: 160 }, "down"),
            bubble(140, { top: -66, left: 0 }, "upright"),
            bubble(25, { top: 183, left: 62 }, "down"),
          ]}
        />
      }
      bottom={
        <BottomDecor
          height={68}
          bubbles={[
            bubble(23, { bottom: 23, left: 168 }, "down"),
            bubble(78, { bottom: -23, left: 215 }, "down"),
          ]}
        />
      }
    >
      <CatLogo />
      <Text style={authStyles.title}>Sign in</Text>
      <Field
        label="Username"
        icon="person-circle-outline"
        value={username}
        onChangeText={setUsername}
      />
      <Field
        label="Password"
        icon="lock-closed-outline"
        value={password}
        onChangeText={setPassword}
        secure
      />
      <Text style={authStyles.forgot} onPress={() => go("recover")}>
        Forgot Password?
      </Text>
      <PrimaryButton title="Sign in" onPress={() => session.signIn()} />
      <FooterLink
        prefix="Don't have an account?"
        link="Sign up"
        onPress={() => go("signup")}
      />
    </AuthScreen>
  );
}

function SignUpForm({ go }: { go: Go }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  return (
    <AuthScreen
      contentTop={207}
      top={
        <TopDecor
          height={139}
          bubbles={[
            bubble(144, { top: -35, left: 39 }, "upright"),
            bubble(86, { top: 62, left: 269 }, "up"),
            bubble(27, { top: 94, left: 199 }, "down"),
          ]}
        />
      }
      bottom={
        <BottomDecor
          height={34}
          bubbles={[bubble(117, { bottom: -101, left: 242 }, "down")]}
        />
      }
    >
      <CatLogo />
      <Text style={authStyles.title}>Sign up</Text>
      <Field
        label="Username"
        icon="person-circle-outline"
        value={username}
        onChangeText={setUsername}
      />
      <Field
        label="Email"
        icon="mail-outline"
        value={email}
        onChangeText={setEmail}
      />
      <Field
        label="Password"
        icon="lock-closed-outline"
        value={password}
        onChangeText={setPassword}
        secure
      />
      <Field
        label="Confirm Password"
        icon="lock-closed-outline"
        value={confirm}
        onChangeText={setConfirm}
        secure
      />
      <PrimaryButton
        title="Sign up"
        onPress={() => go("signin", "Account Created\nSuccessfully!")}
      />
      <FooterLink
        prefix="Already have an account?"
        link="Sign in"
        onPress={() => go("signin")}
      />
    </AuthScreen>
  );
}

function RecoverForm({ go }: { go: Go }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  return (
    <AuthScreen
      contentTop={226}
      top={
        <TopDecor
          height={197}
          bubbles={[
            bubble(140, { top: -66, left: 0 }, "right"),
            bubble(25, { top: 121, left: 62 }, "down"),
          ]}
        />
      }
      bottom={
        <BottomDecor
          height={101}
          bubbles={[
            bubble(195, { bottom: -129, left: 203 }, "downright"),
            bubble(27, { bottom: 62, left: 51 }, "down"),
          ]}
        />
      }
    >
      <CatLogo />
      <Text style={authStyles.title}>{"Recover\nAccount"}</Text>
      <Field
        label="Enter your email address"
        icon="mail-outline"
        value={email}
        onChangeText={setEmail}
      />
      <Field
        label="Enter your new password"
        icon="lock-closed-outline"
        value={password}
        onChangeText={setPassword}
        secure
      />
      <Field
        label="Confirm your new password"
        icon="lock-closed-outline"
        value={confirm}
        onChangeText={setConfirm}
        secure
      />
      <PrimaryButton
        title="Reset Password"
        onPress={() => go("signin", "Account Recovered\nSuccessfully!")}
      />
      <FooterLink
        prefix="Remember your credentials?"
        link="Log in"
        onPress={() => go("signin")}
      />
    </AuthScreen>
  );
}

function AuthFlow() {
  const [page, setPage] = useState("signin");

  const go: Go = (next, message) => {
    setPage(next);
    if (message) showNotice(message, "auth");
  };

  if (page === "signup") return <SignUpForm go={go} />;
  if (page === "recover") return <RecoverForm go={go} />;
  return <SignInForm go={go} />;
}

export default function RootLayout() {
  const loggedIn = useLoggedIn();

  return (
    <View style={{ flex: 1 }}>
      {loggedIn ? (
        <Stack screenOptions={{ headerShown: false }} />
      ) : (
        <AuthFlow />
      )}
      <Toast />
    </View>
  );
}
