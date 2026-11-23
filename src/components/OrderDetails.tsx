import { COLORS, Card, F, Heading, IconBtn, Page, u } from "@/components/Ui";
import { peso } from "@/data/products";
import { useManageState } from "@/manageStore";
import { closeOrderDetails, useOrderDetailsState } from "@/orderDetailsStore";
import { useRef } from "react";
import { Text, View } from "react-native";

const bubbles = [
  { size: 165, top: -40, left: 70 },
  { size: 36, top: 20, left: 255 },
  { size: 125, top: 68, left: 205 },
];

export default function OrderDetailsScreen() {
  const { orderId } = useOrderDetailsState();
  const { orders } = useManageState();

  const lastOrderIdRef = useRef<string | number | null>(orderId);
  if (orderId !== null) {
    lastOrderIdRef.current = orderId;
  }

  const activeOrderId = orderId ?? lastOrderIdRef.current;
  const foundOrder = orders.find((o) => String(o.id) === String(activeOrderId));

  const order = foundOrder as
    | (typeof foundOrder & {
        cashier?: string;
        type?: string;
        subtotal?: number;
        discount?: number;
        total?: number;
      })
    | undefined;

  if (!order) {
    return (
      <Page
        headerHeight={160}
        bubbles={bubbles}
        left={<IconBtn name="arrow-back" onPress={closeOrderDetails} />}
      >
        <Text
          style={{
            fontFamily: F.reg,
            fontSize: 13 * u,
            color: COLORS.navy,
            textAlign: "center",
            marginTop: 40 * u,
          }}
        >
          Order not found
        </Text>
      </Page>
    );
  }

  return (
    <Page
      headerHeight={160}
      bubbles={bubbles}
      left={<IconBtn name="arrow-back" onPress={closeOrderDetails} />}
    >
      {/* Top Meta Card: Order ID, Order Date, Cashier */}
      <Card
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 18 * u,
          paddingHorizontal: 20 * u,
          borderRadius: 16 * u,
        }}
      >
        <View style={{ alignItems: "flex-start" }}>
          <Text
            style={{
              fontFamily: F.semi,
              fontSize: 13 * u,
              color: COLORS.navy,
            }}
          >
            Order ID
          </Text>
          <Text
            style={{
              fontFamily: F.reg,
              fontSize: 10.5 * u,
              color: COLORS.navy,
              marginTop: 2 * u,
            }}
          >
            #{order.id}
          </Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontFamily: F.semi,
              fontSize: 13 * u,
              color: COLORS.navy,
            }}
          >
            Order Date
          </Text>
          <Text
            style={{
              fontFamily: F.reg,
              fontSize: 10.5 * u,
              color: COLORS.navy,
              marginTop: 2 * u,
            }}
          >
            {order.date}
          </Text>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <Text
            style={{
              fontFamily: F.semi,
              fontSize: 13 * u,
              color: COLORS.navy,
            }}
          >
            Cashier
          </Text>
          <Text
            style={{
              fontFamily: F.reg,
              fontSize: 10.5 * u,
              color: COLORS.navy,
              marginTop: 2 * u,
            }}
          >
            {order.cashier ?? "Dave B."}
          </Text>
        </View>
      </Card>

      {/* Status & Type Cards */}
      <View
        style={{
          flexDirection: "row",
          gap: 12 * u,
          marginTop: 12 * u,
        }}
      >
        <Card
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 15 * u,
            borderRadius: 16 * u,
          }}
        >
          <Text
            style={{
              fontFamily: F.semi,
              fontSize: 14 * u,
              color: "#F3A3AC",
            }}
          >
            {order.status}
          </Text>
          <Text
            style={{
              fontFamily: F.semi,
              fontSize: 10.5 * u,
              color: COLORS.navy,
              marginTop: 1 * u,
            }}
          >
            Status
          </Text>
        </Card>

        <Card
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 15 * u,
            borderRadius: 16 * u,
          }}
        >
          <Text
            style={{
              fontFamily: F.semi,
              fontSize: 14 * u,
              color: COLORS.pink,
            }}
          >
            {order.type ?? "Delivery"}
          </Text>
          <Text
            style={{
              fontFamily: F.semi,
              fontSize: 10.5 * u,
              color: COLORS.navy,
              marginTop: 1 * u,
            }}
          >
            Type
          </Text>
        </Card>
      </View>

      {/* Order Details Section */}
      <View style={{ marginTop: 22 * u, marginBottom: 10 * u }}>
        <Heading size={22}>Order Details</Heading>
      </View>

      <View style={{ gap: 10 * u }}>
        {order.items?.map((item: any) => (
          <Card
            key={item.id}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 14 * u,
              paddingHorizontal: 16 * u,
              borderRadius: 16 * u,
              gap: 12 * u,
            }}
          >
            {/* Quantity Circle Badge */}
            <View
              style={{
                width: 30 * u,
                height: 30 * u,
                borderRadius: 15 * u,
                backgroundColor: "#F4A4AD",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: F.semi,
                  fontSize: 10.5 * u,
                  color: COLORS.navy,
                }}
              >
                {`${item.qty}x`}
              </Text>
            </View>

            {/* Product Name & Category */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: F.semi,
                  fontSize: 14 * u,
                  color: COLORS.navy,
                }}
              >
                {item.name}
              </Text>
              <Text
                style={{
                  fontFamily: F.reg,
                  fontSize: 9.5 * u,
                  color: COLORS.navy,
                  opacity: 0.75,
                  marginTop: 1 * u,
                }}
              >
                {item.category}
              </Text>
            </View>

            {/* Price & Optional Discounted Original Price */}
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  fontFamily: F.bold,
                  fontSize: 18 * u,
                  color: COLORS.navy,
                }}
              >
                {peso(item.price)}
              </Text>
              {item.originalPrice !== undefined ? (
                <Text
                  style={{
                    fontFamily: F.semi,
                    fontSize: 10.5 * u,
                    color: "#F3A3AC",
                    marginTop: -2 * u,
                  }}
                >
                  {peso(item.originalPrice)}
                </Text>
              ) : null}
            </View>
          </Card>
        ))}
      </View>

      {/* Summary Section */}
      <View style={{ marginTop: 22 * u, marginBottom: 10 * u }}>
        <Heading size={22}>Summary</Heading>
      </View>

      <Card
        style={{
          paddingVertical: 18 * u,
          paddingHorizontal: 20 * u,
          borderRadius: 16 * u,
          marginBottom: 28 * u,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: F.semi,
              fontSize: 13 * u,
              color: COLORS.navy,
            }}
          >
            Price
          </Text>
          <Text
            style={{
              fontFamily: F.bold,
              fontSize: 13.5 * u,
              color: COLORS.navy,
            }}
          >
            {peso(order.subtotal ?? order.price)}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 7 * u,
          }}
        >
          <Text
            style={{
              fontFamily: F.semi,
              fontSize: 13 * u,
              color: COLORS.pink,
            }}
          >
            Discount applied
          </Text>
          <Text
            style={{
              fontFamily: F.semi,
              fontSize: 13.5 * u,
              color: "#F3A3AC",
            }}
          >
            {peso(order.discount ?? 0)}
          </Text>
        </View>

        {/* Horizontal Divider */}
        <View
          style={{
            height: 1,
            backgroundColor: "#DFD3D1",
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
            style={{
              fontFamily: F.reg,
              fontSize: 20 * u,
              color: COLORS.navy,
            }}
          >
            Total
          </Text>
          <Text
            style={{
              fontFamily: F.bold,
              fontSize: 21 * u,
              color: COLORS.navy,
            }}
          >
            {peso(order.total ?? order.price)}
          </Text>
        </View>
      </Card>
    </Page>
  );
}
