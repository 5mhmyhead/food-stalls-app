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
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text } from "react-native";

export default function SignUp() {
  const router = useRouter();
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
      <PrimaryButton title="Sign up" onPress={() => router.replace("/")} />
      <FooterLink
        prefix="Already have an account?"
        link="Sign in"
        onPress={() => router.replace("/")}
      />
    </AuthScreen>
  );
}
