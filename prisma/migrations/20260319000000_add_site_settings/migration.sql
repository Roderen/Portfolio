-- CreateTable
CREATE TABLE IF NOT EXISTS "SiteSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "photoUrl" TEXT,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);
