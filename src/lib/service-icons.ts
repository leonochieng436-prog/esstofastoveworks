import {
  CookingPot,
  Flame,
  Grid3X3,
  Hammer,
  Home,
  LayoutGrid,
  Pizza,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const SERVICE_ICON_NAMES = [
  "CookingPot",
  "Flame",
  "Grid3X3",
  "Hammer",
  "Home",
  "LayoutGrid",
  "Pizza",
  "ShieldCheck",
  "Wrench",
] as const;

export type ServiceIconName = (typeof SERVICE_ICON_NAMES)[number];

const serviceIcons: Record<ServiceIconName, LucideIcon> = {
  CookingPot,
  Flame,
  Grid3X3,
  Hammer,
  Home,
  LayoutGrid,
  Pizza,
  ShieldCheck,
  Wrench,
};

export function isServiceIconName(value: string): value is ServiceIconName {
  return SERVICE_ICON_NAMES.some((name) => name === value);
}

export function getServiceIcon(value: string | null | undefined): LucideIcon {
  return value && isServiceIconName(value) ? serviceIcons[value] : Wrench;
}

export function serviceIconForName(name: string): ServiceIconName {
  const serviceName = name.toLowerCase();
  if (serviceName.includes("pizza")) return "Pizza";
  if (serviceName.includes("tiling")) return "Grid3X3";
  if (serviceName.includes("worktop")) return "LayoutGrid";
  if (serviceName.includes("repair") || serviceName.includes("maintenance")) return "Wrench";
  if (serviceName.includes("fabrication") || serviceName.includes("grill")) return "Hammer";
  if (serviceName.includes("outdoor")) return "Home";
  if (serviceName.includes("oven") || serviceName.includes("cooker") || serviceName.includes("hotplate")) return "CookingPot";
  if (serviceName.includes("stove") || serviceName.includes("fireplace") || serviceName.includes("boiler")) return "Flame";
  return "Wrench";
}
