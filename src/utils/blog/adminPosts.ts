import { BlogPost } from './types';
import { marked } from 'marked';

// Get all admin-created posts from localStorage
export function getAdminPosts(): BlogPost[] {
  const savedPosts = localStorage.getItem('blog_posts');
  if (!savedPosts) return [];
  
  try {
    return JSON.parse(savedPosts);
  } catch (error) {
    console.error('Failed to parse admin posts:', error);
    return [];
  }
}

// Convert markdown content to HTML
export function renderMarkdown(content: string): string {
  return marked(content);
}