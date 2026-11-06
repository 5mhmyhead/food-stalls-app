import {
  COLORS,
  Card,
  F,
  FW,
  Heading,
  IconBtn,
  LabelBtn,
  Page,
  SearchBar,
  Thumb,
  u
} from "@/components/Ui";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

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
    id: "matcha",
    name: "Matcha Tea",
    category: "Drinks",
    price: "₱210.00",
    old: "₱250.00",
    color: "#9DBE8A",
  },
  {
    id: "espresso",
    name: "Light Espresso",
    category: "Drinks",
    price: "₱200.00",
    old: "",
    color: "#8B6B58",
  },
  {
    id: "choco",
    name: "Hot Chocolate",
    category: "Drinks",
    price: "₱210.00",
    old: "₱250.00",
    color: "#B8504F",
  },
  {
    id: "breakfast",
    name: "Light Espresso",
    category: "Drinks",
    price: "₱210.00",
    old: "",
    color: "#D9A441",
  },
];

export default function Orders() {
  const [qty, setQty] = useState<Record<string, number>>({ espresso: 1 });
  const cardWidth = (FW - 44 * u - 12 * u) / 2;

  const change = (id: string, delta: number) =>
    setQty((q) => ({ ...q, [id]: Math.max(0, (q[id] ?? 0) + delta) }));

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

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 12 * u,
          marginTop: 16 * u,
        }}
      >
        {products.map((p) => {
          const n = qty[p.id] ?? 0;
          return (
            <Card
              key={p.id}
              selected={n > 0}
              style={{ width: cardWidth, padding: 8 * u }}
            >
              <Thumb width="100%" height={86} color={p.color} />
              <View style={{ paddingHorizontal: 4 * u, paddingTop: 8 * u }}>
                <Heading size={18}>{p.name}</Heading>
                <Text
                  style={{
                    fontFamily: F.reg,
                    fontSize: 9.5 * u,
                    color: COLORS.navy,
                  }}
                >
                  {p.category}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "baseline",
                    gap: 6 * u,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: F.bold,
                      fontSize: 19 * u,
                      color: COLORS.navy,
                    }}
                  >
                    {p.price}
                  </Text>
                  {p.old ? (
                    <Text
                      style={{
                        fontFamily: F.reg,
                        fontSize: 10 * u,
                        color: COLORS.pink,
                        textDecorationLine: "line-through",
                      }}
                    >
                      {p.old}
                    </Text>
                  ) : null}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8 * u,
                    marginTop: 8 * u,
                    marginBottom: 4 * u,
                  }}
                >
                  {n > 0 && (
                    <TouchableOpacity
                      style={stepBtn}
                      onPress={() => change(p.id, -1)}
                    >
                      <Ionicons name="remove" size={16 * u} color="#FFFFFF" />
                    </TouchableOpacity>
                  )}
                  <Text
                    style={{
                      fontFamily: F.semi,
                      fontSize: 13 * u,
                      color: COLORS.navy,
                      minWidth: 16 * u,
                      textAlign: "center",
                    }}
                  >
                    {n}
                  </Text>
                  <TouchableOpacity
                    style={[stepBtn, { flex: 1 }]}
                    onPress={() => change(p.id, 1)}
                  >
                    <Ionicons name="add" size={16 * u} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          );
        })}
      </View>
    </Page>
  );
}

const stepBtn = {
  height: 28 * u,
  minWidth: 36 * u,
  borderRadius: 14 * u,
  backgroundColor: COLORS.pink,
  alignItems: "center" as const,
  justifyContent: "center" as const,
};
