import { forwardRef, useEffect, useRef, useState } from 'react';
import BlogEditor from './BlogEditor';
import { type MDXEditorMethods } from '@mdxeditor/editor';

interface BlogEditorWithTrackingProps {
  markdown: string;
  onChange: (markdown: string) => void;
}

// Extract Cloudflare image IDs from markdown content
function extractCloudflareImages(content: string): string[] {
  const images: string[] = [];
  const regex = /https:\/\/imagedelivery\.net\/[^/]+\/([^/]+)\/[^"'\s)]+/g;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    images.push(match[1]);
  }
  
  return [...new Set(images)]; // Remove duplicates
}

// Delete image from Cloudflare
async function deleteImage(imageId: string): Promise<void> {
  const token = localStorage.getItem('admin_token');
  
  try {
    const response = await fetch(`/api/images/${imageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      console.error('Failed to delete image:', imageId);
    }
  } catch (error) {
    console.error('Error deleting image:', error);
  }
}

const BlogEditorWithTracking = forwardRef<MDXEditorMethods, BlogEditorWithTrackingProps>(
  ({ markdown, onChange }, ref) => {
    const [previousImages, setPreviousImages] = useState<string[]>([]);
    const isFirstRender = useRef(true);
    
    useEffect(() => {
      const currentImages = extractCloudflareImages(markdown);
      
      // Skip the first render to avoid deleting images when loading
      if (isFirstRender.current) {
        isFirstRender.current = false;
        setPreviousImages(currentImages);
        return;
      }
      
      // Find images that were removed
      const removedImages = previousImages.filter(id => !currentImages.includes(id));
      
      // Delete removed images
      removedImages.forEach(imageId => {
        console.log('Deleting removed image:', imageId);
        deleteImage(imageId);
      });
      
      // Update the previous images list
      setPreviousImages(currentImages);
    }, [markdown, previousImages]);
    
    return (
      <BlogEditor
        ref={ref}
        markdown={markdown}
        onChange={onChange}
      />
    );
  }
);

BlogEditorWithTracking.displayName = 'BlogEditorWithTracking';

export default BlogEditorWithTracking;