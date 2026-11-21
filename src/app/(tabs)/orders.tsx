import { itemCount, useCatalog } from "@/catalogStore";
import { CategoryCard } from "@/components/CategoryIcon";
import {
  COLORS,
  Card,
  F,
  FW,
  Heading,
  LabelBtn,
  Page,
  Thumb,
  u,
} from "@/components/Ui";
import { peso } from "@/data/products";
import { openManage } from "@/manageStore";
import { changeQty, selectProduct, useOrderState } from "@/orderStore";
import { openPayout } from "@/payoutStore";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const stepBtn = {
  height: 26 * u,
  width: 48 * u,
  borderRadius: 13 * u,
  backgroundColor: COLORS.pink,
  alignItems: "center" as const,
  justifyContent: "center" as const,
};

export default function Orders() {
  const { products, categories } = useCatalog();
  const { qty } = useOrderState();
  const [query, setQuery] = useState("");
  const cardWidth = (FW - 44 * u - 12 * u) / 2;

  const q = query.trim().toLowerCase();
  const shown = q
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
    : products;

  return (
    <Page
      headerHeight={145}
      bubbles={[
        { size: 140, top: -70, left: 110 },
        { size: 50, top: 70, left: 20 },
      ]}
      left={
        <LabelBtn
          title="Payout Order"
          icon="cart-outline"
          onPress={() => openPayout()}
        />
      }
    >
      {/* Search Bar matching mockup */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: 42 * u,
          backgroundColor: "#E8DBD9",
          borderWidth: 1,
          borderColor: "#E8708C",
          borderRadius: 11 * u,
          paddingHorizontal: 12 * u,
        }}
      >
        <Ionicons name="search-outline" size={20 * u} color="#E8708C" />
        <View
          style={{
            width: 1,
            height: 22 * u,
            backgroundColor: "#E8708C",
            marginHorizontal: 10 * u,
          }}
        />
        <TextInput
          placeholder="search for a meal..."
          placeholderTextColor="#243759"
          value={query}
          onChangeText={setQuery}
          style={{
            flex: 1,
            fontFamily: F.reg,
            fontSize: 12.5 * u,
            color: "#243759",
            paddingVertical: 0,
          }}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")} hitSlop={8}>
            <Ionicons name="close-circle" size={16 * u} color="#E8708C" />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => openManage()}
        style={{
          backgroundColor: COLORS.pink,
          borderRadius: 999,
          height: 34 * u,
          alignItems: "center",
          justifyContent: "center",
          marginTop: 12 * u,
        }}
      >
        <Text
          style={{
            fontFamily: F.semi,
            fontSize: 12 * u,
            color: "#FFFFFF",
          }}
        >
          Manage Orders
        </Text>
      </TouchableOpacity>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 16 * u, marginHorizontal: -22 * u }}
        contentContainerStyle={{ paddingHorizontal: 22 * u, gap: 12 * u }}
      >
        {categories.map((c) => (
          <CategoryCard
            key={c.id}
            category={c}
            count={itemCount(products, c)}
            onPress={() => setQuery(c.id === "all" ? "" : c.name)}
          />
        ))}
      </ScrollView>

      {q !== "" && shown.length === 0 && (
        <Text
          style={{
            fontFamily: F.reg,
            fontSize: 13 * u,
            color: COLORS.navy,
            textAlign: "center",
            marginTop: 24 * u,
          }}
        >
          No meals found for "{query.trim()}"
        </Text>
      )}

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 12 * u,
          marginTop: 16 * u,
        }}
      >
        {shown.map((p) => {
          const n = qty[p.id] ?? 0;
          return (
            <Card
              key={p.id}
              selected={n > 0}
              style={{ width: cardWidth, padding: 8 * u }}
            >
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => selectProduct(p.id)}
              >
                <Thumb
                  width="100%"
                  height={86}
                  color={p.color}
                  source={p.image ? { uri: p.image } : undefined}
                />
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
                      {peso(p.price)}
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
                        {peso(p.old)}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#FFFFFF",
                  borderWidth: 1,
                  borderColor: COLORS.pink,
                  borderRadius: 999,
                  padding: 3 * u,
                  marginTop: 8 * u,
                  marginBottom: 2 * u,
                }}
              >
                {n > 0 ? (
                  <TouchableOpacity
                    style={stepBtn}
                    onPress={() => changeQty(p.id, -1)}
                  >
                    <Ionicons name="remove" size={16 * u} color="#FFFFFF" />
                  </TouchableOpacity>
                ) : (
                  <View style={{ width: stepBtn.width }} />
                )}

                <Text
                  style={{
                    flex: 1,
                    fontFamily: F.semi,
                    fontSize: 13 * u,
                    color: COLORS.navy,
                    textAlign: "center",
                  }}
                >
                  {n}
                </Text>

                <TouchableOpacity
                  style={stepBtn}
                  onPress={() => changeQty(p.id, 1)}
                >
                  <Ionicons name="add" size={16 * u} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </Card>
          );
        })}
      </View>
    </Page>
  );
}
