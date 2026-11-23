import AboutIcon from "@/assets/icons/about.svg";
import { session } from "@/auth";
import {
  COLORS,
  Card,
  F,
  Heading,
  IconBtn,
  Page,
  PillButton,
  u,
} from "@/components/Ui";
import {
  changePassword,
  closeSettings,
  deleteAccount,
  saveThreshold,
  setAccessCode,
  updateProfile,
  upgradeWithCode,
  useSettings,
} from "@/settingsStore";
import { useRouter } from "expo-router";
import { useState, type ComponentType, type ReactNode } from "react";
import { Text, TextInput, View } from "react-native";

type SvgIcon = ComponentType<{
  width: number;
  height: number;
  color?: string;
  fill?: string;
  stroke?: string;
}>;

function TintedIcon({
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
  return <Icon width={width} height={height} color={color} fill={color} />;
}

type Msg = { text: string; ok: boolean } | null;

const T = {
  label: 10,
  body: 12.5,
  sub: 20,
  title: 32,
};

const S = {
  xs: 5 * u,
  sm: 8 * u,
  md: 13 * u,
  lg: 21 * u,
  xl: 34 * u,
};

const FIELD_H = 34 * u;
const LINE_H = 20 * u;

const bubbles = [
  { size: 145, top: -64, left: 96 },
  { size: 78, top: 28, left: 192 },
  { size: 28, top: 8, left: 292 },
];

function Sub({ children }: { children: ReactNode }) {
  return <Heading size={T.sub}>{children}</Heading>;
}

function Body({ children }: { children: ReactNode }) {
  return (
    <Text
      style={{
        fontFamily: F.reg,
        fontSize: T.body * u,
        lineHeight: LINE_H,
        color: COLORS.navy,
        marginTop: S.xs,
      }}
    >
      {children}
    </Text>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <Text
      style={{
        fontFamily: F.reg,
        fontSize: T.label * u,
        color: COLORS.navy,
        marginTop: S.md,
        marginBottom: S.xs,
      }}
    >
      {children}
    </Text>
  );
}

function Input({
  value,
  onChangeText,
  secure,
  numeric,
}: {
  value: string;
  onChangeText: (t: string) => void;
  secure?: boolean;
  numeric?: boolean;
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secure}
      keyboardType={numeric ? "numeric" : "default"}
      autoCapitalize="none"
      autoCorrect={false}
      selectionColor={COLORS.pink}
      style={{
        height: FIELD_H,
        borderRadius: S.sm,
        backgroundColor: COLORS.cream,
        paddingHorizontal: S.md,
        paddingVertical: 0,
        fontFamily: F.reg,
        fontSize: T.body * u,
        color: COLORS.navy,
      }}
    />
  );
}

function Divider() {
  return (
    <View
      style={{
        height: 2 * u,
        backgroundColor: COLORS.cream,
        marginVertical: S.lg,
      }}
    />
  );
}

function Notice({ msg }: { msg: Msg }) {
  if (!msg) return null;
  return (
    <Text
      style={{
        fontFamily: F.reg,
        fontSize: T.body * u,
        color: msg.ok ? "#5B8F6A" : COLORS.pink,
        marginTop: S.sm,
      }}
    >
      {msg.text}
    </Text>
  );
}

function Action({
  title,
  onPress,
  variant,
}: {
  title: string;
  onPress: () => void;
  variant?: "solid" | "soft" | "navy";
}) {
  return (
    <View style={{ flexDirection: "row", marginTop: S.md }}>
      <PillButton title={title} variant={variant} onPress={onPress} />
    </View>
  );
}

function Title({ children }: { children: ReactNode }) {
  return (
    <View style={{ marginBottom: S.sm }}>
      <Heading size={T.title}>{children}</Heading>
    </View>
  );
}

