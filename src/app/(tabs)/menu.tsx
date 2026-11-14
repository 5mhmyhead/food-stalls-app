import { itemCount, openScreen, useCatalog } from "@/catalogStore";
import CategoryIcon from "@/components/CategoryIcon";
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
import { peso } from "@/data/products";
import { openPayout } from "@/payoutStore";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

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
      <SearchBar
        placeholder="search for a meal..."
        value={query}
        onChangeText={setQuery}
      />

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
          <TouchableOpacity
            key={c.id}
            activeOpacity={0.85}
            onPress={() => setQuery(c.id === "all" ? "" : c.name)}
          >
            <View
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
              <CategoryIcon name={c.icon} size={32 * u} color={COLORS.navy} />
              <View>
                <Heading size={26}>{c.name}</Heading>
                <Text
                  style={{
                    fontFamily: F.reg,
                    fontSize: 10.5 * u,
                    color: COLORS.navy,
                  }}
                >
                  {itemCount(products, c)} items
                </Text>
              </View>
            </View>
          </TouchableOpacity>
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
