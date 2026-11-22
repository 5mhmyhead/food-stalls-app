import AddOrderIcon from "@/assets/icons/add-order.svg";
import AnalyticsIcon from "@/assets/icons/analytics.svg";
import HistoryIcon from "@/assets/icons/history.svg";
import Kitty from "@/assets/icons/kitty.svg";
import MenuIcon from "@/assets/icons/knife.svg";
import PendingIcon from "@/assets/icons/pending.svg";
import Analytics from "@/components/Analytics";
import { F, Page, TintedIcon, u, type SvgIcon } from "@/components/Ui";
import { openManage } from "@/manageStore";
import { useSettings } from "@/settingsStore";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState, type ComponentType } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const SafeMaskedView = MaskedView as unknown as ComponentType<any>;

const S = {
  xs: 5 * u,
  sm: 8 * u,
  md: 13 * u,
  lg: 21 * u,
  xl: 34 * u,
};

const RADIUS_LG = 21 * u;
const RADIUS_SM = 8 * u;

function MaskedIcon({
  Icon,
  width,
  height,
  color,
}: {
  Icon: ComponentType<{ width: number; height: number }>;
  width: number;
  height: number;
  color: string;
}) {
  return (
    <SafeMaskedView
      style={{ width, height }}
      maskElement={
        <View style={{ width, height, backgroundColor: "transparent" }}>
          <Icon width={width} height={height} />
        </View>
      }
    >
      <View style={{ flex: 1, backgroundColor: color }} />
    </SafeMaskedView>
  );
}

type Action = {
  title: string;
  Icon: SvgIcon;
  primary?: boolean;
  onPress: () => void;
};

function Bubble({
  size,
  top,
  right,
  left,
}: {
  size: number;
  top: number;
  right?: number;
  left?: number;
}) {
  return (
    <LinearGradient
      colors={["rgba(255,255,255,0.34)", "rgba(255,255,255,0.0)"]}
      start={{ x: 0.25, y: 0 }}
      end={{ x: 0.75, y: 1 }}
      style={{
        position: "absolute",
        width: size * u,
        height: size * u,
        borderRadius: (size * u) / 2,
        top: top * u,
        ...(right !== undefined ? { right: right * u } : {}),
        ...(left !== undefined ? { left: left * u } : {}),
      }}
    />
  );
}

function Welcome({
  isAdmin,
  onOpenAnalytics,
}: {
  isAdmin: boolean;
  onOpenAnalytics: () => void;
}) {
  const router = useRouter();
  const { username } = useSettings();

  const buttons: Action[] = [
    {
      title: "Make an Order",
      Icon: AddOrderIcon,
      primary: true,
      onPress: () => router.navigate("/orders"),
    },
    {
      title: "View Menu",
      Icon: MenuIcon,
      onPress: () => router.navigate("/menu"),
    },
    {
      title: "Order History",
      Icon: HistoryIcon,
      onPress: () => router.navigate("/history"),
    },
    {
      title: "Pending Orders",
      Icon: PendingIcon,
      onPress: () => openManage(),
    },
  ];

  if (isAdmin) {
    buttons.push({
      title: "Analytics",
      Icon: AnalyticsIcon,
      onPress: onOpenAnalytics,
    });
  }

  return (
    <View
      style={{
        backgroundColor: "#E86A8A",
        borderRadius: RADIUS_LG,
        paddingHorizontal: S.lg,
        paddingTop: S.lg,
        paddingBottom: S.lg,
        overflow: "hidden",
      }}
    >
      <Bubble size={125} top={-18} right={-40} />
      <Bubble size={115} top={24} left={105} />
      <Bubble size={82} top={105} right={16} />
      <Bubble size={105} top={120} left={-32} />

      <MaskedIcon Icon={Kitty} width={55 * u} height={47 * u} color="#FFFFFF" />

      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={{
          fontFamily: F.title,
          fontSize: 30 * u,
          lineHeight: 38 * u,
          color: "#FFFFFF",
          marginTop: S.sm,
        }}
      >
        Welcome back, {username}!
      </Text>
      <Text
        style={{
          fontFamily: F.reg,
          fontSize: 12.5 * u,
          lineHeight: 18 * u,
          color: "rgba(255,255,255,0.92)",
          marginTop: S.xs,
          marginBottom: S.lg,
        }}
      >
        {
          "Everything is fresh and in order today!\nWhat would you like to get started with?"
        }
      </Text>

      <View style={{ gap: 10 * u }}>
        {buttons.map((b) => {
          const iconColor = b.primary ? "#E86A8A" : "#FFFFFF";
          return (
            <TouchableOpacity
              key={b.title}
              activeOpacity={0.85}
              onPress={b.onPress}
              style={{
                height: 42 * u,
                borderRadius: RADIUS_SM,
                backgroundColor: b.primary
                  ? "#FDEDEA"
                  : "rgba(255,255,255,0.26)",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: S.sm,
              }}
            >
              <TintedIcon
                Icon={b.Icon}
                width={17 * u}
                height={17 * u}
                color={iconColor}
              />
              <Text
                style={{
                  fontFamily: F.semi,
                  fontSize: 13.5 * u,
                  color: iconColor,
                }}
              >
                {b.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function Home() {
  const { role } = useSettings();
  const isAdmin = role === "admin";
  const [showAnalytics, setShowAnalytics] = useState(false);

  if (showAnalytics) {
    return <Analytics onBack={() => setShowAnalytics(false)} />;
  }

  return (
    <Page
      headerHeight={144}
      bubbles={[
        { size: 112, top: 10, left: 70 },
        { size: 185, top: -74, left: 182 },
        { size: 54, top: 84, left: 178 },
      ]}
      right={null}
    >
      <View style={{ marginTop: S.md, paddingBottom: S.xl }}>
        <Welcome
          isAdmin={isAdmin}
          onOpenAnalytics={() => setShowAnalytics(true)}
        />
      </View>
    </Page>
  );
}
