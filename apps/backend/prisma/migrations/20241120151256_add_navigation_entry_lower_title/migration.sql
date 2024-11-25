-- AlterTable
ALTER TABLE navigation_entry
ADD COLUMN "titleLower" VARCHAR NOT NULL GENERATED ALWAYS AS (LOWER("title")) STORED;