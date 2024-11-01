-- AddForeignKey
ALTER TABLE "entry_tag" ADD CONSTRAINT "entry_tag_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "navigation_entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entry_tag" ADD CONSTRAINT "entry_tag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
