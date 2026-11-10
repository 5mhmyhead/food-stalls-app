import {
  COLORS,
  Card,
  F,
  Heading,
  IconBtn,
  Page,
  Thumb,
  u,
} from "@/components/Ui";
import { peso } from "@/data/products";
import {
  OrderStatus,
  closeManage,
  setOrderStatus,
  useManageState,
} from "@/manageStore";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const tabs: OrderStatus[] = ["Pending", "Complete", "Cancelled"];

export default function ManageOrders() {
  const { orders } = useManageState();
  const [tab, setTab] = useState<OrderStatus>("Pending");

  const shown = orders.filter((o) => o.status === tab);

  return (
    <Page
      headerHeight={100}
      bubbles={[
        { size: 130, top: -65, left: 100 },
        { size: 55, top: 30, left: 215 },
      ]}
      left={<IconBtn name="arrow-back" onPress={closeManage} />}
      right={<IconBtn name="menu" />}
    >
      <Card style={{ padding: 14 * u }}>
        <Heading size={30}>Order Page</Heading>
      </Card>

      <View
        style={{
          flexDirection: "row",
          backgroundColor: COLORS.card,
          borderRadius: 14 * u,
          borderWidth: 1,
          borderColor: COLORS.border,
          padding: 4 * u,
          marginTop: 12 * u,
        }}
      >
        {tabs.map((t) => {
          const active = t === tab;
          return (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t)}
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
                {t}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ gap: 12 * u, marginTop: 14 * u }}>
        {shown.length === 0 && (
          <Text
            style={{
              fontFamily: F.reg,
              fontSize: 13 * u,
              color: COLORS.navy,
              textAlign: "center",
              marginTop: 24 * u,
            }}
          >
            No {tab.toLowerCase()} orders
          </Text>
        )}

        {shown.map((o) => (
          <Card key={o.id} style={{ padding: 12 * u }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ flex: 1, paddingRight: 8 * u }}>
                <Text
                  style={{
                    fontFamily: F.bold,
                    fontSize: 19 * u,
                    color: COLORS.navy,
                  }}
                >
                  Order #{o.id}
                </Text>
                {o.mode ? (
                  <Text
                    style={{
                      fontFamily: F.semi,
                      fontSize: 10 * u,
                      color: COLORS.pink,
                    }}
                  >
                    {o.mode}
                  </Text>
                ) : null}
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text
                  style={{
                    fontFamily: F.bold,
                    fontSize: 19 * u,
                    color: COLORS.navy,
                  }}
                >
                  {peso(o.price)}
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

            {o.items && o.items.length > 0 ? (
              <Text
                style={{
                  fontFamily: F.reg,
                  fontSize: 10 * u,
                  color: COLORS.navy,
                  marginTop: 6 * u,
                }}
              >
                {o.items.map((i) => `${i.qty}x ${i.name}`).join(", ")}
              </Text>
            ) : null}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginTop: 8 * u,
              }}
            >
              <Thumb width={140 * u} height={70} color={o.color} />

              {o.status === "Pending" ? (
                <View style={{ flexDirection: "row", gap: 10 * u }}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => setOrderStatus(o.id, "Cancelled")}
                    style={[actionBtn, { backgroundColor: COLORS.navy }]}
                  >
                    <Ionicons name="close" size={22 * u} color={COLORS.cream} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => setOrderStatus(o.id, "Complete")}
                    style={[actionBtn, { backgroundColor: COLORS.pink }]}
                  >
                    <Ionicons
                      name="checkmark"
                      size={22 * u}
                      color={COLORS.cream}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <Text
                  style={{
                    fontFamily: F.semi,
                    fontSize: 14 * u,
                    color:
                      o.status === "Complete" ? COLORS.purple : COLORS.pink,
                  }}
                >
                  {o.status === "Complete" ? "Completed" : "Cancelled"}
                </Text>
              )}
            </View>
          </Card>
        ))}
      </View>
    </Page>
  );
}

const actionBtn = {
  width: 40 * u,
  height: 40 * u,
  borderRadius: 12 * u,
  alignItems: "center" as const,
  justifyContent: "center" as const,
};
