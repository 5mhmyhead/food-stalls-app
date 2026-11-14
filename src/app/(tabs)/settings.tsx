import { session } from "@/auth";
import { COLORS, Card, F, Page, PillButton, u } from "@/components/Ui";
import { openSettings } from "@/settingsStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

const settings = [
  {
    key: "account",
    icon: "person-circle-outline",
    tint: "#F4A3B3",
    title: "Account",
    sub: "Change Account Details, Account Type",
  },
  {
    key: "security",
    icon: "lock-closed-outline",
    tint: "#E8708C",
    title: "Security",
    sub: "Change Password, Admin Pass",
  },
  {
    key: "preferences",
    icon: "folder-open-outline",
    tint: "#B7A8DA",
    title: "Preferences",
    sub: "Currency, Inventory Threshold",
  },
] as const;

export default function Settings() {
  const router = useRouter();

  const onLogOut = () => {
    session.signOut();
    router.replace("/");
  };

  return (
    <Page
      headerHeight={150}
      bubbles={[
        { size: 117, top: 27, left: 29 },
        { size: 135, top: -30, left: 237 },
        { size: 27, top: 8, left: 160 },
      ]}
    >
      <View style={{ gap: 12 * u }}>
        {settings.map((s) => (
          <TouchableOpacity
            key={s.key}
            activeOpacity={0.85}
            onPress={() => openSettings(s.key)}
          >
            <Card
              style={{
                padding: 12 * u,
                flexDirection: "row",
                alignItems: "center",
                gap: 12 * u,
              }}
            >
              <View
                style={{
                  width: 46 * u,
                  height: 46 * u,
                  borderRadius: 23 * u,
                  backgroundColor: s.tint,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name={s.icon} size={22 * u} color={COLORS.navy} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: F.semi,
                    fontSize: 14.5 * u,
                    color: COLORS.navy,
                  }}
                >
                  {s.title}
                </Text>
                <Text
                  style={{
                    fontFamily: F.reg,
                    fontSize: 10 * u,
                    color: COLORS.navy,
                  }}
                >
                  {s.sub}
                </Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ flexDirection: "row", marginTop: 85 * u }}>
        <PillButton title="Log Out" onPress={onLogOut} />
      </View>
    </Page>
  );
}
