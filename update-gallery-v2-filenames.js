import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the current galleries data
const galleriesPath = path.join(__dirname, 'src/data/galleries.json');
const galleriesData = JSON.parse(fs.readFileSync(galleriesPath, 'utf8'));

// Find the Safe Place gallery
const safePlaceGalleryIndex = galleriesData.galleries.findIndex(g => g.id === "safe-place-louisville");

if (safePlaceGalleryIndex !== -1) {
    // Update all image filenames to include v2- prefix
    galleriesData.galleries[safePlaceGalleryIndex].images = galleriesData.galleries[safePlaceGalleryIndex].images.map(image => {
        // Update the original filename
        if (image.original && !image.original.startsWith('v2-')) {
            image.original = 'v2-' + image.original;
        }
        
        // Update all size variants
        if (image.sizes) {
            for (const size in image.sizes) {
                if (image.sizes[size] && !image.sizes[size].includes('/v2-')) {
                    // Extract the path and filename
                    const parts = image.sizes[size].split('/');
                    const filename = parts[parts.length - 1];
                    parts[parts.length - 1] = 'v2-' + filename;
                    image.sizes[size] = parts.join('/');
                }
            }
        }
        
        return image;
    });
    
    // Write the updated data back
    fs.writeFileSync(galleriesPath, JSON.stringify(galleriesData, null, 2));
    
    console.log('✓ Successfully updated gallery data with v2- prefixed filenames');
    console.log(`Updated ${galleriesData.galleries[safePlaceGalleryIndex].images.length} images in Safe Place gallery`);
} else {
    console.error('✗ Could not find Safe Place Artist Takeover gallery');
}