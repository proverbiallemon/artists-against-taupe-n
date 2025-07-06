# Conflict Resolution Instructions

Since we have permission issues with local files, here's how to resolve the conflicts on GitHub:

## Option 1: Use GitHub's Web Editor

1. Go to your pull request page
2. Click "Resolve conflicts" button
3. For each conflicted file:

### package.json
- Keep the changes from the feature branch (your changes)
- Make sure the gallery-related dependencies are included

### package-lock.json
- This is auto-generated, so you can accept either version
- After merging, run `npm install` locally to regenerate it properly

### src/App.tsx
- Keep your gallery route additions
- Make sure any new routes from main are also included

## Option 2: Create a Fresh Branch

Since the local environment has permission issues, you could:

1. Clone the repo in a fresh location
2. Create a new branch from main
3. Apply the gallery changes manually:
   - Copy over the gallery components
   - Add the routes to App.tsx
   - Copy the gallery data
   - Update package.json with any new dependencies

## Files to Include

Make sure these files are in your final branch:
- src/components/Gallery.tsx
- src/components/GalleryList.tsx
- src/components/ImageViewer.tsx
- src/data/galleries.json
- .env.example (with VITE_R2_PUBLIC_URL)

## Environment Variable

Remember to set in your deployment environment:
```
VITE_R2_PUBLIC_URL=https://artistsagainsttaupe.com
```