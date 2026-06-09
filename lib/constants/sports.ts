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
  label: string;
};

const DEFAULT_STYLE: SportStyle = { color: "#8B5CF6", Icon: FaFutbol, label: "Sport" };

const STYLES: Record<string, SportStyle> = {
  Běhání: { color: "#06B6D4", Icon: FaRunning, label: "Běh" },
  Plavání: { color: "#EC4899", Icon: FaSwimmer, label: "Plavání" },
  "Jízda na kole": { color: "#8B5CF6", Icon: FaBicycle, label: "Cyklistika" },
  "Silový tréning": { color: "#EC4899", Icon: FaDumbbell, label: "Silový trénink" },
  Chůze: { color: "#06B6D4", Icon: FaWalking, label: "Chůze" },
  Jóga: { color: "#8B5CF6", Icon: FaYinYang, label: "Jóga" },
  "SM systém": { color: "#10B981", Icon: FaHeart, label: "SM Systém" },
  Běžky: { color: "#10B981", Icon: FaMountain, label: "Běžky" },
};

export function getSportStyle(name: string): SportStyle {
  return STYLES[name.trim()] ?? { ...DEFAULT_STYLE, label: name.trim() || DEFAULT_STYLE.label };
}
