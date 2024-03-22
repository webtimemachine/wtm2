-- CreateTable
CREATE TABLE "navigation_entry_query" (
    "id" BIGSERIAL NOT NULL,
    "navigationEntryId" BIGINT NOT NULL,
    "queryId" BIGINT NOT NULL,

    CONSTRAINT "navigation_entry_query_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "query" (
    "id" BIGSERIAL NOT NULL,
    "query" VARCHAR NOT NULL,
    "semantic" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "query_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "navigation_entry_query" ADD CONSTRAINT "navigation_entry_query_navigationEntryId_fkey" FOREIGN KEY ("navigationEntryId") REFERENCES "navigation_entry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "navigation_entry_query" ADD CONSTRAINT "navigation_entry_query_queryId_fkey" FOREIGN KEY ("queryId") REFERENCES "query"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
