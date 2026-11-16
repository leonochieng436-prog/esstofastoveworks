ALTER TABLE "Service"
ADD COLUMN "icon" TEXT NOT NULL DEFAULT 'Wrench',
ADD COLUMN "imageUrl" TEXT,
ADD COLUMN "longDescription" TEXT,
ADD COLUMN "faqs" JSONB;

UPDATE "Service"
SET "icon" = CASE
  WHEN lower("name") LIKE '%pizza%' THEN 'Pizza'
  WHEN lower("name") LIKE '%tiling%' THEN 'Grid3X3'
  WHEN lower("name") LIKE '%worktop%' THEN 'LayoutGrid'
  WHEN lower("name") LIKE '%repair%' OR lower("name") LIKE '%maintenance%' THEN 'Wrench'
  WHEN lower("name") LIKE '%fabrication%' OR lower("name") LIKE '%grill%' THEN 'Hammer'
  WHEN lower("name") LIKE '%outdoor%' THEN 'Home'
  WHEN lower("name") LIKE '%oven%' OR lower("name") LIKE '%cooker%' OR lower("name") LIKE '%hotplate%' THEN 'CookingPot'
  WHEN lower("name") LIKE '%stove%' OR lower("name") LIKE '%fireplace%' OR lower("name") LIKE '%boiler%' THEN 'Flame'
  ELSE 'Wrench'
END;

ALTER TABLE "SiteSettings"
ADD COLUMN "servicesHeroImage" TEXT,
ADD COLUMN "servicesHeroVideoUrl" TEXT,
ADD COLUMN "servicesIntroImages" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "servicesStatLabel" TEXT,
ADD COLUMN "servicesStatValue" TEXT;
