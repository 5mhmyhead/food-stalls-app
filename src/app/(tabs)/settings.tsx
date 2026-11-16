import AccountIcon from "@/assets/icons/account.svg";
import PreferencesIcon from "@/assets/icons/preferences.svg";
import SecurityIcon from "@/assets/icons/security.svg";
import { session } from "@/auth";
import { COLORS, Card, F, Page, PillButton, u } from "@/components/Ui";
import { openSettings } from "@/settingsStore";
import MaskedView from "@react-native-masked-view/masked-view";
import { useRouter } from "expo-router";
import type { ComponentType } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const SafeMaskedView = MaskedView as unknown as ComponentType<any>;
type SvgIcon = ComponentType<{ width: number; height: number }>;

function TintedIcon({
  Icon,
  width,
  height,
  color,
}: {
  Icon: SvgIcon;
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

const settings: {
  key: "account" | "security" | "preferences";
  Icon: SvgIcon;
  tint: string;
  title: string;
  sub: string;
}[] = [
  {
    key: "account",
    Icon: AccountIcon,
    tint: "#F4A3B3",
    title: "Account",
    sub: "Change Account Details, Account Type",
  },
  {
    key: "security",
    Icon: SecurityIcon,
    tint: "#E8708C",
    title: "Security",
    sub: "Change Password, Admin Pass",
  },
  {
    key: "preferences",
    Icon: PreferencesIcon,
    tint: "#B7A8DA",
    title: "Preferences",
    sub: "Currency, Inventory Threshold",
  },
];

export default function Settings() {
  const router = useRouter();

  const onLogOut = () => {
    session.signOut();
    router.replace("/");
  };

  return (
    <Page
      headerHeight={150}
      bubbles={[
        { size: 117, top: 27, left: 29 },
        { size: 135, top: -30, left: 237 },
        { size: 27, top: 8, left: 160 },
      ]}
    >
      <View style={{ gap: 12 * u }}>
        {settings.map((s) => (
          <TouchableOpacity
            key={s.key}
            activeOpacity={0.85}
            onPress={() => openSettings(s.key)}
          >
            <Card
              style={{
                padding: 12 * u,
                flexDirection: "row",
                alignItems: "center",
                gap: 12 * u,
              }}
            >
              <View
                style={{
                  width: 46 * u,
                  height: 46 * u,
                  borderRadius: 23 * u,
                  backgroundColor: s.tint,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TintedIcon
                  Icon={s.Icon}
                  width={22 * u}
                  height={22 * u}
                  color={COLORS.navy}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: F.semi,
                    fontSize: 14.5 * u,
                    color: COLORS.navy,
                  }}
                >
                  {s.title}
                </Text>
                <Text
                  style={{
                    fontFamily: F.reg,
                    fontSize: 10 * u,
                    color: COLORS.navy,
                  }}
                >
                  {s.sub}
                </Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ flexDirection: "row", marginTop: 85 * u }}>
        <PillButton title="Log Out" onPress={onLogOut} />
      </View>
    </Page>
  );
}
