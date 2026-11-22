import AnalyticsIcon from "@/assets/icons/analytics.svg";
import BagIcon from "@/assets/icons/bag.svg";
import FlameIcon from "@/assets/icons/flame.svg";
import MinusIcon from "@/assets/icons/minus.svg";
import ProductsIcon from "@/assets/icons/products.svg";
import ReceiptIcon from "@/assets/icons/receipt.svg";
import RevenueIcon from "@/assets/icons/revenue.svg";
import TrendingDownIcon from "@/assets/icons/trending-down.svg";
import TrendingUpIcon from "@/assets/icons/trending-up.svg";
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
import { useManageState } from "@/manageStore";
import { useSettings } from "@/settingsStore";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

const T = {
  label: 10,
  body: 12.5,
  sub: 20,
  title: 32,
  display: 52,
};

const S = {
  xxs: 3 * u,
  xs: 5 * u,
  sm: 8 * u,
  md: 13 * u,
  lg: 21 * u,
  xl: 34 * u,
  xxl: 55 * u,
};

const RADIUS_LG = 21 * u;
const RADIUS_MD = 13 * u;
const RADIUS_SM = 8 * u;
const BADGE = 34 * u;
const DAY = 86400000;

const SLICES = ["#E86A8A", "#EE8BA4", "#F4A5A8", "#F2BFCB"];

const KEEP_ICONS = [AnalyticsIcon];

function stamp(order: any): number | null {
  const v = order.createdAt ?? order.date ?? order.time ?? order.timestamp;
  if (v === undefined || v === null) return null;
  const t = typeof v === "number" ? v : new Date(v).getTime();
  return Number.isNaN(t) ? null : t;
}

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

function Pill({
  text,
  bg,
  color,
}: {
  text: string;
  bg: string;
  color: string;
}) {
  return (
    <View
      style={{
        backgroundColor: bg,
        borderRadius: RADIUS_SM,
        paddingHorizontal: S.sm,
        paddingVertical: S.xxs,
      }}
    >
      <Text style={{ fontFamily: F.reg, fontSize: T.label * u, color }}>
        {text}
      </Text>
    </View>
  );
}

type Forecast = {
  id: string;
  name: string;
  category: string;
  stock: number;
  perDay: number;
  sold: number;
  daysLeft: number | null;
  color: string;
  image?: string;
};

