import AddOrderIcon from "@/assets/icons/add-order.svg";
import FlameIcon from "@/assets/icons/flame.svg";
import HistoryIcon from "@/assets/icons/history.svg";
import Kitty from "@/assets/icons/kitty.svg";
import MenuIcon from "@/assets/icons/knife.svg";
import PendingIcon from "@/assets/icons/pending.svg";
import ProductsIcon from "@/assets/icons/products.svg";
import RevenueIcon from "@/assets/icons/revenue.svg";
import TrendingDownIcon from "@/assets/icons/trending-down.svg";
import UsersIcon from "@/assets/icons/users.svg";
import { useCatalog } from "@/catalogStore";
import {
  COLORS,
  Card,
  F,
  Heading,
  IconBtn,
  Page,
  Thumb,
  TintedIcon,
  u,
  type SvgIcon,
} from "@/components/Ui";
import { peso } from "@/data/products";
import { openManage, useManageState } from "@/manageStore";
import { useSettings } from "@/settingsStore";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import type { ComponentType } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

const SafeMaskedView = MaskedView as unknown as ComponentType<any>;

function MaskedIcon({
  Icon,
  width,
  height,
  color,
}: {
  Icon: ComponentType<{ width: number; height: number }>;
  width: number;
  height: number;
  color: string;
}) {
  return (
    <SafeMaskedView
      style={{ width, height }}
      maskElement={
        <View style={{ width, height, backgroundColor: "transparent" }}>
          <Icon width={width} height={height} />
        </View>
      }
    >
      <View style={{ flex: 1, backgroundColor: color }} />
    </SafeMaskedView>
  );
}

type Action = {
  title: string;
  Icon: SvgIcon;
  primary?: boolean;
  onPress: () => void;
};

const SLICES = ["#E86A8A", "#EE8BA4", "#F4A5A8", "#F2BFCB"];

