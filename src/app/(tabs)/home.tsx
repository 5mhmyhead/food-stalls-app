import Kitty from "@/assets/icons/kitty.svg";
import { useCatalog } from "@/catalogStore";
import {
  COLORS,
  Card,
  F,
  FW,
  Heading,
  IconBtn,
  Page,
  Thumb,
  u,
} from "@/components/Ui";
import { peso } from "@/data/products";
import { openManage, useManageState } from "@/manageStore";
import { useSettings } from "@/settingsStore";
import { Ionicons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import type { ComponentType } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

const SafeMaskedView = MaskedView as unknown as ComponentType<any>;

type Glyph = keyof typeof Ionicons.glyphMap;

type Action = {
  title: string;
  icon: Glyph;
  primary?: boolean;
  onPress: () => void;
};

const SLICES = ["#E8708C", "#EE8CA5", "#F4A5A8", "#F2BFCB"];

function WhiteKitty({ width, height }: { width: number; height: number }) {
  return (
    <SafeMaskedView
      style={{ width, height }}
      maskElement={
        <View style={{ width, height, backgroundColor: "transparent" }}>
          <Kitty width={width} height={height} />
        </View>
      }
    >
      <View style={{ flex: 1, backgroundColor: "#FFFFFF" }} />
    </SafeMaskedView>
  );
}

function Bubble({
  size,
  top,
  right,
}: {
  size: number;
  top: number;
  right: number;
}) {
  return (
    <LinearGradient
      colors={["rgba(255,255,255,0.35)", "rgba(255,255,255,0)"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{
        position: "absolute",
        width: size * u,
        height: size * u,
        borderRadius: (size * u) / 2,
        top: top * u,
        right: right * u,
      }}
    />
  );
}

function Welcome() {
  const router = useRouter();
  const { username } = useSettings();

  const buttons: Action[] = [
    {
      title: "Make an Order",
      icon: "add-circle-outline",
      primary: true,
      onPress: () => router.navigate("/orders"),
    },
    {
      title: "View Menu",
      icon: "restaurant-outline",
      onPress: () => router.navigate("/menu"),
    },
    {
      title: "Order History",
      icon: "time-outline",
      onPress: () => router.navigate("/history"),
    },
    {
      title: "Pending Orders",
      icon: "clipboard-outline",
      onPress: () => openManage(),
    },
  ];

  return (
    <View
      style={{
        backgroundColor: COLORS.pink,
        borderRadius: 20 * u,
        padding: 16 * u,
        overflow: "hidden",
      }}
    >
      <Bubble size={150} top={-40} right={-30} />
      <Bubble size={70} top={110} right={150} />

      <WhiteKitty width={54 * u} height={42 * u} />

      <Text
        style={{
          fontFamily: F.title,
          fontSize: 26 * u,
          lineHeight: 32 * u,
          color: "#FFFFFF",
          marginTop: 8 * u,
        }}
      >
        Welcome back, {username}!
      </Text>
      <Text
        style={{
          fontFamily: F.reg,
          fontSize: 11 * u,
          lineHeight: 16 * u,
          color: "#FFFFFF",
          marginTop: 6 * u,
          marginBottom: 14 * u,
        }}
      >
        Everything is fresh and in order today! What would you like to get
        started with?
      </Text>

      <View style={{ gap: 10 * u }}>
        {buttons.map((b) => (
          <TouchableOpacity
            key={b.title}
            activeOpacity={0.85}
            onPress={b.onPress}
            style={{
              height: 40 * u,
              borderRadius: 12 * u,
              backgroundColor: b.primary ? "#FDEDEA" : "rgba(255,255,255,0.22)",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8 * u,
            }}
          >
            <Ionicons
              name={b.icon}
              size={17 * u}
              color={b.primary ? COLORS.pink : "#FFFFFF"}
            />
            <Text
              style={{
                fontFamily: F.semi,
                fontSize: 13 * u,
                color: b.primary ? COLORS.pink : "#FFFFFF",
              }}
            >
              {b.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function Restock() {
  const { products } = useCatalog();
  const { threshold } = useSettings();

  const low = products
    .filter((p) => p.stock <= threshold)
    .sort((a, b) => a.stock - b.stock);

  return (
    <Card style={{ padding: 14 * u }}>
      <Heading size={22}>Menu Items to Restock</Heading>

      <View style={{ gap: 10 * u, marginTop: 12 * u }}>
        {low.length === 0 ? (
          <Text
            style={{ fontFamily: F.reg, fontSize: 12 * u, color: COLORS.navy }}
          >
            Everything is stocked up.
          </Text>
        ) : null}

        {low.map((p) => (
          <View
            key={p.id}
            style={{
              backgroundColor: "#FDEDEA",
              borderWidth: 1,
              borderColor: COLORS.pink,
              borderRadius: 12 * u,
              padding: 10 * u,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: F.bold,
                  fontSize: 15 * u,
                  color: COLORS.navy,
                  flex: 1,
                }}
              >
                {p.name}
              </Text>
              <Text
                style={{
                  fontFamily: F.reg,
                  fontSize: 9.5 * u,
                  color: COLORS.pink,
                }}
              >
                {p.stock === 0 ? "Out of stock" : `Only ${p.stock} Left!`}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginTop: 6 * u,
              }}
            >
              <Thumb width={84 * u} height={54} color={p.color} />
              <Text
                style={{
                  fontFamily: F.bold,
                  fontSize: 15 * u,
                  color: COLORS.pink,
                }}
              >
                {peso(p.price)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}

function Stat({
  label,
  value,
  icon,
  tint,
  width,
}: {
  label: string;
  value: string;
  icon: Glyph;
  tint: string;
  width?: number;
}) {
  return (
    <Card style={{ width, padding: 14 * u }}>
      <View
        style={{
          width: 30 * u,
          height: 30 * u,
          borderRadius: 15 * u,
          backgroundColor: tint,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 10 * u,
        }}
      >
        <Ionicons name={icon} size={17 * u} color={COLORS.navy} />
      </View>
      <Text
        style={{ fontFamily: F.reg, fontSize: 10.5 * u, color: COLORS.navy }}
      >
        {label}
      </Text>
      <Text
        style={{ fontFamily: F.bold, fontSize: 22 * u, color: COLORS.navy }}
      >
        {value}
      </Text>
    </Card>
  );
}

function Highlight({
  icon,
  title,
  name,
  note,
  color,
}: {
  icon: Glyph;
  title: string;
  name: string;
  note: string;
  color: string;
}) {
  return (
    <View
      style={{
        backgroundColor: color,
        borderRadius: 18 * u,
        padding: 16 * u,
        overflow: "hidden",
        alignItems: "center",
      }}
    >
      <Bubble size={110} top={-30} right={-20} />
      <Bubble size={60} top={70} right={230} />

      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 * u }}>
        <Ionicons name={icon} size={16 * u} color="#FFFFFF" />
        <Text
          style={{ fontFamily: F.title, fontSize: 15 * u, color: "#FFFFFF" }}
        >
          {title}
        </Text>
      </View>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={{
          fontFamily: F.title,
          fontSize: 38 * u,
          lineHeight: 46 * u,
          color: "#FFFFFF",
          textAlign: "center",
          marginVertical: 4 * u,
        }}
      >
        {name}
      </Text>
      <Text style={{ fontFamily: F.reg, fontSize: 11 * u, color: "#FFFFFF" }}>
        {note}
      </Text>
    </View>
  );
}

function Donut({
  slices,
  total,
}: {
  slices: { value: number; color: string }[];
  total: number;
}) {
  const size = 150 * u;
  const stroke = 24 * u;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const sum = slices.reduce((s, x) => s + x.value, 0);
  const gap = slices.length > 1 ? 4 * u : 0;

  const arcs: { dash: number; offset: number; color: string }[] = [];
  let used = 0;
  slices.forEach((s) => {
    const len = (s.value / sum) * circ;
    arcs.push({ dash: Math.max(len - gap, 0), offset: used, color: s.color });
    used += len;
  });

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={COLORS.border}
          strokeWidth={stroke}
          fill="none"
        />
        {sum > 0
          ? arcs.map((a, i) => (
              <Circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={a.color}
                strokeWidth={stroke}
                fill="none"
                strokeDasharray={`${a.dash} ${circ - a.dash}`}
                strokeDashoffset={circ / 4 - a.offset}
              />
            ))
          : null}
      </Svg>
      <View style={{ position: "absolute", alignItems: "center" }}>
        <Text
          style={{ fontFamily: F.bold, fontSize: 18 * u, color: COLORS.navy }}
        >
          {total}
        </Text>
        <Text
          style={{ fontFamily: F.reg, fontSize: 10 * u, color: COLORS.navy }}
        >
          items sold
        </Text>
      </View>
    </View>
  );
}

function LegendRow({
  color,
  name,
  percent,
}: {
  color: string;
  name: string;
  percent: number;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 * u }}>
      <View
        style={{
          width: 11 * u,
          height: 11 * u,
          borderRadius: 6 * u,
          backgroundColor: color,
        }}
      />
      <Text
        style={{
          fontFamily: F.reg,
          fontSize: 10.5 * u,
          color: COLORS.navy,
          flex: 1,
        }}
      >
        {name}
      </Text>
      <Text
        style={{ fontFamily: F.semi, fontSize: 10.5 * u, color: COLORS.navy }}
      >
        {percent}%
      </Text>
    </View>
  );
}

function AdminStats() {
  const { orders } = useManageState();
  const { products } = useCatalog();
  const cardWidth = (FW - 44 * u - 12 * u) / 2;

  const completed = orders.filter((o) => o.status === "Complete");
  const revenue = completed.reduce((sum, o) => sum + o.price, 0);
  const customers = completed.length;

  const productById = new Map(products.map((p) => [p.id, p]));
  const byName: Record<string, { qty: number; revenue: number }> = {};
  const byCategory: Record<string, number> = {};

  completed.forEach((o) =>
    (o.items ?? []).forEach((i) => {
      const row = byName[i.name] ?? { qty: 0, revenue: 0 };
      row.qty += i.qty;
      row.revenue += i.qty * i.price;
      byName[i.name] = row;

      const category = productById.get(i.id)?.category ?? "Other";
      byCategory[category] = (byCategory[category] ?? 0) + i.qty;
    }),
  );

  const rows = Object.entries(byName);
  const sold = rows.reduce((sum, [, r]) => sum + r.qty, 0);

  const best = [...rows].sort((a, b) => b[1].qty - a[1].qty)[0];
  const worst =
    rows.length >= 2
      ? [...rows].sort((a, b) => a[1].qty - b[1].qty)[0]
      : undefined;
  const salesText = (n: number) =>
    `${n} ${n === 1 ? "sale" : "sales"} during this period`;

  const categories = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const categorySum = categories.reduce((sum, [, n]) => sum + n, 0);

  const byRevenue = [...rows].sort((a, b) => b[1].revenue - a[1].revenue);
  const itemRevenue = byRevenue.reduce((sum, [, r]) => sum + r.revenue, 0);
  const top = byRevenue.slice(0, 3);
  const otherRevenue = byRevenue
    .slice(3)
    .reduce((sum, [, r]) => sum + r.revenue, 0);
  const revenueParts = [
    ...top.map(([name, r]) => ({ name, value: r.revenue })),
    ...(otherRevenue > 0 ? [{ name: "Others", value: otherRevenue }] : []),
  ];

  return (
    <View style={{ gap: 14 * u }}>
      <Stat
        label="All Time Revenue"
        value={peso(revenue)}
        icon="bar-chart"
        tint={COLORS.pink}
      />

      <View style={{ flexDirection: "row", gap: 12 * u }}>
        <Stat
          label="Total Customers"
          value={String(customers)}
          icon="person-circle-outline"
          tint={COLORS.soft}
          width={cardWidth}
        />
        <Stat
          label="Products Sold"
          value={String(sold)}
          icon="cart-outline"
          tint={COLORS.purple}
          width={cardWidth}
        />
      </View>

      <Highlight
        icon="flame-outline"
        title="All Time Top Selling!"
        name={best ? best[0] : "No sales yet"}
        note={best ? salesText(best[1].qty) : "Complete an order to see this"}
        color={COLORS.pink}
      />

      <Highlight
        icon="trending-down-outline"
        title="All Time Lowest Sales!"
        name={worst ? worst[0] : "No data yet"}
        note={worst ? salesText(worst[1].qty) : "Needs at least two items sold"}
        color={COLORS.soft}
      />

      <Card style={{ padding: 16 * u, alignItems: "center" }}>
        <Heading size={24} center>
          Sales by Category
        </Heading>
        <View style={{ marginTop: 12 * u }}>
          <Donut
            total={sold}
            slices={categories.map(([, n], i) => ({
              value: n,
              color: SLICES[i % SLICES.length],
            }))}
          />
        </View>
        <View style={{ alignSelf: "stretch", gap: 8 * u, marginTop: 14 * u }}>
          {categories.length === 0 ? (
            <Text
              style={{
                fontFamily: F.reg,
                fontSize: 11 * u,
                color: COLORS.navy,
                textAlign: "center",
              }}
            >
              No sales yet
            </Text>
          ) : null}
          {categories.map(([name, n], i) => (
            <LegendRow
              key={name}
              color={SLICES[i % SLICES.length]}
              name={name}
              percent={Math.round((n / categorySum) * 100)}
            />
          ))}
        </View>
      </Card>

      <Card style={{ padding: 16 * u }}>
        <Heading size={24}>Item Revenue Chart</Heading>
        <Text
          style={{
            fontFamily: F.bold,
            fontSize: 24 * u,
            color: COLORS.navy,
            marginTop: 4 * u,
          }}
        >
          {peso(revenue)}
        </Text>

        <View
          style={{
            flexDirection: "row",
            height: 22 * u,
            borderRadius: 8 * u,
            overflow: "hidden",
            backgroundColor: COLORS.border,
            gap: 3 * u,
            marginTop: 12 * u,
          }}
        >
          {revenueParts.map((part, i) => (
            <View
              key={part.name}
              style={{
                flex: part.value,
                backgroundColor: SLICES[i % SLICES.length],
              }}
            />
          ))}
        </View>

        <View style={{ gap: 8 * u, marginTop: 14 * u }}>
          {revenueParts.length === 0 ? (
            <Text
              style={{
                fontFamily: F.reg,
                fontSize: 11 * u,
                color: COLORS.navy,
              }}
            >
              No sales yet
            </Text>
          ) : null}
          {revenueParts.map((part, i) => (
            <LegendRow
              key={part.name}
              color={SLICES[i % SLICES.length]}
              name={part.name}
              percent={Math.round((part.value / itemRevenue) * 100)}
            />
          ))}
        </View>
      </Card>
    </View>
  );
}

export default function Home() {
  const { role } = useSettings();

  return (
    <Page
      headerHeight={110}
      bubbles={[
        { size: 130, top: -60, left: 70 },
        { size: 55, top: 6, left: 230 },
      ]}
      right={<IconBtn name="funnel-outline" />}
    >
      <View style={{ gap: 14 * u }}>
        <Welcome />
        <Restock />
        {role === "admin" ? <AdminStats /> : null}
      </View>
    </Page>
  );
}
