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
  const id = `sp-${String(index + 1).padStart(3, '0')}`;
  
  // Extract title from filename
  let title = file;
  title = title.replace(/^\d+[a-z]*-/, ''); // Remove number prefix like "12a-"
  title = title.replace(/\.[^.]+$/, ''); // Remove extension
  title = title.replace(/_/g, ' '); // Replace underscores with spaces
  title = title.replace(/([A-Z])/g, ' $1').trim(); // Add space before capital letters
  title = title.replace(/\s+/g, ' '); // Normalize multiple spaces
  
  // For R2 URLs, we'll use the direct path
  const r2Path = `greatest-hits/${file}`;
  
  // Check if it's a HEIC file - we'll need to handle these differently
  const isHeic = file.toLowerCase().endsWith('.heic');
  
  return {
    id: id,
    original: file,
    title: title,
    sizes: {
      // For HEIC files, we'll mark them differently
      thumb: r2Path,
      medium: r2Path,
      full: r2Path
    },
    format: isHeic ? 'heic' : 'standard'
  };
});

// Find the Safe Place gallery
const safePlaceIndex = galleriesData.galleries.findIndex(g => g.id === "safe-place-louisville");
if (safePlaceIndex >= 0) {
  // Keep the existing description and metadata
  const safePlaceGallery = galleriesData.galleries[safePlaceIndex];
  safePlaceGallery.images = images;
  
  // Remove the greatest-hits gallery if it exists
  const ghIndex = galleriesData.galleries.findIndex(g => g.id === "greatest-hits");
  if (ghIndex >= 0) {
    galleriesData.galleries.splice(ghIndex, 1);
  }
}

// Write updated galleries.json
fs.writeFileSync(galleriesPath, JSON.stringify(galleriesData, null, 2));

console.log(`Successfully updated Safe Place gallery with ${images.length} images!`);
console.log(`\nHEIC files found: ${images.filter(img => img.format === 'heic').length}`);
console.log('\nSample entries:');
images.slice(0, 3).forEach(img => {
  console.log(`- ${img.title} (${img.original})${img.format === 'heic' ? ' [HEIC]' : ''}`);
});