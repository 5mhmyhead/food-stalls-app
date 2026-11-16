import { itemCount, openScreen, useCatalog } from "@/catalogStore";
import { CategoryCard } from "@/components/CategoryIcon";
import {
  COLORS,
  Card,
  F,
  IconBtn,
  LabelBtn,
  Page,
  PillButton,
  Thumb,
  u,
} from "@/components/Ui";
import { peso } from "@/data/products";
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
      right={
        <>
          <IconBtn name="notifications-outline" />
          <IconBtn name="funnel-outline" />
        </>
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

      <View style={{ marginTop: 16 * u, gap: 12 * u }}>
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

        {shown.map((p) => (
          <Card key={p.id} style={{ padding: 8 * u }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Thumb
                width={140 * u}
                height={90}
                color={p.color}
                source={p.image ? { uri: p.image } : undefined}
              />
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
                  {peso(p.price)}
                </Text>
              </View>
            </View>
          </Card>
        ))}
      </View>
    </Page>
  );
}
