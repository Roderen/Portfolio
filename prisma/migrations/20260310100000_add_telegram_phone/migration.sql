-- Idempotent migration: add telegram and phone columns, make name/message nullable

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ContactMessage' AND column_name = 'telegram'
  ) THEN
    ALTER TABLE "ContactMessage" ADD COLUMN "telegram" TEXT NOT NULL DEFAULT '';
    ALTER TABLE "ContactMessage" ALTER COLUMN "telegram" DROP DEFAULT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ContactMessage' AND column_name = 'phone'
  ) THEN
    ALTER TABLE "ContactMessage" ADD COLUMN "phone" TEXT;
  END IF;
END $$;

ALTER TABLE "ContactMessage" ALTER COLUMN "name" DROP NOT NULL;
ALTER TABLE "ContactMessage" ALTER COLUMN "message" DROP NOT NULL;
