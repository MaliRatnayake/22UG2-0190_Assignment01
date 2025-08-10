-- Init script for contacts DB
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL
);

-- example data (optional)
INSERT INTO contacts (name, phone) VALUES ('Alice Example','+94-77-555-0000') ON CONFLICT DO NOTHING;

