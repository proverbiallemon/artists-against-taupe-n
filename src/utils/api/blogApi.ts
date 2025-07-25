import { BlogPost } from '../blog/types';
import { getAuthHeaders } from './auth';

const API_BASE = import.meta.env.DEV 
  ? 'http://localhost:8788/api'  // For wrangler dev
  : '/api';  // For production

// Login
export async function login(password: string): Promise<{ success: boolean; token?: string }> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });
  
  const data = await response.json();
  
  if (data.success && data.token) {
    localStorage.setItem('admin_token', data.token);
  }
  
  return data;
}

// Get all posts
export async function getPosts(includeUnpublished = false): Promise<BlogPost[]> {
  const headers = includeUnpublished ? getAuthHeaders() : {};
  
  const response = await fetch(`${API_BASE}/blog/posts`, { headers });
  
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  
  return response.json();
}

// Get single post
export async function getPost(idOrSlug: string): Promise<BlogPost> {
  const response = await fetch(`${API_BASE}/blog/${idOrSlug}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch post');
  }
  
  return response.json();
}

// Create post
export async function createPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost> {
  const response = await fetch(`${API_BASE}/blog/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(post)
  });
  
  if (!response.ok) {
    throw new Error('Failed to create post');
  }
  
  return response.json();
}

// Update post
export async function updatePost(id: string, updates: Partial<BlogPost>): Promise<void> {
  const response = await fetch(`${API_BASE}/blog/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(updates)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Update failed:', response.status, errorText);
    throw new Error('Failed to update post');
  }
  
  // Ensure the response body is consumed
  await response.json().catch(() => {});
}

// Delete post
export async function deletePost(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/blog/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete post');
  }
}