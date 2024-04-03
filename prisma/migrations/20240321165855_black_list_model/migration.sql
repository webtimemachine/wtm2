-- CreateTable
CREATE TABLE "black_list" (
    "id" BIGSERIAL NOT NULL,
    "url" VARCHAR NOT NULL,
    "flaggedAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "black_list_pkey" PRIMARY KEY ("id")
);