function ForecastCard({
  items,
  atRisk,
}: {
  items: Forecast[];
  atRisk: number;
}) {
  return (
    <Card
      style={{
        padding: S.lg,
        paddingBottom: 0,
        borderRadius: RADIUS_LG,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Heading size={T.sub}>Stock Forecast</Heading>
        <Pill
          text={`${atRisk} at risk`}
          bg={COLORS.border}
          color={COLORS.navy}
        />
      </View>

      <ScrollView
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        style={{ maxHeight: 233 * u, marginTop: S.md }}
        contentContainerStyle={{ gap: S.sm, paddingBottom: S.md }}
      >
        {items.length === 0 ? (
          <Text
            style={{
              fontFamily: F.reg,
              fontSize: T.body * u,
              color: COLORS.navy,
              paddingBottom: S.md,
            }}
          >
            Everything is stocked up.
          </Text>
        ) : null}

        {items.map((p) => {
          const out = p.stock === 0;
          return (
            <View
              key={p.id}
              style={{
                backgroundColor: COLORS.bg,
                borderWidth: 1,
                borderColor: out ? COLORS.border : "#E98A9F",
                borderRadius: RADIUS_MD,
                paddingHorizontal: S.md,
                paddingVertical: S.sm,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: S.sm,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Heading size={T.sub}>{p.name}</Heading>
                </View>
                {out ? (
                  <Pill
                    text="Out of stock"
                    bg={COLORS.border}
                    color={COLORS.navy}
                  />
                ) : (
                  <Pill
                    text={`~${p.daysLeft?.toFixed(1)} days left`}
                    bg="#F9C6D2"
                    color={COLORS.pink}
                  />
                )}
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-end",
                  marginTop: S.xs,
                  gap: S.sm,
                }}
              >
                <Thumb
                  width={89 * u}
                  height={55}
                  color={p.color}
                  source={p.image ? { uri: p.image } : undefined}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: F.reg,
                      fontSize: T.label * u,
                      color: COLORS.navy,
                      opacity: 0.7,
                    }}
                  >
                    {p.category}
                  </Text>
                  <Text
                    style={{
                      fontFamily: F.reg,
                      fontSize: T.label * u,
                      color: COLORS.navy,
                    }}
                  >
                    {p.perDay.toFixed(1)}/day ({p.sold} sold in 7d)
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: F.reg,
                    fontSize: T.label * u,
                    color: out ? COLORS.navy : COLORS.pink,
                  }}
                >
                  {out ? "No Stock" : `Only ${p.stock} left`}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </Card>
  );
}

function RevenueBar({ value }: { value: string }) {
  return (
    <Card
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: S.md,
        paddingHorizontal: S.lg,
        paddingVertical: S.md,
        borderRadius: RADIUS_LG,
      }}
    >
      <View
        style={{
          width: BADGE,
          height: BADGE,
          borderRadius: BADGE / 2,
          backgroundColor: COLORS.pink,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TintedIcon
          Icon={RevenueIcon}
          width={S.md}
          height={S.md}
          color={COLORS.navy}
        />
      </View>
      <View>
        <Text
          style={{
            fontFamily: F.reg,
            fontSize: T.body * u,
            color: COLORS.navy,
          }}
        >
          All Time Revenue
        </Text>
        <Text
          style={{
            fontFamily: F.bold,
            fontSize: T.sub * u,
            color: COLORS.navy,
          }}
        >
          {value}
        </Text>
      </View>
    </Card>
  );
}

function MiniStat({
  label,
  value,
  Icon,
  tint,
}: {
  label: string;
  value: string;
  Icon: SvgIcon;
  tint: string;
}) {
  return (
    <Card
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: S.sm,
        paddingHorizontal: S.md,
        paddingVertical: S.md,
        borderRadius: RADIUS_LG,
      }}
    >
      <View
        style={{
          width: BADGE,
          height: BADGE,
          borderRadius: BADGE / 2,
          backgroundColor: tint,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TintedIcon
          Icon={Icon}
          width={S.md}
          height={S.md}
          color={COLORS.navy}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          numberOfLines={1}
          style={{
            fontFamily: F.reg,
            fontSize: T.label * u,
            color: COLORS.navy,
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            fontFamily: F.bold,
            fontSize: T.sub * u,
            color: COLORS.navy,
          }}
        >
          {value}
        </Text>
      </View>
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
        borderRadius: RADIUS_LG,
        paddingVertical: S.lg,
        paddingHorizontal: S.lg,
        overflow: "hidden",
        alignItems: "center",
      }}
    >
      <Bubble size={108} top={-34} right={-14} />
      <Bubble size={104} top={24} left={-18} />
      <Bubble size={72} top={68} right={24} />

      <View style={{ flexDirection: "row", alignItems: "center", gap: S.sm }}>
        <TintedIcon Icon={Icon} width={S.md} height={S.md} color="#FFFFFF" />
        <Text
          style={{
            fontFamily: F.title,
            fontSize: T.sub * u,
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
          fontSize: T.display * u,
          lineHeight: 63 * u,
          color: "rgba(255,255,255,0.68)",
          textAlign: "center",
          marginVertical: S.xs,
        }}
      >
        {name}
      </Text>
      <Text
        style={{
          fontFamily: F.reg,
          fontSize: T.label * u,
          color: "rgba(255,255,255,0.92)",
        }}
      >
        {note}
      </Text>
    </View>
  );
}

type Metric = {
  label: string;
  Icon: SvgIcon;
  tint: string;
  value: string;
  prior: string;
  change: number;
};

