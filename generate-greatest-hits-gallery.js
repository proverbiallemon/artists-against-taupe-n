import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read existing galleries.json
const galleriesPath = './src/data/galleries.json';
const galleriesData = JSON.parse(fs.readFileSync(galleriesPath, 'utf8'));

// Get all files from Greatest hits directory
const greatestHitsDir = './Greatest hits';
const files = fs.readdirSync(greatestHitsDir)
  .filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic'].includes(ext);
  })
  .sort();

// Generate image entries
const images = files.map((file, index) => {
  // Create a clean ID from the filename
  const id = `gh-${String(index + 1).padStart(3, '0')}`;
  
  // Extract title from filename
  // Remove number prefix and extension, clean up formatting
  let title = file;
  title = title.replace(/^\d+[a-z]*-/, ''); // Remove number prefix like "12a-"
  title = title.replace(/\.[^.]+$/, ''); // Remove extension
  title = title.replace(/_/g, ' '); // Replace underscores with spaces
  title = title.replace(/([A-Z])/g, ' $1').trim(); // Add space before capital letters
  title = title.replace(/\s+/g, ' '); // Normalize multiple spaces
  
  // For R2 URLs, we'll use the direct path
  const r2Path = `greatest-hits/${file}`;
  
  return {
    id: id,
    original: file,
    title: title,
    sizes: {
      // Since we're using the original files from R2, 
      // we'll use the same URL for all sizes for now
      thumb: r2Path,
      medium: r2Path,
      full: r2Path
    }
  };
});

// Create the new gallery entry
const greatestHitsGallery = {
  id: "greatest-hits",
  title: "Greatest Hits Collection",
  description: "A curated collection of our most impactful murals and transformative artwork from various projects across Louisville, showcasing the power of art to heal and inspire.",
  date: "2012-2024",
  location: "Various Locations",
  images: images
};

// Add to galleries array
const existingIndex = galleriesData.galleries.findIndex(g => g.id === "greatest-hits");
if (existingIndex >= 0) {
  galleriesData.galleries[existingIndex] = greatestHitsGallery;
} else {
  galleriesData.galleries.push(greatestHitsGallery);
}

// Write updated galleries.json
fs.writeFileSync(galleriesPath, JSON.stringify(galleriesData, null, 2));

console.log(`Successfully generated gallery data for ${images.length} images!`);
console.log('Gallery added to galleries.json');
console.log('\nSample entries:');
images.slice(0, 3).forEach(img => {
  console.log(`- ${img.title} (${img.original})`);
});