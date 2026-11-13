import {
  COLORS,
  Card,
  F,
  FW,
  Heading,
  IconBtn,
  Page,
  u,
} from "@/components/Ui";
import { peso } from "@/data/products";
import { todayLabel, useManageState } from "@/manageStore";
import { useSettings } from "@/settingsStore";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function Home() {
  const { orders } = useManageState();
  const { username } = useSettings();
  const cardWidth = (FW - 44 * u - 12 * u) / 2;

  const completed = orders.filter((o) => o.status === "Complete");
  const today = todayLabel();

  const revenue = completed.reduce((sum, o) => sum + o.price, 0);
  const todayIncome = completed
    .filter((o) => o.date === today)
    .reduce((sum, o) => sum + o.price, 0);
  const customers = completed.length;
  const sold = completed.reduce(
    (sum, o) => sum + (o.items ?? []).reduce((n, i) => n + i.qty, 0),
    0,
  );

  const tally: Record<string, number> = {};
  completed.forEach((o) =>
    (o.items ?? []).forEach((i) => {
      tally[i.name] = (tally[i.name] ?? 0) + i.qty;
    }),
  );
  const top = Object.entries(tally).sort((a, b) => b[1] - a[1])[0];

  const stats = [
    {
      icon: "bar-chart",
      tint: COLORS.soft,
      label: "All Time Revenue",
      value: peso(revenue),
    },
    {
      icon: "cash-outline",
      tint: COLORS.soft,
      label: "Today's Income",
      value: peso(todayIncome),
    },
    {
      icon: "person-circle-outline",
      tint: COLORS.soft,
      label: "Total Customers",
      value: String(customers),
    },
    {
      icon: "cart-outline",
      tint: COLORS.purple,
      label: "Products Sold",
      value: String(sold),
    },
  ] as const;

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
          }}
        >
          Welcome back, {username}!
        </Text>
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
          {top ? `${top[0]} - ${top[1]} sold` : "No sales yet"}
        </Text>
      </Card>
    </Page>
  );
}