function ComparisonRow({ m }: { m: Metric }) {
  const up = m.change > 0;
  const down = m.change < 0;
  const sign = up ? "+" : "";
  const badgeBg = up ? "#F9C6D2" : COLORS.border;
  const badgeColor = up ? COLORS.pink : COLORS.navy;
  const Arrow = up ? TrendingUpIcon : down ? TrendingDownIcon : MinusIcon;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: S.md,
        backgroundColor: COLORS.bg,
        borderRadius: RADIUS_MD,
        paddingHorizontal: S.md,
        paddingVertical: S.sm,
      }}
    >
      <View
        style={{
          width: BADGE,
          height: BADGE,
          borderRadius: BADGE / 2,
          backgroundColor: m.tint,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TintedIcon
          Icon={m.Icon}
          width={S.md}
          height={S.md}
          color={COLORS.navy}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: F.reg,
            fontSize: T.body * u,
            color: COLORS.navy,
          }}
        >
          {m.label}
        </Text>
        <Text
          style={{
            fontFamily: F.bold,
            fontSize: T.sub * u,
            color: COLORS.navy,
          }}
        >
          {m.value}
        </Text>
      </View>
      <View style={{ alignItems: "flex-end", gap: S.xxs }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: S.xxs,
            backgroundColor: badgeBg,
            borderRadius: RADIUS_SM,
            paddingHorizontal: S.sm,
            paddingVertical: S.xxs,
          }}
        >
          <TintedIcon
            Icon={Arrow}
            width={S.md}
            height={S.md}
            color={badgeColor}
          />
          <Text
            style={{
              fontFamily: F.semi,
              fontSize: T.label * u,
              color: badgeColor,
            }}
          >
            {sign}
            {m.change.toFixed(1)}%
          </Text>
        </View>
        <Text
          style={{
            fontFamily: F.reg,
            fontSize: T.label * u,
            color: COLORS.navy,
            opacity: 0.7,
          }}
        >
          Prior 7d: {m.prior}
        </Text>
      </View>
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
  const size = 144 * u;
  const stroke = S.lg;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const sum = slices.reduce((s, x) => s + x.value, 0);
  const gap = slices.length > 1 ? S.lg : 0;

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
          style={{
            fontFamily: F.bold,
            fontSize: T.sub * u,
            color: COLORS.navy,
          }}
        >
          {total}
        </Text>
        <Text
          style={{
            fontFamily: F.reg,
            fontSize: T.label * u,
            color: COLORS.navy,
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
    <View style={{ flexDirection: "row", alignItems: "center", gap: S.sm }}>
      <View
        style={{
          width: S.md,
          height: S.md,
          borderRadius: S.md / 2,
          backgroundColor: color,
        }}
      />
      <Text
        style={{
          fontFamily: F.reg,
          fontSize: T.body * u,
          color: COLORS.navy,
          flex: 1,
        }}
      >
        {name}
      </Text>
      <Text
        style={{
          fontFamily: F.bold,
          fontSize: T.body * u,
          color: COLORS.navy,
        }}
      >
        {percent}%
      </Text>
    </View>
  );
}

function change(current: number, prior: number) {
  if (prior === 0) return current > 0 ? 100 : 0;
  return ((current - prior) / prior) * 100;
}

