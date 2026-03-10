-- AlterTable: add telegram (required) and phone (optional) to ContactMessage
-- Make name and message optional as per schema

-- Step 1: add telegram with a default so existing rows don't fail
ALTER TABLE "ContactMessage" ADD COLUMN "telegram" TEXT NOT NULL DEFAULT '';
ALTER TABLE "ContactMessage" ADD COLUMN "phone" TEXT;

-- Step 2: remove the default (Prisma manages required columns without defaults)
ALTER TABLE "ContactMessage" ALTER COLUMN "telegram" DROP DEFAULT;

-- Step 3: make name and message nullable
ALTER TABLE "ContactMessage" ALTER COLUMN "name" DROP NOT NULL;
ALTER TABLE "ContactMessage" ALTER COLUMN "message" DROP NOT NULL;
