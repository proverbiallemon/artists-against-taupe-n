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
    // Update all image paths to use gallery-images instead of greatest-hits
    galleriesData.galleries[safePlaceGalleryIndex].images = galleriesData.galleries[safePlaceGalleryIndex].images.map(image => {
        // Remove v2- prefix from original if present
        if (image.original && image.original.startsWith('v2-')) {
            image.original = image.original.substring(3);
        }
        
        // Update all size variants to use gallery-images folder
        if (image.sizes) {
            for (const size in image.sizes) {
                if (image.sizes[size]) {
                    // Replace greatest-hits with gallery-images and remove v2- prefix
                    image.sizes[size] = image.sizes[size]
                        .replace('greatest-hits/', 'gallery-images/')
                        .replace('gallery-images/v2-', 'gallery-images/');
                }
            }
        }
        
        return image;
    });
    
    // Write the updated data back
    fs.writeFileSync(galleriesPath, JSON.stringify(galleriesData, null, 2));
    
    console.log('✓ Successfully updated gallery data to use gallery-images folder');
    console.log(`Updated ${galleriesData.galleries[safePlaceGalleryIndex].images.length} images in Safe Place gallery`);
} else {
    console.error('✗ Could not find Safe Place Artist Takeover Louisville gallery');
}