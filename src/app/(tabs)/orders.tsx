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

function OrderThumbStack({
  thumbs,
}: {
  thumbs: { image?: string; color: string }[];
}) {
  const list = thumbs.slice(0, 3);
  if (list.length === 0) return null;

  const w = 136 * u;
  const h = 64;
  const stepX = 6 * u;
  const stepY = 5 * u;

  // Render back-to-front so the 1st ordered item sits on top in front
  const reversed = [...list].map((item, idx) => ({ item, idx })).reverse();

  return (
    <View
      style={{
        width: w + (list.length - 1) * stepX,
        height: h * u + (list.length - 1) * stepY,
        position: "relative",
      }}
    >
      {reversed.map(({ item, idx }) => (
        <View
          key={idx}
          style={{
            position: "absolute",
            left: idx * stepX,
            bottom: idx * stepY,
            borderRadius: 12 * u,
            overflow: "hidden",
            borderWidth: list.length > 1 ? 1 : 0,
            borderColor: "rgba(255,255,255,0.65)",
          }}
        >
          <Thumb
            width={w}
            height={h}
            color={item.color}
            source={item.image ? { uri: item.image } : undefined}
          />
        </View>
      ))}
    </View>
  );
}

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

  const orderedProducts = products.filter((p) => (qty[p.id] ?? 0) > 0);
  const totalItems = orderedProducts.reduce(
    (sum, p) => sum + (qty[p.id] ?? 0),
    0,
  );
  const totalPrice = orderedProducts.reduce(
    (sum, p) => sum + p.price * (qty[p.id] ?? 0),
    0,
  );

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
      right={null}
    >
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

      {/* Active Order Preview Stack (1, 2, or up to 3 pictures) */}
      {orderedProducts.length > 0 ? (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => openPayout()}
          style={{ marginTop: 14 * u }}
        >
          <Card
            style={{
              padding: 12 * u,
              borderRadius: 18 * u,
              borderWidth: 1,
              borderColor: "#E8708C",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8 * u,
              }}
            >
              <Text
                style={{
                  fontFamily: F.bold,
                  fontSize: 13.5 * u,
                  color: COLORS.navy,
                }}
              >
                Current Order ({totalItems}{" "}
                {totalItems === 1 ? "item" : "items"})
              </Text>
              <Text
                style={{
                  fontFamily: F.semi,
                  fontSize: 11 * u,
                  color: COLORS.pink,
                }}
              >
                Tap to Payout
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <OrderThumbStack
                thumbs={orderedProducts.slice(0, 3).map((p) => ({
                  image: p.image,
                  color: p.color,
                }))}
              />
              <Text
                style={{
                  fontFamily: F.bold,
                  fontSize: 22 * u,
                  color: COLORS.navy,
                }}
              >
                {peso(totalPrice)}
              </Text>
            </View>
          </Card>
        </TouchableOpacity>
      ) : null}

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
          paddingBottom: 24 * u,
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
