import type { FC } from "react";
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
