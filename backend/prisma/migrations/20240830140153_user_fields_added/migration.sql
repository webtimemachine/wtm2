-- AlterTable
ALTER TABLE "users" ADD COLUMN     "displayname" VARCHAR,
ADD COLUMN     "passChangedAt" TIMESTAMPTZ(0);
