/*
  Warnings:

  - A unique constraint covering the columns `[navigationEntryId,queryId]` on the table `navigation_entry_query` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "navigation_entry_query_navigationEntryId_queryId_key" ON "navigation_entry_query"("navigationEntryId", "queryId");
