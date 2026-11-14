import { COLORS, Card, F, IconBtn, Page, Thumb, u } from "@/components/Ui";
import { peso } from "@/data/products";
import { OrderStatus, useManageState } from "@/manageStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";

const look: Record<
  OrderStatus,
  {
    label: string;
    color: string;
    tint: string;
    icon: keyof typeof Ionicons.glyphMap;
  }
> = {
  Pending: {
    label: "Pending",
    color: "#F08A9F",
    tint: "#F4A3B3",
    icon: "hourglass-outline",
  },
  Cancelled: {
    label: "Cancelled",
    color: "#E8708C",
    tint: "#F4A3B3",
    icon: "close-circle-outline",
  },
  Complete: {
    label: "Completed",
    color: "#A99BD1",
    tint: "#B7A8DA",
    icon: "checkbox-outline",
  },
};

export default function History() {
  const router = useRouter();
  const { orders } = useManageState();

  return (
    <Page
      headerHeight={120}
      bubbles={[
        { size: 130, top: -60, left: 100 },
        { size: 55, top: 40, left: 215 },
      ]}
      left={
        <IconBtn name="arrow-back" onPress={() => router.navigate("/home")} />
      }
      right={<IconBtn name="menu" />}
    >
      {orders.length === 0 ? (
        <Text
          style={{
            fontFamily: F.reg,
            fontSize: 13 * u,
            color: COLORS.navy,
            textAlign: "center",
            marginTop: 40 * u,
          }}
        >
          No orders available
        </Text>
      ) : null}

      <View style={{ gap: 12 * u }}>
        {orders.map((o) => {
          const s = look[o.status];
          return (
            <Card key={o.id} style={{ padding: 12 * u }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row", gap: 10 * u }}>
                  <View
                    style={{
                      width: 34 * u,
                      height: 34 * u,
                      borderRadius: 10 * u,
                      backgroundColor: s.tint,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name={s.icon} size={19 * u} color={COLORS.navy} />
                  </View>
                  <View>
                    <Text
                      style={{
                        fontFamily: F.semi,
                        fontSize: 14 * u,
                        color: COLORS.navy,
                      }}
                    >
                      Order #{o.id}
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
                      color: s.color,
                    }}
                  >
                    {s.label}
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
                <Thumb width={140 * u} height={58} color={o.color} />
                <Text
                  style={{
                    fontFamily: F.bold,
                    fontSize: 22 * u,
                    color: COLORS.navy,
                  }}
                >
                  {peso(o.price)}
                </Text>
              </View>
            </Card>
          );
        })}
      </View>
    </Page>
  );
}
