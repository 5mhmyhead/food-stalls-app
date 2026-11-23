import { itemCount, openScreen, useCatalog } from "@/catalogStore";
import { CategoryCard } from "@/components/CategoryIcon";
import {
  COLORS,
  Card,
  F,
  LabelBtn,
  Page,
  PillButton,
  Thumb,
  u,
} from "@/components/Ui";
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

export default function Menu() {
  const { products, categories } = useCatalog();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(
    products[0]?.id ?? null,
  );

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
      headerHeight={136}
      bubbles={[
        { size: 112, top: 8, left: 68 },
        { size: 185, top: -74, left: 176 },
        { size: 48, top: 82, left: 170 },
      ]}
      left={
        <LabelBtn
          title="Payout Order"
          icon="cart-outline"
          onPress={() => openPayout()}
        />
      }
      right={null}
    >
      {/* Search Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: 38 * u,
          backgroundColor: "#EADBD9",
          borderWidth: 1,
          borderColor: "#E8708C",
          borderRadius: 11 * u,
          paddingHorizontal: 11 * u,
        }}
      >
        <Ionicons name="search-outline" size={18 * u} color="#E8708C" />
        <View
          style={{
            width: 1,
            height: 20 * u,
            backgroundColor: "#E8708C",
            marginHorizontal: 9 * u,
          }}
        />
        <TextInput
          placeholder="search for a meal..."
          placeholderTextColor="#6E7382"
          value={query}
          onChangeText={setQuery}
          style={{
            flex: 1,
            fontFamily: F.reg,
            fontSize: 12 * u,
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

      {/* Action Pills */}
      <View style={{ flexDirection: "row", gap: 10 * u, marginTop: 12 * u }}>
        <PillButton
          title="Edit Categories"
          onPress={() => openScreen("categories")}
        />
        <PillButton
          title="Edit Products"
          variant="navy"
          onPress={() => openScreen("products")}
        />
      </View>

      {/* Horizontal Category Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 14 * u, marginHorizontal: -22 * u }}
        contentContainerStyle={{ paddingHorizontal: 22 * u, gap: 11 * u }}
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

      {/* Product List */}
      <View style={{ marginTop: 14 * u, gap: 12 * u, paddingBottom: 90 * u }}>
        {q !== "" && shown.length === 0 && (
          <Text
            style={{
              fontFamily: F.reg,
              fontSize: 13 * u,
              color: COLORS.navy,
              textAlign: "center",
              marginTop: 20 * u,
            }}
          >
            No meals found for "{query.trim()}"
          </Text>
        )}

        {shown.map((p) => {
          const isSelected = p.id === selectedId;
          return (
            <TouchableOpacity
              key={p.id}
              activeOpacity={0.9}
              onPress={() => setSelectedId(p.id)}
            >
              <Card
                style={{
                  backgroundColor: "#EADCD9",
                  padding: 11 * u,
                  borderRadius: 18 * u,
                  borderWidth: isSelected ? 1.2 : 0,
                  borderColor: isSelected ? "#E8708C" : "transparent",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Thumb
                    width={142 * u}
                    height={88}
                    color={p.color}
                    source={p.image ? { uri: p.image } : undefined}
                  />
                  <View
                    style={{
                      flex: 1,
                      alignItems: "flex-end",
                      justifyContent: "space-between",
                      height: 86 * u,
                      paddingRight: 4 * u,
                      paddingVertical: 2 * u,
                    }}
                  >
                    <View style={{ alignItems: "flex-end" }}>
                      <Text
                        numberOfLines={1}
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
                          color: "#7C8190",
                          marginTop: 2 * u,
                        }}
                      >
                        {p.category}
                      </Text>
                    </View>

                    <Text
                      style={{
                        fontFamily: F.bold,
                        fontSize: 21 * u,
                        color: COLORS.navy,
                        letterSpacing: -0.3,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: F.semi,
                          color: "#6C7283",
                        }}
                      >
                        ₱
                      </Text>
                      {p.price.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}
      </View>
    </Page>
  );
}