export default function Analytics({ onBack }: { onBack?: () => void }) {
  const router = useRouter();
  const { role, threshold } = useSettings();
  const { orders } = useManageState();
  const { products } = useCatalog();

  if (role !== "admin") return null;

  const now = Date.now();
  const completed = orders.filter((o) => o.status === "Complete");

  const inCurrent = completed.filter((o) => {
    const t = stamp(o);
    return t === null || now - t <= 7 * DAY;
  });
  const inPrior = completed.filter((o) => {
    const t = stamp(o);
    return t !== null && now - t > 7 * DAY && now - t <= 14 * DAY;
  });

  const totals = (list: typeof completed) => {
    const revenue = list.reduce((sum, o) => sum + o.price, 0);
    const items = list.reduce(
      (sum, o) => sum + (o.items ?? []).reduce((s, i) => s + i.qty, 0),
      0,
    );
    return {
      revenue,
      items,
      count: list.length,
      avg: list.length > 0 ? revenue / list.length : 0,
    };
  };

  const cur = totals(inCurrent);
  const pri = totals(inPrior);

  const revenue = completed.reduce((sum, o) => sum + o.price, 0);
  const customers = completed.length;

  const productById = new Map(products.map((p) => [p.id, p]));
  const byName: Record<string, { qty: number; revenue: number }> = {};
  const byCategory: Record<string, number> = {};
  const soldWeek: Record<string, number> = {};

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

  inCurrent.forEach((o) =>
    (o.items ?? []).forEach((i) => {
      soldWeek[i.id] = (soldWeek[i.id] ?? 0) + i.qty;
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

  const forecast: Forecast[] = products
    .map((p) => {
      const week = soldWeek[p.id] ?? 0;
      const perDay = week / 7;
      return {
        id: p.id,
        name: p.name,
        category: p.category,
        stock: p.stock,
        perDay,
        sold: week,
        daysLeft: perDay > 0 ? p.stock / perDay : null,
        color: p.color,
        image: p.image,
      };
    })
    .filter(
      (p) =>
        p.stock === 0 ||
        p.stock <= threshold ||
        (p.daysLeft !== null && p.daysLeft <= 14),
    )
    .sort((a, b) => {
      const da = a.stock === 0 ? -1 : (a.daysLeft ?? Infinity);
      const db = b.stock === 0 ? -1 : (b.daysLeft ?? Infinity);
      return da - db;
    });

  const atRisk = forecast.filter(
    (p) => p.stock === 0 || (p.daysLeft !== null && p.daysLeft <= 7),
  ).length;

  const metrics: Metric[] = [
    {
      label: "Revenue",
      Icon: RevenueIcon,
      tint: COLORS.pink,
      value: peso(cur.revenue),
      prior: peso(pri.revenue),
      change: change(cur.revenue, pri.revenue),
    },
    {
      label: "Items Sold",
      Icon: ProductsIcon,
      tint: "#F4A5A8",
      value: String(cur.items),
      prior: String(pri.items),
      change: change(cur.items, pri.items),
    },
    {
      label: "Orders",
      Icon: BagIcon,
      tint: "#B3A6D6",
      value: String(cur.count),
      prior: String(pri.count),
      change: change(cur.count, pri.count),
    },
    {
      label: "Avg. Order Value",
      Icon: ReceiptIcon,
      tint: "#F2BFCB",
      value: peso(cur.avg),
      prior: peso(pri.avg),
      change: change(cur.avg, pri.avg),
    },
  ];

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
    <Page
      headerHeight={144}
      bubbles={[
        { size: 145, top: -64, left: 96 },
        { size: 78, top: 28, left: 192 },
        { size: 28, top: 8, left: 292 },
      ]}
      left={
        <IconBtn name="arrow-back" onPress={onBack ?? (() => router.back())} />
      }
    >
      <View style={{ marginBottom: S.sm }}>
        <Heading size={T.title}>Analytics</Heading>
      </View>

      <View style={{ gap: S.md, paddingBottom: S.xl }}>
        <ForecastCard items={forecast} atRisk={atRisk} />

        <RevenueBar value={peso(revenue)} />

        <View style={{ flexDirection: "row", gap: S.md }}>
          <MiniStat
            label="Total Customers"
            value={String(customers)}
            Icon={UsersIcon}
            tint="#F4A5A8"
          />
          <MiniStat
            label="Products Sold"
            value={String(sold)}
            Icon={ProductsIcon}
            tint="#B3A6D6"
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
          note={
            worst ? salesText(worst[1].qty) : "Needs at least two items sold"
          }
          color="#F4A5A8"
        />

        <Card style={{ padding: S.lg, borderRadius: RADIUS_LG }}>
          <View style={{ alignItems: "center" }}>
            <Heading size={T.sub} center>
              Period Comparison
            </Heading>
          </View>
          <View style={{ gap: S.sm, marginTop: S.md }}>
            {metrics.map((m) => (
              <ComparisonRow key={m.label} m={m} />
            ))}
          </View>
        </Card>

        <Card
          style={{
            padding: S.lg,
            borderRadius: RADIUS_LG,
            alignItems: "center",
          }}
        >
          <Heading size={T.sub} center>
            Sales by Category
          </Heading>
          <View style={{ marginTop: S.lg }}>
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
              gap: S.sm,
              marginTop: S.lg,
              paddingHorizontal: S.lg,
            }}
          >
            {categories.length === 0 ? (
              <Text
                style={{
                  fontFamily: F.reg,
                  fontSize: T.body * u,
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

        <Card style={{ padding: S.lg, borderRadius: RADIUS_LG }}>
          <Heading size={T.sub}>Item Revenue Chart</Heading>
          <Text
            style={{
              fontFamily: F.bold,
              fontSize: T.sub * u,
              color: COLORS.navy,
              marginTop: S.xxs,
            }}
          >
            {peso(revenue)}
          </Text>

          <View
            style={{
              flexDirection: "row",
              height: S.lg,
              borderRadius: RADIUS_SM,
              overflow: "hidden",
              backgroundColor:
                revenueParts.length === 0 ? COLORS.border : "transparent",
              gap: S.xs,
              marginTop: S.md,
            }}
          >
            {revenueParts.map((part, i) => (
              <View
                key={part.name}
                style={{
                  flex: part.value,
                  borderRadius: RADIUS_SM,
                  backgroundColor: SLICES[i % SLICES.length],
                }}
              />
            ))}
          </View>

          <View style={{ gap: S.sm, marginTop: S.md, paddingRight: S.xl }}>
            {revenueParts.length === 0 ? (
              <Text
                style={{
                  fontFamily: F.reg,
                  fontSize: T.body * u,
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
    </Page>
  );
}
