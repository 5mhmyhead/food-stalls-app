import { Ionicons } from "@expo/vector-icons";
import { useRouter, useSegments } from "expo-router";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const hiddenOn = ["sign-in", "sign-up", "recover"];

export default function TabBar({ state, descriptors }: any) {
  const router = useRouter();
  const segments = useSegments();

  // Extract the active route name
  const current = segments[segments.length - 1];

  const { width: SW, height: SH } = Dimensions.get("window");
  const FW = Math.min(SW, SH * (390 / 844));

  if (hiddenOn.includes(current)) return null;

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, { width: FW * 0.9 }]}>
        {state.routes.map((route: any, index: number) => {
          if (!icons[route.name]) return null;

          const isFocused = state.index === index;

          const onPress = () => {
            if (isFocused) return;
            router.navigate(
              route.name === "index" ? "/" : (`/${route.name}` as any),
            );
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={[styles.tab, isFocused && styles.activeTab]}
            >
              <Ionicons
                name={
                  isFocused
                    ? icons[route.name].focused
                    : icons[route.name].unfocused
                }
                size={24}
                color={isFocused ? "#e76d8a" : "#f8e9e5"}
              />
              {isFocused && (
                <Text
                  style={{
                    color: "#e76d8a",
                    fontFamily: "Poppins",
                    fontSize: 13,
                  }}
                >
                  {descriptors[route.key].options.title || route.name}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const icons: Record<
  string,
  {
    focused: keyof typeof Ionicons.glyphMap;
    unfocused: keyof typeof Ionicons.glyphMap;
  }
> = {
  index: { focused: "home", unfocused: "home-outline" },
  menu: { focused: "fast-food", unfocused: "fast-food-outline" },
  orders: { focused: "bag", unfocused: "bag-outline" },
  history: { focused: "time", unfocused: "time-outline" },
  profile: { focused: "person", unfocused: "person-outline" },
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
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
