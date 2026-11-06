import { COLORS, Card, F, IconBtn, Page, Thumb, u } from "@/components/Ui";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";

const orders = [
  {
    id: "#82923",
    date: "October 12, 2026",
    status: "Pending",
    color: "#F08A9F",
    tint: "#F4A3B3",
    icon: "hourglass-outline",
    price: "₱920.00",
    photo: "#B8504F",
  },
  {
    id: "#45239",
    date: "October 12, 2026",
    status: "Cancelled",
    color: "#E8708C",
    tint: "#F4A3B3",
    icon: "close-circle-outline",
    price: "₱220.00",
    photo: "#D98A3D",
  },
  {
    id: "#09752",
    date: "September 28, 2026",
    status: "Completed",
    color: "#A99BD1",
    tint: "#B7A8DA",
    icon: "checkbox-outline",
    price: "₱120.00",
    photo: "#9DBE8A",
  },
  {
    id: "#09752",
    date: "September 28, 2026",
    status: "Completed",
    color: "#A99BD1",
    tint: "#B7A8DA",
    icon: "checkbox-outline",
    price: "₱180.00",
    photo: "#9DBE8A",
  },
] as const;

export default function History() {
  const router = useRouter();

  return (
    <Page
      headerHeight={120}
      bubbles={[
        { size: 130, top: -60, left: 100 },
        { size: 55, top: 40, left: 215 },
      ]}
      left={<IconBtn name="arrow-back" onPress={() => router.navigate("/")} />}
      right={<IconBtn name="menu" />}
    >
      <View style={{ gap: 12 * u }}>
        {orders.map((o, i) => (
          <Card key={i} style={{ padding: 12 * u }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ flexDirection: "row", gap: 10 * u }}>
                <View
                  style={{
                    width: 34 * u,
                    height: 34 * u,
                    borderRadius: 10 * u,
                    backgroundColor: o.tint,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name={o.icon} size={19 * u} color={COLORS.navy} />
                </View>
                <View>
                  <Text
                    style={{
                      fontFamily: F.semi,
                      fontSize: 14 * u,
                      color: COLORS.navy,
                    }}
                  >
                    Order {o.id}
                  </Text>
                  <Text
                    style={{
                      fontFamily: F.reg,
                      fontSize: 9.5 * u,
                      color: COLORS.navy,
                    }}
                  >
                    {o.date}
                  </Text>
                </View>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text
                  style={{
                    fontFamily: F.semi,
                    fontSize: 14 * u,
                    color: o.color,
                  }}
                >
                  {o.status}
                </Text>
                <Text
                  style={{
                    fontFamily: F.reg,
                    fontSize: 9.5 * u,
                    color: COLORS.navy,
                  }}
                >
                  Status
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginTop: 8 * u,
              }}
            >
              <Thumb width={140 * u} height={58} color={o.photo} />
              <Text
                style={{
                  fontFamily: F.bold,
                  fontSize: 22 * u,
                  color: COLORS.navy,
                }}
              >
                {o.price}
              </Text>
            </View>
          </Card>
        ))}
      </View>
    </Page>
  );
}
