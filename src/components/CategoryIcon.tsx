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
  const charWidth = compact ? 11.5 : 15.5;
  const baseSize = compact ? 18 : 26;
  const minWidth = compact ? 96 : 150;
  const maxWidth = compact ? 200 : 330;
  const sidePad = compact ? 10 : 14;

  const width = Math.min(
    Math.max(minWidth, length * charWidth + sidePad * 2 + 4),
    maxWidth,
  );
  const fit = (width - sidePad * 2) / (length * charWidth);
  const fontSize =
    fit < 1 ? Math.max(Math.floor(baseSize * fit), 10) : baseSize;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={!onPress}
    >
      <View
        style={{
          width: width * u,
          height: (compact ? 84 : 122) * u,
          borderRadius: (compact ? 14 : 18) * u,
          backgroundColor: category.color,
          borderWidth: selected ? 1.5 : 1,
          borderColor: selected || !compact ? COLORS.pink : COLORS.border,
          padding: sidePad * u,
          justifyContent: "space-between",
        }}
      >
        <CategoryIcon
          name={category.icon}
          size={(compact ? 22 : 32) * u}
          color={COLORS.navy}
        />
        <View>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: F.title,
              fontSize: fontSize * u,
              lineHeight: fontSize * 1.15 * u,
              color: COLORS.navy,
            }}
          >
            {category.name}
          </Text>
          {count !== undefined ? (
            <Text
              style={{
                fontFamily: F.reg,
                fontSize: 10.5 * u,
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
