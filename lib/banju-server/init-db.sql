-- Banju Database Initialization
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Create indexes for poem search
-- (These are also defined via TypeORM entities, but having them here ensures they exist)
CREATE INDEX IF NOT EXISTS idx_poems_pinyin ON poems USING gin(pinyin_initials gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_poems_author ON poems(author);
CREATE INDEX IF NOT EXISTS idx_poems_dynasty ON poems(dynasty);
