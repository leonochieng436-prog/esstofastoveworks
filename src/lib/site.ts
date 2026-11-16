import { cache } from "react";
import { db } from "./db";
import { intl, wa } from "./whatsapp";

export { intl, wa };

export const getSite = cache(async () => (await db.siteSettings.findUnique({
  where: { id: 1 },
  select: {
    id: true,
    businessName: true,
    phone1: true,
    phone2: true,
    email: true,
    location: true,
    address: true,
    mapEmbedUrl: true,
    tiktokUrl: true,
    hours: true,
    story: true,
    mission: true,
    vision: true,
    foundedNote: true,
    servicesHeroImage: true,
    servicesHeroVideoUrl: true,
    servicesIntroImages: true,
    servicesStatLabel: true,
    servicesStatValue: true,
    updatedAt: true,
  },
})) ?? {
  id: 1,
  businessName: "Esstofa Stove Works",
  phone1: "0745017194",
  phone2: "0727877452",
  email: "Reaganomondi2022@gmail.com",
  location: "Kisumu, Kenya",
  address: null,
  mapEmbedUrl: null,
  tiktokUrl: null,
  hours: "24 hours",
  story: null,
  mission: null,
  vision: null,
  foundedNote: null,
  servicesHeroImage: null,
  servicesHeroVideoUrl: null,
  servicesIntroImages: [],
  servicesStatLabel: null,
  servicesStatValue: null,
  updatedAt: new Date(),
});
export const ref = (p: string) => `${p}-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
