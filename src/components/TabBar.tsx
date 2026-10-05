import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TabBar({
  state,
  descriptors,
  navigation,
}: any) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {state.routes.map((route: any, index: any) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented)
              navigation.navigate(route.name);
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