import fs from 'fs';

// Read existing galleries.json
const galleriesPath = './src/data/galleries.json';
const galleriesData = JSON.parse(fs.readFileSync(galleriesPath, 'utf8'));

// Map of HEIC files to their JPEG versions
const heicToJpegMap = {
  '12a-Main hall before.HEIC': '12a-Main hall before.jpg',
  '12c-Main hall before 2.HEIC': '12c-Main hall before 2.jpg',
  '40-SH Tv room before .HEIC': '40-SH Tv room before .jpg',
  '42-SH TV room 2.HEIC': '42-SH TV room 2.jpg',
  '44-SH TV room 4.heic': '44-SH TV room 4.jpg',
  '45-SH TV room 3.HEIC': '45-SH TV room 3.jpg',
  '61-SH Boys dorm SE wall.HEIC': '61-SH Boys dorm SE wall.jpg',
  '80-YDC Path to housing before.HEIC': '80-YDC Path to housing before.jpg',
  '84-YDC computer lab.HEIC': '84-YDC computer lab.jpg'
};

// Find the Safe Place gallery
const safePlaceGallery = galleriesData.galleries.find(g => g.id === "safe-place-louisville");

if (safePlaceGallery) {
  let updatedCount = 0;
  
  // Update each image
  safePlaceGallery.images.forEach(image => {
    // Check if this is a HEIC file that needs updating
    const jpegFilename = heicToJpegMap[image.original];
    if (jpegFilename) {
      // Update the original filename
      image.original = jpegFilename;
      
      // Update all size URLs
      const heicPath = `greatest-hits/${Object.keys(heicToJpegMap).find(k => heicToJpegMap[k] === jpegFilename)}`;
      const jpegPath = `greatest-hits/${jpegFilename}`;
      
      if (image.sizes.thumb === heicPath) image.sizes.thumb = jpegPath;
      if (image.sizes.medium === heicPath) image.sizes.medium = jpegPath;
      if (image.sizes.full === heicPath) image.sizes.full = jpegPath;
      
      // Update format
      image.format = 'standard';
      
      updatedCount++;
      console.log(`Updated: ${image.title} (${jpegFilename})`);
    }
  });
  
  // Write updated galleries.json
  fs.writeFileSync(galleriesPath, JSON.stringify(galleriesData, null, 2));
  
  console.log(`\nSuccessfully updated ${updatedCount} images from HEIC to JPEG format!`);
} else {
  console.error('Safe Place gallery not found!');
}