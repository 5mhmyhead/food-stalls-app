import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { ReactElement } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const hiddenOn = ["sign-in", "sign-up", "recover", "payout"];

const { width: SW, height: SH } = Dimensions.get("window");
const FW = Math.min(SW, SH * (390 / 844));

const ACTIVE = "#e76d8a";
const INACTIVE = "#f8e9e5";

type IconDef = (color: string) => ReactElement;

const icons: Record<string, IconDef> = {
  home: (c) => <Ionicons name="home-outline" size={20} color={c} />,
  menu: (c) => <Ionicons name="trash-outline" size={20} color={c} />,
  orders: (c) => <Ionicons name="bag-handle-outline" size={20} color={c} />,
  history: (c) => <MaterialIcons name="history" size={22} color={c} />,
  settings: (c) => <Ionicons name="settings-outline" size={20} color={c} />,
};

export default function TabBar({ state, descriptors }: any) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const current = state.routes[state.index].name;

  if (hiddenOn.includes(current)) return null;

  return (
    <View style={[styles.wrapper, { bottom: insets.bottom + 15 }]}>
      <View style={styles.container}>
        {state.routes.map((route: any, index: any) => {
        {state.routes.map((route: any, index: number) => {
          const renderIcon = icons[route.name];
          if (!renderIcon) return null;
          
          const isFocused = state.index === index;

          const onPress = () => {
            if (isFocused) return;
            router.navigate(`/${route.name}` as any);
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.8}
              style={[styles.tab, isFocused && styles.activeTab]}
            >
              {renderIcon(isFocused ? ACTIVE : INACTIVE)}
              {isFocused && (
                <Text style={styles.label}>
                <Text
                  style={{
                    color: "#e76d8a",
                    fontFamily: "Poppins",
                    fontSize: 13,
                  }}
                >
                  {descriptors[route.key].options.title}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    wrapper: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
    },
    container: {
        flexDirection: "row",
        backgroundColor: "#e76d8a",
        borderRadius: 50,
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: "center",
        justifyContent: "space-between",

        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
    },
    tab: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 50,
    },
    activeTab: {
        backgroundColor: "#f8e9e5",
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
});
    left: 0,
    right: 0,
    alignItems: "center",
  },
  container: {
    width: FW - 20,
    flexDirection: "row",
    backgroundColor: ACTIVE,
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 50,
  },
  activeTab: {
    backgroundColor: INACTIVE,
    paddingHorizontal: 14,
    flexDirection: "row",
    gap: 6,
  },
  label: {
    color: ACTIVE,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
  },
});