function Bubble({
  size,
  top,
  right,
  left,
}: {
  size: number;
  top: number;
  right?: number;
  left?: number;
}) {
  return (
    <LinearGradient
      colors={["rgba(255,255,255,0.34)", "rgba(255,255,255,0.0)"]}
      start={{ x: 0.25, y: 0 }}
      end={{ x: 0.75, y: 1 }}
      style={{
        position: "absolute",
        width: size * u,
        height: size * u,
        borderRadius: (size * u) / 2,
        top: top * u,
        ...(right !== undefined ? { right: right * u } : {}),
        ...(left !== undefined ? { left: left * u } : {}),
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
      Icon: AddOrderIcon,
      primary: true,
      onPress: () => router.navigate("/orders"),
    },
    {
      title: "View Menu",
      Icon: MenuIcon,
      onPress: () => router.navigate("/menu"),
    },
    {
      title: "Order History",
      Icon: HistoryIcon,
      onPress: () => router.navigate("/history"),
    },
    {
      title: "Pending Orders",
      Icon: PendingIcon,
      onPress: () => openManage(),
    },
  ];

  return (
    <View
      style={{
        backgroundColor: "#E86A8A",
        borderRadius: 20 * u,
        paddingHorizontal: 20 * u,
        paddingTop: 20 * u,
        paddingBottom: 22 * u,
        overflow: "hidden",
      }}
    >
      <Bubble size={125} top={-18} right={-40} />
      <Bubble size={115} top={24} left={105} />
      <Bubble size={82} top={105} right={16} />
      <Bubble size={105} top={120} left={-32} />

      <MaskedIcon Icon={Kitty} width={72 * u} height={62 * u} color="#FFFFFF" />

      <Text
        style={{
          fontFamily: F.title,
          fontSize: 26 * u,
          lineHeight: 32 * u,
          color: "#FFFFFF",
          marginTop: 10 * u,
        }}
      >
        Welcome back, {username}!
      </Text>
      <Text
        style={{
          fontFamily: F.reg,
          fontSize: 11 * u,
          lineHeight: 16 * u,
          color: "rgba(255,255,255,0.92)",
          marginTop: 6 * u,
          marginBottom: 18 * u,
        }}
      >
        {
          "Everything is fresh and in order today!\nWhat would you like to get started with?"
        }
      </Text>

      <View style={{ gap: 10 * u }}>
        {buttons.map((b) => {
          const iconColor = b.primary ? "#E86A8A" : "#FFFFFF";
          return (
            <TouchableOpacity
              key={b.title}
              activeOpacity={0.85}
              onPress={b.onPress}
              style={{
                height: 42 * u,
                borderRadius: 10 * u,
                backgroundColor: b.primary
                  ? "#FDEDEA"
                  : "rgba(255,255,255,0.26)",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8 * u,
              }}
            >
              <TintedIcon
                Icon={b.Icon}
                width={17 * u}
                height={17 * u}
                color={iconColor}
              />
              <Text
                style={{
                  fontFamily: F.semi,
                  fontSize: 13.5 * u,
                  color: iconColor,
                }}
              >
                {b.title}
              </Text>
            </TouchableOpacity>
          );
        })}
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
    <Card
      style={{
        paddingHorizontal: 15 * u,
        paddingTop: 15 * u,
        paddingBottom: 0,
        borderRadius: 18 * u,
        overflow: "hidden",
      }}
    >
      <Heading size={21}>Menu Items to Restock</Heading>

      <ScrollView
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        style={{ maxHeight: 255 * u, marginTop: 10 * u }}
        contentContainerStyle={{ gap: 9 * u, paddingBottom: 12 * u }}
      >
        {low.length === 0 ? (
          <Text
            style={{
              fontFamily: F.reg,
              fontSize: 12 * u,
              color: COLORS.navy,
              paddingBottom: 14 * u,
            }}
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
              borderColor: "#E98A9F",
              borderRadius: 11 * u,
              paddingHorizontal: 10 * u,
              paddingVertical: 8 * u,
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
                  color: "#E86A8A",
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
                marginTop: 5 * u,
              }}
            >
              <Thumb
                width={90 * u}
                height={48}
                color={p.color}
                source={p.image ? { uri: p.image } : undefined}
              />
              <Text
                style={{
                  fontFamily: F.bold,
                  fontSize: 15 * u,
                  color: "#E86A8A",
                }}
              >
                {peso(p.price)}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </Card>
  );
}

function Stat({
  label,
  value,
  Icon,
  tint,
  width,
}: {
  label: string;
  value: string;
  Icon: SvgIcon;
  tint: string;
  width?: number;
}) {
  return (
    <Card
      style={{
        width,
        paddingHorizontal: 16 * u,
        paddingVertical: 15 * u,
        borderRadius: 18 * u,
      }}
    >
      <View
        style={{
          width: 32 * u,
          height: 32 * u,
          borderRadius: 16 * u,
          backgroundColor: tint,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 11 * u,
        }}
      >
        <TintedIcon
          Icon={Icon}
          width={17 * u}
          height={17 * u}
          color={COLORS.navy}
        />
      </View>
      <Text
        style={{
          fontFamily: F.reg,
          fontSize: 10.5 * u,
          color: COLORS.navy,
          opacity: 0.85,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontFamily: F.bold,
          fontSize: 22 * u,
          color: COLORS.navy,
          marginTop: 2 * u,
        }}
      >
        {value}
      </Text>
    </Card>
  );
}

function Highlight({
  Icon,
  title,
  name,
  note,
  color,
}: {
  Icon: SvgIcon;
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
        paddingVertical: 18 * u,
        paddingHorizontal: 16 * u,
        overflow: "hidden",
        alignItems: "center",
      }}
    >
      <Bubble size={108} top={-34} right={-14} />
      <Bubble size={104} top={24} left={-18} />
      <Bubble size={72} top={68} right={24} />

      <View style={{ flexDirection: "row", alignItems: "center", gap: 7 * u }}>
        <TintedIcon
          Icon={Icon}
          width={17 * u}
          height={17 * u}
          color="#FFFFFF"
        />
        <Text
          style={{
            fontFamily: F.title,
            fontSize: 15.5 * u,
            color: "rgba(255,255,255,0.92)",
          }}
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
          color: "rgba(255,255,255,0.68)",
          textAlign: "center",
          marginVertical: 3 * u,
        }}
      >
        {name}
      </Text>
      <Text
        style={{
          fontFamily: F.reg,
          fontSize: 10.5 * u,
          color: "rgba(255,255,255,0.92)",
        }}
      >
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
  const size = 162 * u;
  const stroke = 25 * u;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const sum = slices.reduce((s, x) => s + x.value, 0);
  const gap = slices.length > 1 ? 28 * u : 0;

  const arcs: { dash: number; offset: number; color: string }[] = [];
  let used = 0;
  slices.forEach((s) => {
    const len = sum > 0 ? (s.value / sum) * circ : 0;
    arcs.push({
      dash: Math.max(len - gap, 0),
      offset: used + gap / 2,
      color: s.color,
    });
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
                strokeLinecap="round"
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
          style={{
            fontFamily: F.reg,
            fontSize: 10 * u,
            color: COLORS.navy,
            marginTop: -1 * u,
          }}
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
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 * u }}>
      <View
        style={{
          width: 11 * u,
          height: 11 * u,
          borderRadius: 5.5 * u,
          backgroundColor: color,
        }}
      />
      <Text
        style={{
          fontFamily: F.reg,
          fontSize: 11 * u,
          color: COLORS.navy,
          flex: 1,
        }}
      >
        {name}
      </Text>
      <Text
        style={{ fontFamily: F.bold, fontSize: 11 * u, color: COLORS.navy }}
      >
        {percent}%
      </Text>
    </View>
  );
}

