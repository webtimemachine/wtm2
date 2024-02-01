-- CreateTable
CREATE TABLE "navigation_entry" (
    "id" BIGSERIAL NOT NULL,
    "url" VARCHAR NOT NULL,
    "title" VARCHAR NOT NULL,
    "content" VARCHAR,
    "userId" BIGINT NOT NULL,
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMPTZ(0),

    CONSTRAINT "navigation_entry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "navigation_entry" ADD CONSTRAINT "navigation_entry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
