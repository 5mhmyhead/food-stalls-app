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

export default function Recover() {
  const router = useRouter();
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
        onPress={() => router.replace("/")}
      />
      <FooterLink
        prefix="Remember your credentials?"
        link="Log in"
        onPress={() => router.replace("/")}
      />
    </AuthScreen>
  );
}
