-- DropForeignKey
ALTER TABLE "navigation_entry_query" DROP CONSTRAINT "navigation_entry_query_navigationEntryId_fkey";

-- DropForeignKey
ALTER TABLE "navigation_entry_query" DROP CONSTRAINT "navigation_entry_query_queryId_fkey";

-- AddForeignKey
ALTER TABLE "navigation_entry_query" ADD CONSTRAINT "navigation_entry_query_navigationEntryId_fkey" FOREIGN KEY ("navigationEntryId") REFERENCES "navigation_entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "navigation_entry_query" ADD CONSTRAINT "navigation_entry_query_queryId_fkey" FOREIGN KEY ("queryId") REFERENCES "query"("id") ON DELETE CASCADE ON UPDATE CASCADE;
