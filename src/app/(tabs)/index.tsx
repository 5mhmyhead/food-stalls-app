import {
  COLORS,
  Card,
  F,
  FW,
  Heading,
  IconBtn,
  Page,
  PillButton,
  u,
} from "@/components/Ui";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";

const stats = [
  {
    icon: "bar-chart",
    tint: COLORS.soft,
    label: "All Time Revenue",
    value: "₱1245.50",
  },
  {
    icon: "cash-outline",
    tint: COLORS.soft,
    label: "Today's Income",
    value: "₱210.50",
  },
  {
    icon: "person-circle-outline",
    tint: COLORS.soft,
    label: "Total Customers",
    value: "145",
  },
  {
    icon: "cart-outline",
    tint: COLORS.purple,
    label: "Products Sold",
    value: "527",
  },
] as const;

export default function Index() {
  const router = useRouter();
  const cardWidth = (FW - 44 * u - 12 * u) / 2;

  return (
    <Page
      headerHeight={126}
      bubbles={[
        { size: 130, top: -60, left: 70 },
        { size: 55, top: 6, left: 230 },
      ]}
      right={
        <>
          <IconBtn name="notifications-outline" />
          <IconBtn name="funnel-outline" />
        </>
      }
    >
      <Card style={{ padding: 18 * u }}>
        <Heading size={30}>Dashboard</Heading>
        <Text
          style={{
            fontFamily: F.reg,
            fontSize: 14 * u,
            color: COLORS.navy,
            marginTop: 2 * u,
            marginBottom: 14 * u,
          }}
        >
          Welcome back, Dave!
        </Text>
        <View style={{ flexDirection: "row", gap: 10 * u }}>
          <PillButton
            title="Manage Orders"
            onPress={() => router.navigate("/orders")}
          />
          <PillButton
            title="View Profile"
            variant="soft"
            onPress={() => router.navigate("/profile")}
          />
        </View>
      </Card>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 12 * u,
          marginTop: 14 * u,
        }}
      >
        {stats.map((s) => (
          <Card key={s.label} style={{ width: cardWidth, padding: 14 * u }}>
            <View
              style={{
                width: 30 * u,
                height: 30 * u,
                borderRadius: 15 * u,
                backgroundColor: s.tint,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12 * u,
              }}
            >
              <Ionicons name={s.icon} size={17 * u} color={COLORS.navy} />
            </View>
            <Text
              style={{
                fontFamily: F.reg,
                fontSize: 10.5 * u,
                color: COLORS.navy,
              }}
            >
              {s.label}
            </Text>
            <Text
              style={{
                fontFamily: F.bold,
                fontSize: 22 * u,
                color: COLORS.navy,
              }}
            >
              {s.value}
            </Text>
          </Card>
        ))}
      </View>

      <Card style={{ marginTop: 14 * u, padding: 18 * u }}>
        <Heading size={28}>Top Selling!</Heading>
        <Text
          style={{
            fontFamily: F.reg,
            fontSize: 13 * u,
            color: COLORS.navy,
            marginTop: 4 * u,
          }}
        >
          Matcha Tea - 125 sales this month
        </Text>
      </Card>
    </Page>
  );
}
