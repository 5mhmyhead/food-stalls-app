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
  CURRENCIES,
  changePassword,
  closeSettings,
  deleteAccount,
  saveCurrency,
  saveThreshold,
  setAccessCode,
  updateProfile,
  upgradeWithCode,
  useSettings,
} from "@/settingsStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState, type ReactNode } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

type Msg = { text: string; ok: boolean } | null;

const PINK = "#E8708C";
const PINK_SOFT = "#F9C6D2";
const FIELD_BG = "#F8E9E5";
const FIELD_BORDER = "#F0D3CD";

const bubbles = [
  { size: 130, top: -60, left: 100 },
  { size: 70, top: 25, left: 190 },
  { size: 24, top: 6, left: 290 },
];

function Sub({ children }: { children: ReactNode }) {
  return <Heading size={17}>{children}</Heading>;
}

function Body({ children }: { children: ReactNode }) {
  return (
    <Text
      style={{
        fontFamily: F.reg,
        fontSize: 11,
        lineHeight: 15,
        color: "#243759",
        marginTop: 3,
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
        fontSize: 10,
        color: "#243759",
        marginTop: 10,
        marginBottom: 4,
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
      selectionColor="#E8708C"
      style={{
        height: 34,
        borderRadius: 8,
        backgroundColor: "#F8E9E5",
        paddingHorizontal: 10,
        paddingVertical: 0,
        fontFamily: F.reg,
        fontSize: 13,
        color: "#243759",
      }}
    />
  );
}

function Divider() {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 14 * u,
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
        fontSize: 11,
        color: msg.ok ? "#5B8F6A" : "#E8708C",
        marginTop: 8,
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
    <View style={{ flexDirection: "row", marginTop: 12 * u }}>
      <PillButton title={title} variant={variant} onPress={onPress} />
    </View>
  );
}

function Title({ children }: { children: ReactNode }) {
  return (
    <View style={{ marginBottom: 8 * u }}>
      <Heading size={32}>{children}</Heading>
    </View>
  );
}

function CurrencyText({
  label,
  selected,
  size = 13,
}: {
  label: string;
  selected?: boolean;
  size?: number;
}) {
  const m = label.match(/^(.*?)\s*\((.+)\)\s*$/);
  const font = selected ? F.semi : F.reg;
  const textColor = selected ? PINK : "#243759";
  const symbolColor = selected ? PINK : "#3B6FD4";

  if (!m) {
    return (
      <Text style={{ fontFamily: font, fontSize: size, color: textColor }}>
        {label}
      </Text>
    );
  }

  return (
    <Text style={{ fontFamily: font, fontSize: size, color: textColor }}>
      {m[1]} (<Text style={{ color: symbolColor }}>{m[2]}</Text>)
    </Text>
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
      headerHeight={130}
      bubbles={bubbles}
      left={<IconBtn name="arrow-back" onPress={closeSettings} />}
    >
      <Title>Account Details</Title>

      <Card style={{ padding: 12 * u }}>
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

      <Card style={{ marginTop: 12 * u, padding: 12 * u }}>
        <View
          style={{ flexDirection: "row", alignItems: "center", gap: 12 * u }}
        >
          <View
            style={{
              width: 40 * u,
              height: 40 * u,
              borderRadius: 20 * u,
              backgroundColor: COLORS.soft,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="alert-circle-outline"
              size={20 * u}
              color={COLORS.navy}
            />
          </View>
          <View>
            <Text
              style={{ fontFamily: F.semi, fontSize: 13, color: "#243759" }}
            >
              About
            </Text>
            <Text style={{ fontFamily: F.reg, fontSize: 10, color: "#243759" }}>
              version 2.8.7
            </Text>
          </View>
        </View>
      </Card>
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
      headerHeight={130}
      bubbles={bubbles}
      left={<IconBtn name="arrow-back" onPress={closeSettings} />}
    >
      <Title>Security</Title>

      <Card style={{ padding: 12 * u }}>
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
    </Page>
  );
}

export function PreferencesPage() {
  const s = useSettings();
  const [draft, setDraft] = useState(s.currency);
  const [open, setOpen] = useState(false);
  const [threshold, setThreshold] = useState(String(s.threshold));
  const [currencyMsg, setCurrencyMsg] = useState<Msg>(null);
  const [thresholdMsg, setThresholdMsg] = useState<Msg>(null);

  const selected = CURRENCIES.find((c) => c.code === draft) ?? CURRENCIES[0];

  const onSaveCurrency = () => {
    saveCurrency(draft);
    setCurrencyMsg({ text: "Currency saved.", ok: true });
  };

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
      headerHeight={130}
      bubbles={bubbles}
      left={<IconBtn name="arrow-back" onPress={closeSettings} />}
    >
      <Title>Preferences</Title>

      <Card style={{ padding: 12 * u }}>
        <Sub>Currency</Sub>
        <Body>Set the currency used when showing prices.</Body>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setOpen(!open)}
          style={{
            height: 40,
            borderRadius: 10,
            backgroundColor: FIELD_BG,
            borderWidth: 1,
            borderColor: open ? PINK : FIELD_BORDER,
            paddingHorizontal: 12,
            marginTop: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <CurrencyText label={selected.label} />
          <Ionicons
            name={open ? "chevron-up" : "chevron-down"}
            size={14}
            color={PINK}
          />
        </TouchableOpacity>

        {open ? (
          <View
            style={{
              marginTop: 6,
              borderRadius: 10,
              backgroundColor: FIELD_BG,
              borderWidth: 1,
              borderColor: PINK,
              padding: 4,
            }}
          >
            {CURRENCIES.map((c) => {
              const isSelected = c.code === draft;
              return (
                <TouchableOpacity
                  key={c.code}
                  activeOpacity={0.85}
                  onPress={() => {
                    setDraft(c.code);
                    setOpen(false);
                  }}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: isSelected ? PINK : "transparent",
                    backgroundColor: isSelected ? PINK_SOFT : "transparent",
                  }}
                >
                  <CurrencyText label={c.label} selected={isSelected} />
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}

        <Notice msg={currencyMsg} />
        <Action title="Save" onPress={onSaveCurrency} />

        <Divider />

        <Sub>Inventory Threshold</Sub>
        <Body>Set when an item should be flagged as low on stock.</Body>
        <View style={{ marginTop: 8 }}>
          <Input value={threshold} onChangeText={setThreshold} numeric />
        </View>
        <Notice msg={thresholdMsg} />
        <Action title="Save" onPress={onSaveThreshold} />
      </Card>
    </Page>
  );
}
