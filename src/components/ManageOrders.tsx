import { useCatalog } from "@/catalogStore";
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
import { useEffect, useRef, useState } from "react";
import { Animated, Platform, Text, TouchableOpacity, View } from "react-native";

const native = Platform.OS !== "web";
const tabs: OrderStatus[] = ["Pending", "Complete", "Cancelled"];
const PAD = 4 * u;

function OrderThumbStack({
  thumbs,
  fallbackColor,
}: {
  thumbs: { image?: string; color: string }[];
  fallbackColor: string;
}) {
  const list =
    thumbs.length > 0 ? thumbs.slice(0, 3) : [{ color: fallbackColor }];
  const w = 136 * u;
  const h = 64;
  const stepX = 6 * u;
  const stepY = 5 * u;

  // Render back-to-front so index 0 (the first ordered item) sits on top in front
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

export default function ManageOrders() {
  const { orders } = useManageState();
  const { products } = useCatalog();
  const productMap = new Map(products.map((p) => [p.id, p]));

  const [tab, setTab] = useState<OrderStatus>("Pending");
  const [barWidth, setBarWidth] = useState(0);
  const pillX = useRef(new Animated.Value(0)).current;

  const tabWidth = barWidth > 0 ? (barWidth - 2 - PAD * 2) / tabs.length : 0;

  useEffect(() => {
    Animated.spring(pillX, {
      toValue: tabs.indexOf(tab) * tabWidth,
      damping: 16,
      stiffness: 170,
      mass: 0.9,
      useNativeDriver: native,
    }).start();
  }, [tab, tabWidth]);

  const shown = orders.filter((o) => o.status === tab);

  return (
    <Page
      headerHeight={100}
      bubbles={[
        { size: 130, top: -65, left: 100 },
        { size: 55, top: 30, left: 215 },
      ]}
      left={<IconBtn name="arrow-back" onPress={closeManage} />}
      right={null}
    >
      <Card style={{ padding: 14 * u }}>
        <Heading size={30}>Order Page</Heading>
      </Card>

      <View
        onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
        style={{
          flexDirection: "row",
          backgroundColor: COLORS.card,
          borderRadius: 14 * u,
          borderWidth: 1,
          borderColor: COLORS.border,
          padding: PAD,
          marginTop: 12 * u,
        }}
      >
        {tabWidth > 0 ? (
          <Animated.View
            pointerEvents="none"
            style={{
              position: "absolute",
              left: PAD,
              top: PAD,
              width: tabWidth,
              height: 32 * u,
              borderRadius: 11 * u,
              backgroundColor: COLORS.pink,
              transform: [{ translateX: pillX }],
            }}
          />
        ) : null}

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
                alignItems: "center",
                justifyContent: "center",
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

      <View style={{ gap: 12 * u, marginTop: 14 * u, paddingBottom: 24 * u }}>
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

        {shown.map((o) => {
          const firstThreeThumbs = (o.items ?? []).slice(0, 3).map((item) => {
            const prod = productMap.get(item.id);
            return {
              image: (item as any).image ?? prod?.image,
              color: prod?.color ?? o.color,
            };
          });

          return (
            <Card key={o.id} style={{ padding: 12 * u }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
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
                  marginTop: 10 * u,
                }}
              >
                <OrderThumbStack
                  thumbs={firstThreeThumbs}
                  fallbackColor={o.color}
                />

                {o.status === "Pending" ? (
                  <View style={{ flexDirection: "row", gap: 10 * u }}>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => setOrderStatus(o.id, "Cancelled")}
                      style={[actionBtn, { backgroundColor: COLORS.navy }]}
                    >
                      <Ionicons
                        name="close"
                        size={22 * u}
                        color={COLORS.cream}
                      />
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
          );
        })}
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
