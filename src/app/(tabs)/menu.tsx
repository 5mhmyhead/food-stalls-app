import {
  COLORS,
  Card,
  F,
  Heading,
  IconBtn,
  LabelBtn,
  Page,
  PillButton,
  SearchBar,
  Thumb,
  u,
} from "@/components/Ui";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";

const categories = [
  {
    name: "All Meals",
    count: "13 items",
    color: "#F4A5A8",
    icon: "restaurant-outline",
  },
  {
    name: "Breakfast",
    count: "6 items",
    color: "#EE8CA5",
    icon: "sunny-outline",
  },
  { name: "Drinks", count: "3 items", color: "#F2A9C0", icon: "cafe-outline" },
] as const;

const products = [
  {
    name: "Light Espresso",
    category: "Drinks",
    price: "₱100.00",
    color: "#8B6B58",
    selected: true,
  },
  {
    name: "Matcha Tea",
    category: "Drinks",
    price: "₱210.00",
    color: "#9DBE8A",
    selected: false,
  },
  {
    name: "Hot Chocolate",
    category: "Drinks",
    price: "₱90.00",
    color: "#B8504F",
    selected: false,
  },
];

export default function Menu() {
  return (
    <Page
      headerHeight={145}
      bubbles={[
        { size: 140, top: -70, left: 110 },
        { size: 50, top: 70, left: 20 },
      ]}
      left={<LabelBtn title="Payout Order" icon="cart-outline" />}
      right={
        <>
          <IconBtn name="notifications-outline" />
          <IconBtn name="funnel-outline" />
        </>
      }
    >
      <SearchBar placeholder="search for a meal..." />

      <View style={{ flexDirection: "row", gap: 10 * u, marginTop: 12 * u }}>
        <PillButton title="Edit Categories" />
        <PillButton title="Edit Products" variant="navy" />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 16 * u, marginHorizontal: -22 * u }}
        contentContainerStyle={{ paddingHorizontal: 22 * u, gap: 12 * u }}
      >
        {categories.map((c) => (
          <View
            key={c.name}
            style={{
              width: 150 * u,
              height: 122 * u,
              borderRadius: 18 * u,
              backgroundColor: c.color,
              borderWidth: 1,
              borderColor: COLORS.pink,
              padding: 14 * u,
              justifyContent: "space-between",
            }}
          >
            <Ionicons name={c.icon} size={22 * u} color={COLORS.navy} />
            <View>
              <Heading size={26}>{c.name}</Heading>
              <Text
                style={{
                  fontFamily: F.reg,
                  fontSize: 10.5 * u,
                  color: COLORS.navy,
                }}
              >
                {c.count}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={{ marginTop: 16 * u, gap: 12 * u }}>
        {products.map((p) => (
          <Card key={p.name} selected={p.selected} style={{ padding: 8 * u }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Thumb width={140 * u} height={90} color={p.color} />
              <View
                style={{ flex: 1, alignItems: "flex-end", paddingRight: 6 * u }}
              >
                <Text
                  style={{
                    fontFamily: F.semi,
                    fontSize: 15 * u,
                    color: COLORS.navy,
                  }}
                >
                  {p.name}
                </Text>
                <Text
                  style={{
                    fontFamily: F.reg,
                    fontSize: 9.5 * u,
                    color: COLORS.navy,
                  }}
                >
                  {p.category}
                </Text>
                <Text
                  style={{
                    fontFamily: F.bold,
                    fontSize: 22 * u,
                    color: COLORS.navy,
                    marginTop: 14 * u,
                  }}
                >
                  {p.price}
                </Text>
              </View>
            </View>
          </Card>
        ))}
      </View>
    </Page>
  );
}