function AboutCard() {
  return (
    <Card style={{ marginTop: S.md, padding: S.lg }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: S.md }}>
        <View
          style={{
            width: 44 * u,
            height: 44 * u,
            borderRadius: 22 * u,
            backgroundColor: COLORS.soft,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TintedIcon
            Icon={AboutIcon}
            width={22 * u}
            height={22 * u}
            color={COLORS.navy}
          />
        </View>
        <View>
          <Text
            style={{
              fontFamily: F.semi,
              fontSize: 14.5 * u,
              color: COLORS.navy,
            }}
          >
            About
          </Text>
          <Text
            style={{
              fontFamily: F.reg,
              fontSize: T.label * u,
              color: COLORS.navy,
            }}
          >
            version 3.0.7
          </Text>
        </View>
      </View>
    </Card>
  );
}

export function AccountPage() {
  const router = useRouter();
  const s = useSettings();
  const [username, setUsername] = useState(s.username);
  const [email, setEmail] = useState(s.email);
  const [code, setCode] = useState("");
  const [profileMsg, setProfileMsg] = useState<Msg>(null);
  const [codeMsg, setCodeMsg] = useState<Msg>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const onUpdate = () => {
    const error = updateProfile(username, email);
    setProfileMsg(
      error
        ? { text: error, ok: false }
        : { text: "Profile updated.", ok: true },
    );
  };

  const onVerify = () => {
    if (!code.trim()) {
      setCodeMsg({ text: "Enter the access code.", ok: false });
      return;
    }
    if (upgradeWithCode(code)) {
      setCode("");
      setCodeMsg({ text: "Your account is now an admin account.", ok: true });
    } else {
      setCodeMsg({ text: "Incorrect access code.", ok: false });
    }
  };

  const onDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    deleteAccount();
    session.signOut();
    router.replace("/");
  };

  return (
    <Page
      headerHeight={144}
      bubbles={bubbles}
      left={<IconBtn name="arrow-back" onPress={closeSettings} />}
    >
      <Title>Account Details</Title>

      <Card style={{ padding: S.lg }}>
        <Sub>Change Account Details</Sub>
        <Body>You can change your username and email below.</Body>
        <Label>Username</Label>
        <Input value={username} onChangeText={setUsername} />
        <Label>Email Address</Label>
        <Input value={email} onChangeText={setEmail} />
        <Notice msg={profileMsg} />
        <Action title="Update Profile" onPress={onUpdate} />

        <Divider />

        <Sub>Account Type</Sub>
        {s.role === "admin" ? (
          <Body>Your current account type is admin.</Body>
        ) : (
          <>
            <Body>
              Your current account type is employee. If you have a staff access
              code, you can enter it below. This will upgrade your account to
              admin.
            </Body>
            <Label>Admin Access Code</Label>
            <Input value={code} onChangeText={setCode} secure />
            <Notice msg={codeMsg} />
            <Action title="Verify Access Code" onPress={onVerify} />
          </>
        )}

        <Divider />

        <Sub>Delete account</Sub>
        <Body>
          Permanently remove your account. Orders you handled stay in the shop's
          history.
        </Body>
        {confirmDelete ? (
          <Notice
            msg={{ text: "Tap Delete Account again to confirm.", ok: false }}
          />
        ) : null}
        <Action title="Delete Account" onPress={onDelete} />
      </Card>

      <AboutCard />
    </Page>
  );
}

export function SecurityPage() {
  const s = useSettings();
  const isAdmin = s.role === "admin";
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [newCode, setNewCode] = useState("");
  const [pwMsg, setPwMsg] = useState<Msg>(null);
  const [codeMsg, setCodeMsg] = useState<Msg>(null);
  const [outMsg, setOutMsg] = useState<Msg>(null);

  const onChangePassword = () => {
    const error = changePassword(current, next);
    if (error) {
      setPwMsg({ text: error, ok: false });
      return;
    }
    setCurrent("");
    setNext("");
    setPwMsg({ text: "Password changed.", ok: true });
  };

  const onSaveCode = () => {
    const error = setAccessCode(newCode);
    if (error) {
      setCodeMsg({ text: error, ok: false });
      return;
    }
    setNewCode("");
    setCodeMsg({ text: "Access code updated.", ok: true });
  };

  const onSignOutOthers = () => {
    setOutMsg({ text: "Signed out of all other devices.", ok: true });
  };

  return (
    <Page
      headerHeight={144}
      bubbles={bubbles}
      left={<IconBtn name="arrow-back" onPress={closeSettings} />}
    >
      <Title>Security</Title>

      <Card style={{ padding: S.lg }}>
        <Sub>Change Password</Sub>
        <Body>
          Your new password should contain at least 8 characters, a capital
          letter, and a number.
        </Body>
        <Label>Current Password</Label>
        <Input value={current} onChangeText={setCurrent} secure />
        <Label>New password</Label>
        <Input value={next} onChangeText={setNext} secure />
        <Notice msg={pwMsg} />
        <Action title="Change Password" onPress={onChangePassword} />

        {isAdmin ? (
          <>
            <Divider />
            <Sub>Admin Access Code</Sub>
            <Body>
              Update the access code for workers to upgrade their account to
              admin.
            </Body>
            <Label>Access Code</Label>
            <Input value={newCode} onChangeText={setNewCode} />
            <Notice msg={codeMsg} />
            <Action title="Verify Access Code" onPress={onSaveCode} />
          </>
        ) : null}

        <Divider />

        <Sub>Sign Out of All Devices</Sub>
        <Body>
          This will sign you out of all sessions and devices, except this one.
        </Body>
        <Notice msg={outMsg} />
        <Action title="Sign Out" onPress={onSignOutOthers} />
      </Card>

      {isAdmin ? <AboutCard /> : null}
    </Page>
  );
}

export function PreferencesPage() {
  const s = useSettings();
  const [threshold, setThreshold] = useState(String(s.threshold));
  const [thresholdMsg, setThresholdMsg] = useState<Msg>(null);

  const onSaveThreshold = () => {
    const text = threshold.trim();
    const error =
      text === ""
        ? "Enter a whole number, 0 or higher."
        : saveThreshold(Number(text));
    setThresholdMsg(
      error
        ? { text: error, ok: false }
        : { text: "Threshold saved.", ok: true },
    );
  };

  return (
    <Page
      headerHeight={144}
      bubbles={bubbles}
      left={<IconBtn name="arrow-back" onPress={closeSettings} />}
    >
      <Title>Preferences</Title>

      <Card style={{ padding: S.lg }}>
        <Sub>Inventory Threshold</Sub>
        <Body>Set when an item should be flagged as low on stock.</Body>
        <View style={{ marginTop: S.md }}>
          <Input value={threshold} onChangeText={setThreshold} numeric />
        </View>
        <Notice msg={thresholdMsg} />
        <Action title="Save" onPress={onSaveThreshold} />
      </Card>
    </Page>
  );
}
