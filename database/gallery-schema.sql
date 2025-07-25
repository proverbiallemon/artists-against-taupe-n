-- Gallery management schema for Artists Against Taupe

-- Galleries table
CREATE TABLE IF NOT EXISTS galleries (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT,
  location TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Gallery images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id TEXT PRIMARY KEY,
  gallery_id TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  title TEXT NOT NULL,
  r2_path TEXT NOT NULL,
  thumbnail_path TEXT,
  medium_path TEXT,
  full_path TEXT,
  format TEXT DEFAULT 'standard',
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (gallery_id) REFERENCES galleries(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_gallery_images_gallery_id ON gallery_images(gallery_id);
CREATE INDEX IF NOT EXISTS idx_gallery_images_sort_order ON gallery_images(sort_order);

-- Insert existing gallery data
INSERT OR IGNORE INTO galleries (id, title, description, date, location) VALUES
  ('safe-place-louisville', 'Safe Place Art Takeover Louisville', 'Transforming institutional spaces at the YMCA Safe Place Shelter through vibrant murals and artwork.', '2022-2025', 'Louisville, KY');