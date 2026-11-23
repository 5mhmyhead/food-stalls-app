import CancelledIcon from "@/assets/icons/cancelled.svg";
import CompleteIcon from "@/assets/icons/complete.svg";
import HourglassIcon from "@/assets/icons/hourglass.svg";
import { useCatalog } from "@/catalogStore";
import {
  COLORS,
  Card,
  F,
  Page,
  Thumb,
  TintedIcon,
  u,
  type SvgIcon,
} from "@/components/Ui";
import { peso } from "@/data/products";
import { OrderStatus, useManageState } from "@/manageStore";
import { openOrderDetails } from "@/orderDetailsStore";
import { Text, TouchableOpacity, View } from "react-native";

const look: Record<
  OrderStatus,
  {
    label: string;
    color: string;
    tint: string;
    Icon: SvgIcon;
  }
> = {
  Pending: {
    label: "Pending",
    color: "#F397A8",
    tint: "#F6B0BB",
    Icon: HourglassIcon,
  },
  Cancelled: {
    label: "Cancelled",
    color: "#E8708C",
    tint: "#F291A3",
    Icon: CancelledIcon,
  },
  Complete: {
    label: "Completed",
    color: "#A99BD1",
    tint: "#B7A8DA",
    Icon: CompleteIcon,
  },
};

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
  const stepX = 9 * u;
  const stepY = 7 * u;

  // Render back-to-front so index 0 (the first item) is on top in front
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
            borderWidth: list.length > 1 ? 1.5 : 0,
            borderColor: COLORS.card,
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

export default function History() {
  const { orders } = useManageState();
  const { products } = useCatalog();
  const productMap = new Map(products.map((p) => [p.id, p]));

  return (
    <Page
      headerHeight={144}
      bubbles={[
        { size: 155, top: -35, left: 36 },
        { size: 42, top: 96, left: 192 },
        { size: 118, top: 48, left: 256 },
      ]}
      right={null}
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

      <View style={{ gap: 12 * u, paddingBottom: 28 * u }}>
        {orders.map((o) => {
          const s = look[o.status];

          const firstThreeThumbs = (o.items ?? []).slice(0, 3).map((item) => {
            const prod = productMap.get(item.id);
            return {
              image: (item as any).image ?? prod?.image,
              color: prod?.color ?? o.color,
            };
          });

          return (
            <TouchableOpacity
              key={o.id}
              activeOpacity={0.85}
              onPress={() => openOrderDetails(o.id)}
            >
              <Card
                style={{
                  padding: 14 * u,
                  borderRadius: 18 * u,
                  borderWidth: 1,
                  borderColor: s.color,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10 * u,
                    }}
                  >
                    <View
                      style={{
                        width: 36 * u,
                        height: 36 * u,
                        borderRadius: 18 * u,
                        backgroundColor: s.tint,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <TintedIcon
                        Icon={s.Icon}
                        width={18 * u}
                        height={18 * u}
                        color={COLORS.navy}
                      />
                    </View>
                    <View>
                      <Text
                        style={{
                          fontFamily: F.bold,
                          fontSize: 14.5 * u,
                          color: COLORS.navy,
                        }}
                      >
                        Order #{o.id}
                      </Text>
                      <Text
                        style={{
                          fontFamily: F.reg,
                          fontSize: 9.5 * u,
                          color: "#5C6475",
                          marginTop: 1 * u,
                        }}
                      >
                        {o.date}
                      </Text>
                    </View>
                  </View>

                  <View style={{ alignItems: "flex-end" }}>
                    <Text
                      style={{
                        fontFamily: F.bold,
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
                        color: "#5C6475",
                        marginTop: 1 * u,
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
                    marginTop: 14 * u,
                  }}
                >
                  <OrderThumbStack
                    thumbs={firstThreeThumbs}
                    fallbackColor={o.color}
                  />
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
            </TouchableOpacity>
          );
        })}
      </View>
    </Page>
  );
}
