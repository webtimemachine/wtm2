
ALTER TABLE "users" ADD COLUMN     "verificationCode" VARCHAR,
ADD COLUMN  "verified" BOOLEAN NOT NULL DEFAULT false;

UPDATE "users"
SET "verified" = true;
