import type { IconType } from "react-icons";
import {
  FaRunning,
  FaSwimmer,
  FaBicycle,
  FaDumbbell,
  FaWalking,
  FaYinYang,
  FaHeart,
  FaMountain,
  FaFutbol,
} from "react-icons/fa";

export type SportStyle = {
  color: string;
  Icon: IconType;
};

const DEFAULT_STYLE: SportStyle = { color: "#8B5CF6", Icon: FaFutbol };

const STYLES: Record<string, SportStyle> = {
  Běhání: { color: "#06B6D4", Icon: FaRunning },
  Plavání: { color: "#EC4899", Icon: FaSwimmer },
  "Jízda na kole": { color: "#8B5CF6", Icon: FaBicycle },
  "Silový tréning": { color: "#EC4899", Icon: FaDumbbell },
  Chůze: { color: "#06B6D4", Icon: FaWalking },
  Jóga: { color: "#8B5CF6", Icon: FaYinYang },
  "SM systém": { color: "#10B981", Icon: FaHeart },
  Běžky: { color: "#10B981", Icon: FaMountain },
};

export function getSportStyle(name: string): SportStyle {
  return STYLES[name.trim()] ?? DEFAULT_STYLE;
}
