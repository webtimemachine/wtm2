-- CreateTable
CREATE TABLE "entry_tag" (
    "id" BIGSERIAL NOT NULL,
    "entryId" BIGINT NOT NULL,
    "tagId" BIGINT NOT NULL,

    CONSTRAINT "entry_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tag_name_key" ON "tag"("name");
