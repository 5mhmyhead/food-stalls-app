import { useRouter } from "expo-router";
import { useState } from "react";
import { Text } from "react-native";
import { session } from "../auth";
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
} from "../components/AuthKit";

export default function SignIn() {
  const router = useRouter();
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
      <Text style={authStyles.forgot} onPress={() => router.push("/recover")}>
        Forgot Password?
      </Text>
      <PrimaryButton title="Sign in" onPress={() => session.signIn()} />
      <FooterLink
        prefix="Don't have an account?"
        link="Sign up"
        onPress={() => router.replace("/sign-up")}
      />
    </AuthScreen>
  );
}
