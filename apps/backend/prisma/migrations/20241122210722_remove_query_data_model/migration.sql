/*
  Warnings:

  - You are about to drop the `navigation_entry_query` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `query` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "navigation_entry_query" DROP CONSTRAINT "navigation_entry_query_navigationEntryId_fkey";

-- DropForeignKey
ALTER TABLE "navigation_entry_query" DROP CONSTRAINT "navigation_entry_query_queryId_fkey";

-- DropTable
DROP TABLE "navigation_entry_query";

-- DropTable
DROP TABLE "query";
