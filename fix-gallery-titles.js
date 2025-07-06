import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the galleries.json file
const galleriesPath = path.join(__dirname, 'src/data/galleries.json');
const data = JSON.parse(fs.readFileSync(galleriesPath, 'utf8'));

// Function to fix titles
function fixTitle(title, originalFilename) {
    // If the title starts with spaced out letters like "I M G", fix it
    if (title.match(/^[A-Z]\s+[A-Z]\s+[A-Z]\s+/)) {
        // For IMG files, use a more readable format
        if (originalFilename.startsWith('IMG_')) {
            // Extract date and time from filename like IMG_20231206_152920_806
            const match = originalFilename.match(/IMG_(\d{8})_(\d{6})_(\d+)/);
            if (match) {
                const dateStr = match[1];
                const timeStr = match[2];
                const year = dateStr.substr(0, 4);
                const month = dateStr.substr(4, 2);
                const day = dateStr.substr(6, 2);
                const hour = timeStr.substr(0, 2);
                const minute = timeStr.substr(2, 2);
                return `Photo ${year}-${month}-${day} ${hour}:${minute}`;
            }
        }
        // For other spaced out titles, just remove excessive spaces
        return title.replace(/([A-Z])\s+([A-Z])\s+([A-Z])/g, '$1$2$3');
    }
    
    // For FB_IMG files
    if (title.startsWith('F B I M G')) {
        return title.replace('F B I M G', 'FB IMG');
    }
    
    // For other titles, return as is
    return title;
}

// Fix titles in all galleries
data.galleries.forEach(gallery => {
    gallery.images.forEach(image => {
        const originalTitle = image.title;
        const fixedTitle = fixTitle(image.title, image.original);
        if (originalTitle !== fixedTitle) {
            console.log(`Fixed: "${originalTitle}" -> "${fixedTitle}"`);
            image.title = fixedTitle;
        }
    });
});

// Write the updated data back
fs.writeFileSync(galleriesPath, JSON.stringify(data, null, 2));
console.log('\nGallery titles fixed!');