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

export default function SignUp() {
  const router = useRouter();
  const [username, setUsername] = useState("");
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
        <PrimaryButton title="Sign up" onPress={() => navigateWithSlide("/")} />
        <FooterLink
          prefix="Already have an account?"
          link="Sign in"
          onPress={() => navigateWithSlide("/")}
        />
      </AuthScreen>
    </Animated.View>
  );
}
