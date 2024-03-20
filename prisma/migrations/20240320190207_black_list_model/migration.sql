-- CreateTable
CREATE TABLE "black_list" (
    "id" BIGSERIAL NOT NULL,
    "url" VARCHAR NOT NULL,
    "userId" BIGINT NOT NULL,
    "flaggedAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "black_list_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "black_list" ADD CONSTRAINT "black_list_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
