-- AlterTable
ALTER TABLE "navigation_entry" ADD COLUMN     "navigationDate" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP;
