/*
  Warnings:

  - You are about to drop the column `semantic` on the `query` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[query]` on the table `query` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "query" DROP COLUMN "semantic";

-- CreateIndex
CREATE UNIQUE INDEX "query_query_key" ON "query"("query");
