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
import { type Href, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Easing, Platform, Text } from "react-native";

const { width: SW } = Dimensions.get("window");
const native = Platform.OS !== "web";

export default function Recover() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const translateX = useRef(new Animated.Value(SW)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: 0,
      damping: 26,
      stiffness: 250,
      mass: 0.9,
      overshootClamping: true,
      useNativeDriver: native,
    }).start();
  }, []);

  const navigateWithSlide = (path: Href) => {
    Animated.timing(translateX, {
      toValue: SW,
      duration: 240,
      easing: Easing.bezier(0.32, 0.72, 0, 1),
      useNativeDriver: native,
    }).start(() => router.replace(path));
  };

  return (
    <Animated.View style={{ flex: 1, transform: [{ translateX }] }}>
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
          onPress={() => navigateWithSlide("/")}
        />
        <FooterLink
          prefix="Remember your credentials?"
          link="Log in"
          onPress={() => navigateWithSlide("/")}
        />
      </AuthScreen>
    </Animated.View>
  );
}
