-- Keep the owner's own visits and questions apart from real visitors.
-- The site sets this for browsers opened once with ?me.

ALTER TABLE visits ADD COLUMN is_me INTEGER NOT NULL DEFAULT 0;
ALTER TABLE questions ADD COLUMN is_me INTEGER NOT NULL DEFAULT 0;
