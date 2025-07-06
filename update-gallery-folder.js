import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the galleries.json file
const galleriesPath = path.join(__dirname, 'src/data/galleries.json');
const data = JSON.parse(fs.readFileSync(galleriesPath, 'utf8'));

// Update all image paths to use gallery-v2
let updateCount = 0;
data.galleries.forEach(gallery => {
    gallery.images.forEach(image => {
        // Update all size paths
        if (image.sizes) {
            Object.keys(image.sizes).forEach(size => {
                if (image.sizes[size] && image.sizes[size].includes('gallery-images/')) {
                    image.sizes[size] = image.sizes[size].replace('gallery-images/', 'gallery-v2/');
                    updateCount++;
                }
            });
        }
    });
});

// Write the updated data back
fs.writeFileSync(galleriesPath, JSON.stringify(data, null, 2));
console.log(`Updated ${updateCount} image paths to use gallery-v2 folder`);