function AdminStats() {
  const { orders } = useManageState();
  const { products } = useCatalog();
  const cardWidth = 167 * u;

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
        Icon={RevenueIcon}
        tint="#E86A8A"
      />

      <View style={{ flexDirection: "row", gap: 12 * u }}>
        <Stat
          label="Total Customers"
          value={String(customers)}
          Icon={UsersIcon}
          tint="#F4A5A8"
          width={cardWidth}
        />
        <Stat
          label="Products Sold"
          value={String(sold)}
          Icon={ProductsIcon}
          tint="#B3A6D6"
          width={cardWidth}
        />
      </View>

      <Highlight
        Icon={FlameIcon}
        title="All Time Top Selling!"
        name={best ? best[0] : "No sales yet"}
        note={best ? salesText(best[1].qty) : "Complete an order to see this"}
        color="#E86A8A"
      />

      <Highlight
        Icon={TrendingDownIcon}
        title="All Time Lowest Sales!"
        name={worst ? worst[0] : "No data yet"}
        note={worst ? salesText(worst[1].qty) : "Needs at least two items sold"}
        color="#F4A5A8"
      />

      <Card
        style={{
          paddingVertical: 18 * u,
          paddingHorizontal: 18 * u,
          borderRadius: 18 * u,
          alignItems: "center",
        }}
      >
        <Heading size={24} center>
          Sales by Category
        </Heading>
        <View style={{ marginTop: 16 * u }}>
          <Donut
            total={sold}
            slices={categories.map(([, n], i) => ({
              value: n,
              color: SLICES[i % SLICES.length],
            }))}
          />
        </View>
        <View
          style={{
            alignSelf: "stretch",
            gap: 8 * u,
            marginTop: 18 * u,
            paddingHorizontal: 26 * u,
          }}
        >
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

      <Card
        style={{
          paddingVertical: 17 * u,
          paddingHorizontal: 17 * u,
          borderRadius: 18 * u,
        }}
      >
        <Heading size={23}>Item Revenue Chart</Heading>
        <Text
          style={{
            fontFamily: F.bold,
            fontSize: 23 * u,
            color: COLORS.navy,
            marginTop: 2 * u,
          }}
        >
          {peso(revenue)}
        </Text>

        <View
          style={{
            flexDirection: "row",
            height: 20 * u,
            borderRadius: 6 * u,
            overflow: "hidden",
            backgroundColor:
              revenueParts.length === 0 ? COLORS.border : "transparent",
            gap: 4 * u,
            marginTop: 11 * u,
          }}
        >
          {revenueParts.map((part, i) => (
            <View
              key={part.name}
              style={{
                flex: part.value,
                borderRadius: 6 * u,
                backgroundColor: SLICES[i % SLICES.length],
              }}
            />
          ))}
        </View>

        <View style={{ gap: 8 * u, marginTop: 14 * u, paddingRight: 60 * u }}>
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
      headerHeight={145}
      bubbles={[
        { size: 112, top: 10, left: 70 },
        { size: 185, top: -74, left: 182 },
        { size: 54, top: 84, left: 178 },
      ]}
      right={<IconBtn name="funnel-outline" />}
    >
      <View style={{ gap: 14 * u, paddingBottom: 28 * u }}>
        <Welcome />
        <Restock />
        {role === "admin" ? <AdminStats /> : null}
      </View>
    </Page>
  );
}
