import type { Category } from "@/catalogStore";
import { COLORS, F, u } from "@/components/Ui";
import type { FC } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import type { SvgProps } from "react-native-svg";
import Bbq from "../../assets/icons/bbq.svg";
import Bowl from "../../assets/icons/bowl.svg";
import Burgers from "../../assets/icons/burgers.svg";
import Coffee from "../../assets/icons/coffee.svg";
import Crescent from "../../assets/icons/crescent.svg";
import Croissant from "../../assets/icons/croissant.svg";
import Cups from "../../assets/icons/cups.svg";
import Fish from "../../assets/icons/fish.svg";
import Knife from "../../assets/icons/knife.svg";
import Utensils from "../../assets/icons/utensils.svg";

const ICON_MAP: Record<string, FC<SvgProps>> = {
  croissant: Croissant,
  utensils: Utensils,
  knife: Knife,
  cups: Cups,
  burgers: Burgers,
  bbq: Bbq,
  coffee: Coffee,
  bowl: Bowl,
  fish: Fish,
  crescent: Crescent,
};

export const ICON_NAMES = Object.keys(ICON_MAP);

export default function CategoryIcon({
  name,
  size,
  color,
}: {
  name: string;
  size: number;
  color: string;
}) {
  const Icon = ICON_MAP[name] ?? Utensils;

  return <Icon width={size} height={size} color={color} />;
}

export function CategoryCard({
  category,
  count,
  onPress,
  selected,
  compact,
}: {
  category: Category;
  count?: number;
  onPress?: () => void;
  selected?: boolean;
  compact?: boolean;
}) {
  const length = Math.max(category.name.length, 1);
  const charWidth = compact ? 10 : 12.5;
  const baseSize = compact ? 16 : 21;
  const minWidth = compact ? 120 : 148;
  const maxWidth = compact ? 190 : 240;
  const sidePad = compact ? 10 : 13;

  const width = Math.min(
    Math.max(minWidth, length * charWidth + sidePad * 2 + 24),
    maxWidth,
  );
  const fit = (width - sidePad * 2) / (length * charWidth);
  const fontSize =
    fit < 1 ? Math.max(Math.floor(baseSize * fit), 11) : baseSize;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={!onPress}
    >
      <View
        style={{
          width: width * u,
          height: (compact ? 62 : 76) * u,
          borderRadius: (compact ? 14 : 18) * u,
          backgroundColor: category.color,
          borderWidth: selected ? 1.5 : 0,
          borderColor: selected ? COLORS.pink : "transparent",
          paddingHorizontal: sidePad * u,
          paddingVertical: (compact ? 7 : 9) * u,
          justifyContent: "space-between",
        }}
      >
        {/* Top Row: Category Title aligned right */}
        <Text
          numberOfLines={1}
          style={{
            fontFamily: F.title,
            fontSize: fontSize * u,
            lineHeight: fontSize * 1.15 * u,
            color: COLORS.navy,
            textAlign: "right",
          }}
        >
          {category.name}
        </Text>

        {/* Bottom Row: Icon on left, Item count on right */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <CategoryIcon
            name={category.icon}
            size={(compact ? 22 : 28) * u}
            color={COLORS.navy}
          />

          {count !== undefined ? (
            <Text
              style={{
                fontFamily: F.reg,
                fontSize: 10 * u,
                color: COLORS.navy,
              }}
            >
              {count} {count === 1 ? "item" : "items"}
            </Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}
