ALTER TABLE "Booking"
ADD COLUMN "termsAcceptedAt" TIMESTAMP(3),
ADD COLUMN "privacyAcknowledgedAt" TIMESTAMP(3);

ALTER TABLE "Questionnaire"
ADD COLUMN "termsAcceptedAt" TIMESTAMP(3),
ADD COLUMN "privacyAcknowledgedAt" TIMESTAMP(3);

ALTER TABLE "Enquiry"
ADD COLUMN "termsAcceptedAt" TIMESTAMP(3),
ADD COLUMN "privacyAcknowledgedAt" TIMESTAMP(3);

CREATE TABLE "LegalPolicy" (
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "revision" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LegalPolicy_pkey" PRIMARY KEY ("slug")
);

CREATE TABLE "LegalPolicyRevision" (
    "id" TEXT NOT NULL,
    "policySlug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "revision" INTEGER NOT NULL,
    "changedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LegalPolicyRevision_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CookieCategory" (
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "essential" BOOLEAN NOT NULL DEFAULT false,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CookieCategory_pkey" PRIMARY KEY ("key")
);

CREATE UNIQUE INDEX "LegalPolicyRevision_policySlug_revision_key"
ON "LegalPolicyRevision"("policySlug", "revision");

CREATE INDEX "LegalPolicyRevision_policySlug_createdAt_idx"
ON "LegalPolicyRevision"("policySlug", "createdAt");

ALTER TABLE "LegalPolicyRevision"
ADD CONSTRAINT "LegalPolicyRevision_policySlug_fkey"
FOREIGN KEY ("policySlug") REFERENCES "LegalPolicy"("slug")
ON DELETE CASCADE ON UPDATE CASCADE;
