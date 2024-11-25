ALTER TABLE navigation_entry 
ADD COLUMN "tsvectorGeneratedContent" tsvector not null GENERATED ALWAYS AS (to_tsvector('english', "aiGeneratedContent")) STORED;