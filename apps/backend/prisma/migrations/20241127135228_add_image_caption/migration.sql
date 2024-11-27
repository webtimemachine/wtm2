-- AlterTable
ALTER TABLE "navigation_entry" ADD COLUMN     "imageCaptions" TEXT[] DEFAULT ARRAY[]::TEXT[];
