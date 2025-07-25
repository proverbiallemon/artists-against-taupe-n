-- Migration script to populate galleries table with existing data

-- Insert Safe Place Louisville gallery
INSERT OR IGNORE INTO galleries (id, title, description, date, location) VALUES
  ('safe-place-louisville', 'Safe Place Art Takeover Louisville', 'Transforming institutional spaces at the YMCA Safe Place Shelter through vibrant murals and artwork.', '2022-2025', 'Louisville, KY');