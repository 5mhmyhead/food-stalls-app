import { useCatalog } from "@/catalogStore";
import {
  COLORS,
  Card,
  F,
  Heading,
  IconBtn,
  Page,
  PillButton,
  u,
} from "@/components/Ui";
import { peso } from "@/data/products";
import { addOrder, makeOrderId, todayLabel } from "@/manageStore";
import { buildCart, clearCart, setQty, useOrderState } from "@/orderStore";
import { closePayout } from "@/payoutStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const modes = ["Dine In", "Take Out", "Delivery"];

export default function PayoutScreen() {
  const router = useRouter();
  const { products } = useCatalog();
  const { qty } = useOrderState();
  const [mode, setMode] = useState("Dine In");
  const [orderId] = useState(() => makeOrderId());
  const date = todayLabel();

  const lines = useMemo(() => buildCart(qty, products), [qty, products]);
  const subtotal = lines.reduce(
    (sum, l) => sum + Math.max(l.old, l.price) * l.qty,
    0,
  );
  const total = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const discount = subtotal - total;
  const empty = lines.length === 0;

  const onComplete = () => {
    if (empty) return;
    addOrder({
      id: orderId,
      total,
      mode,
      color: lines[0].color,
      items: lines.map((l) => ({
        id: l.id,
        name: l.name,
        qty: l.qty,
        price: l.price,
      })),
    });
    clearCart();
    closePayout();
    router.navigate("/orders");
  };

  return (
    <Page
      headerHeight={108}
      bubbles={[
        { size: 130, top: -60, left: 100 },
        { size: 55, top: 30, left: 215 },
      ]}
      left={<IconBtn name="arrow-back" onPress={closePayout} />}
      right={<IconBtn name="menu" />}
    >
      <View
        style={{
          flexDirection: "row",
          backgroundColor: COLORS.card,
          borderRadius: 14 * u,
          borderWidth: 1,
          borderColor: COLORS.border,
          padding: 4 * u,
        }}
      >
        {modes.map((m) => {
          const active = m === mode;
          return (
            <TouchableOpacity
              key={m}
              onPress={() => setMode(m)}
              activeOpacity={0.85}
              style={{
                flex: 1,
                height: 32 * u,
                borderRadius: 11 * u,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: active ? COLORS.pink : "transparent",
              }}
            >
              <Text
                style={{
                  fontFamily: F.semi,
                  fontSize: 12.5 * u,
                  color: active ? "#FFFFFF" : COLORS.navy,
                }}
              >
                {m}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Card style={{ marginTop: 12 * u, padding: 12 * u }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text
              style={{
                fontFamily: F.semi,
                fontSize: 12.5 * u,
                color: COLORS.navy,
              }}
            >
              Order ID
            </Text>
            <Text
              style={{
                fontFamily: F.reg,
                fontSize: 10 * u,
                color: COLORS.navy,
              }}
            >
              #{orderId}
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontFamily: F.semi,
                fontSize: 12.5 * u,
                color: COLORS.navy,
              }}
            >
              Order Date
            </Text>
            <Text
              style={{
                fontFamily: F.reg,
                fontSize: 10 * u,
                color: COLORS.navy,
              }}
            >
              {date}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text
              style={{
                fontFamily: F.semi,
                fontSize: 12.5 * u,
                color: COLORS.navy,
              }}
            >
              Cashier
            </Text>
            <Text
              style={{
                fontFamily: F.reg,
                fontSize: 10 * u,
                color: COLORS.navy,
              }}
            >
              Dave B.
            </Text>
          </View>
        </View>
      </Card>

      <View style={{ marginTop: 18 * u, marginBottom: 10 * u }}>
        <Heading size={24}>Order Details</Heading>
      </View>

      <View style={{ gap: 10 * u }}>
        {empty && (
          <Card style={{ padding: 18 * u, alignItems: "center" }}>
            <Text
              style={{
                fontFamily: F.reg,
                fontSize: 12.5 * u,
                color: COLORS.navy,
              }}
            >
              No meals added yet. Tap Add Another to pick some.
            </Text>
          </Card>
        )}

        {lines.map((l) => (
          <Card
            key={l.id}
            style={{
              padding: 12 * u,
              flexDirection: "row",
              alignItems: "center",
              gap: 10 * u,
            }}
          >
            <View
              style={{
                width: 28 * u,
                height: 28 * u,
                borderRadius: 14 * u,
                backgroundColor: COLORS.soft,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: F.semi,
                  fontSize: 10 * u,
                  color: COLORS.navy,
                }}
              >
                {l.qty}x
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: F.semi,
                  fontSize: 13.5 * u,
                  color: COLORS.navy,
                }}
              >
                {l.name}
              </Text>
              <Text
                style={{
                  fontFamily: F.reg,
                  fontSize: 9 * u,
                  color: COLORS.navy,
                }}
              >
                {l.category}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  fontFamily: F.bold,
                  fontSize: 18 * u,
                  color: COLORS.navy,
                }}
              >
                {peso(l.price * l.qty)}
              </Text>
              {l.old > l.price ? (
                <Text
                  style={{
                    fontFamily: F.reg,
                    fontSize: 10 * u,
                    color: COLORS.pink,
                    textDecorationLine: "line-through",
                  }}
                >
                  {peso(l.old * l.qty)}
                </Text>
              ) : null}
            </View>
            <TouchableOpacity
              onPress={() => setQty(l.id, 0)}
              activeOpacity={0.85}
            >
              <Ionicons
                name="trash-outline"
                size={18 * u}
                color={COLORS.pink}
              />
            </TouchableOpacity>
          </Card>
        ))}
      </View>

      <View style={{ flexDirection: "row", marginTop: 12 * u }}>
        <View style={{ width: 120 * u }}>
          <PillButton
            title="Add Another"
            onPress={() => {
              closePayout();
              router.navigate("/orders");
            }}
          />
        </View>
      </View>

      <Card style={{ marginTop: 14 * u, padding: 16 * u }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            style={{ fontFamily: F.reg, fontSize: 13 * u, color: COLORS.navy }}
          >
            Price
          </Text>
          <Text
            style={{ fontFamily: F.semi, fontSize: 13 * u, color: COLORS.navy }}
          >
            {peso(subtotal)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 6 * u,
          }}
        >
          <Text
            style={{ fontFamily: F.reg, fontSize: 13 * u, color: COLORS.pink }}
          >
            Discount applied
          </Text>
          <Text
            style={{ fontFamily: F.semi, fontSize: 13 * u, color: COLORS.pink }}
          >
            -{peso(discount)}
          </Text>
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: COLORS.navy,
            marginVertical: 12 * u,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{ fontFamily: F.semi, fontSize: 20 * u, color: COLORS.navy }}
          >
            Total
          </Text>
          <Text
            style={{ fontFamily: F.bold, fontSize: 22 * u, color: COLORS.navy }}
          >
            {peso(total)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginTop: 14 * u,
            opacity: empty ? 0.5 : 1,
          }}
        >
          <PillButton
            title="Complete Order"
            variant="navy"
            onPress={onComplete}
          />
        </View>
      </Card>
    </Page>
  );
}
