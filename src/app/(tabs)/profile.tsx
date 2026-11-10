import {
  COLORS,
  Card,
  F,
  Heading,
  Page,
  PillButton,
  SearchBar,
  u,
} from "@/components/Ui";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

const settings = [
  {
    icon: "color-palette-outline",
    tint: "#F4A3B3",
    title: "Look and Feel",
    sub: "Theme, language, streaming service",
  },
  {
    icon: "notifications-outline",
    tint: "#E8708C",
    title: "Notifications",
    sub: "Menu activity, order alerts",
  },
  {
    icon: "refresh-outline",
    tint: "#B7A8DA",
    title: "Update",
    sub: "Check for new versions",
  },
  {
    icon: "people-outline",
    tint: "#7A3F63",
    title: "Admin Panel",
    sub: "Administrator access, user options",
  },
] as const;

export default function Profile() {
  return (
    <Page
      headerHeight={132}
      bubbles={[
        { size: 150, top: -75, left: 85 },
        { size: 60, top: -10, left: 235 },
      ]}
    >
      <Card
        style={{ alignItems: "center", paddingTop: 22 * u, padding: 18 * u }}
      >
        <View
          style={{
            width: 96 * u,
            height: 96 * u,
            borderRadius: 48 * u,
            backgroundColor: COLORS.cream,
          }}
        />
        <View style={{ marginTop: 8 * u }}>
          <Heading size={28} center>
            Dwyane Sido
          </Heading>
        </View>
        <Text
          style={{
            fontFamily: F.reg,
            fontSize: 11.5 * u,
            color: COLORS.navy,
            marginBottom: 12 * u,
          }}
        >
          Employee
        </Text>
        <View style={{ flexDirection: "row", gap: 10 * u }}>
          <PillButton title="Edit Profile" />
          <PillButton title="View Profile" variant="soft" />
        </View>
      </Card>

      <View style={{ marginTop: 18 * u, marginBottom: 12 * u }}>
        <Heading size={34}>Settings</Heading>
      </View>
      <SearchBar placeholder="search for a setting" />

      <View style={{ gap: 12 * u, marginTop: 14 * u }}>
        {settings.map((s) => (
          <Card
            key={s.title}
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
                borderRadius: 12 * u,
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
        ))}
      </View>
    </Page>
  );
}
