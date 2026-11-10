import { useCatalog } from "@/catalogStore";
import {
  COLORS,
  Card,
  F,
  Heading,
  IconBtn,
  Page,
  PillButton,
  Thumb,
  u,
} from "@/components/Ui";
import { peso } from "@/data/products";
import { changeQty, closeProduct, setQty, useOrderState } from "@/orderStore";
import { Text, TouchableOpacity, View } from "react-native";

export default function ProductDetail() {
  const { selectedId, qty } = useOrderState();
  const { products } = useCatalog();
  const product = products.find((p) => p.id === selectedId);

  if (!product) return null;

  const n = qty[product.id] ?? 0;

  const chips = [
    { value: product.available ? "Available" : "Sold out", label: "Status" },
    { value: String(product.stock), label: "Stock" },
    { value: product.discount, label: "Discount" },
  ];

  return (
    <Page
      headerHeight={100}
      bubbles={[
        { size: 130, top: -65, left: 100 },
        { size: 55, top: 30, left: 215 },
      ]}
      left={<IconBtn name="arrow-back" onPress={closeProduct} />}
      right={<IconBtn name="menu" />}
    >
      <Thumb width="100%" height={150} color={product.color} />

      <Card style={{ marginTop: 14 * u, padding: 16 * u }}>
        <Heading size={30}>{product.name}</Heading>
        <Text
          style={{ fontFamily: F.reg, fontSize: 14 * u, color: COLORS.navy }}
        >
          {product.category}
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 8 * u,
          }}
        >
          <View>
            <Text
              style={{
                fontFamily: F.bold,
                fontSize: 28 * u,
                color: COLORS.navy,
              }}
            >
              {peso(product.price)}
            </Text>
            {product.old ? (
              <Text
                style={{
                  fontFamily: F.reg,
                  fontSize: 11 * u,
                  color: COLORS.pink,
                  textDecorationLine: "line-through",
                }}
              >
                {peso(product.old)}
              </Text>
            ) : null}
          </View>

          <View
            style={{ flexDirection: "row", alignItems: "center", gap: 6 * u }}
          >
            <TouchableOpacity
              onPress={() => changeQty(product.id, -1)}
              style={circleBtn}
              activeOpacity={0.85}
            >
              <Text
                style={{
                  fontFamily: F.bold,
                  fontSize: 22 * u,
                  color: "#FFFFFF",
                }}
              >
                -
              </Text>
            </TouchableOpacity>
            <View
              style={{
                width: 44 * u,
                height: 34 * u,
                borderRadius: 8 * u,
                backgroundColor: COLORS.cream,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: F.semi,
                  fontSize: 14 * u,
                  color: COLORS.navy,
                }}
              >
                {n}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => changeQty(product.id, 1)}
              style={circleBtn}
              activeOpacity={0.85}
            >
              <Text
                style={{
                  fontFamily: F.bold,
                  fontSize: 22 * u,
                  color: "#FFFFFF",
                }}
              >
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>

      <Card style={{ marginTop: 12 * u, padding: 14 * u }}>
        <Text
          style={{ fontFamily: F.bold, fontSize: 14 * u, color: COLORS.navy }}
        >
          Description
        </Text>
        <Text
          style={{
            fontFamily: F.reg,
            fontSize: 11 * u,
            lineHeight: 16 * u,
            color: COLORS.navy,
            marginTop: 4 * u,
          }}
        >
          {product.description}
        </Text>

        <View style={{ flexDirection: "row", gap: 10 * u, marginTop: 14 * u }}>
          {chips.map((c) => (
            <View
              key={c.label}
              style={{
                flex: 1,
                height: 48 * u,
                borderRadius: 14 * u,
                backgroundColor: COLORS.cream,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: F.bold,
                  fontSize: 14 * u,
                  color: COLORS.pink,
                }}
              >
                {c.value}
              </Text>
              <Text
                style={{
                  fontFamily: F.reg,
                  fontSize: 9 * u,
                  color: COLORS.navy,
                }}
              >
                {c.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: "row", marginTop: 14 * u }}>
          <PillButton
            title="Add to Order"
            onPress={() => {
              if (n === 0) setQty(product.id, 1);
              closeProduct();
            }}
          />
        </View>
        <View style={{ flexDirection: "row", marginTop: 10 * u }}>
          <PillButton
            title="Remove from Order"
            variant="navy"
            onPress={() => {
              setQty(product.id, 0);
              closeProduct();
            }}
          />
        </View>
      </Card>
    </Page>
  );
}

const circleBtn = {
  width: 34 * u,
  height: 34 * u,
  borderRadius: 17 * u,
  backgroundColor: COLORS.pink,
  alignItems: "center" as const,
  justifyContent: "center" as const,
};
