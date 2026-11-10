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
import { peso } from "@/data/products";
import { openManage, todayLabel, useManageState } from "@/manageStore";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

const BASE = { revenue: 1245.5, today: 210.5, customers: 145, sold: 527 };

export default function Index() {
  const { orders } = useManageState();
  const cardWidth = (FW - 44 * u - 12 * u) / 2;

  const completed = orders.filter((o) => o.status === "Complete");
  const today = todayLabel();

  const revenue = BASE.revenue + completed.reduce((s, o) => s + o.price, 0);
  const todayIncome =
    BASE.today +
    completed.filter((o) => o.date === today).reduce((s, o) => s + o.price, 0);
  const customers = BASE.customers + completed.length;
  const sold =
    BASE.sold +
    completed.reduce(
      (s, o) => s + (o.items ?? []).reduce((n, i) => n + i.qty, 0),
      0,
    );

  const tally: Record<string, number> = { "Matcha Tea": 125 };
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
            marginBottom: 14 * u,
          }}
        >
          Welcome back, Dave!
        </Text>
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: 120 * u }}>
            <PillButton title="Manage Orders" onPress={() => openManage()} />
          </View>
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
          {top[0]} - {top[1]} sales this month
        </Text>
      </Card>
    </Page>
  );
}
