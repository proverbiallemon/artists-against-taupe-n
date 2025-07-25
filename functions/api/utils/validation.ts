export interface ValidationError {
  field: string;
  message: string;
}

interface BlogPost {
  title?: unknown;
  author?: unknown;
  excerpt?: unknown;
  content?: unknown;
  slug?: unknown;
  tags?: unknown;
  date?: unknown;
}

export function validateBlogPost(post: BlogPost): ValidationError[] {
  const errors: ValidationError[] = [];
  
  // Title validation
  if (!post.title || typeof post.title !== 'string') {
    errors.push({ field: 'title', message: 'Title is required' });
  } else if (post.title.length > 200) {
    errors.push({ field: 'title', message: 'Title must be under 200 characters' });
  }
  
  // Author validation
  if (!post.author || typeof post.author !== 'string') {
    errors.push({ field: 'author', message: 'Author is required' });
  } else if (post.author.length > 100) {
    errors.push({ field: 'author', message: 'Author must be under 100 characters' });
  }
  
  // Excerpt validation
  if (!post.excerpt || typeof post.excerpt !== 'string') {
    errors.push({ field: 'excerpt', message: 'Excerpt is required' });
  } else if (post.excerpt.length > 500) {
    errors.push({ field: 'excerpt', message: 'Excerpt must be under 500 characters' });
  }
  
  // Content validation
  if (!post.content || typeof post.content !== 'string') {
    errors.push({ field: 'content', message: 'Content is required' });
  } else if (post.content.length > 50000) {
    errors.push({ field: 'content', message: 'Content must be under 50000 characters' });
  }
  
  // Slug validation
  if (!post.slug || typeof post.slug !== 'string') {
    errors.push({ field: 'slug', message: 'Slug is required' });
  } else if (!/^[a-z0-9-]+$/.test(post.slug)) {
    errors.push({ field: 'slug', message: 'Slug must contain only lowercase letters, numbers, and hyphens' });
  }
  
  // Tags validation
  if (!Array.isArray(post.tags)) {
    errors.push({ field: 'tags', message: 'Tags must be an array' });
  } else if (post.tags.length > 10) {
    errors.push({ field: 'tags', message: 'Maximum 10 tags allowed' });
  } else {
    (post.tags as unknown[]).forEach((tag: unknown, index: number) => {
      if (typeof tag !== 'string' || tag.length > 50) {
        errors.push({ field: `tags[${index}]`, message: 'Each tag must be a string under 50 characters' });
      }
    });
  }
  
  // Date validation
  if (!post.date || !isValidDate(post.date)) {
    errors.push({ field: 'date', message: 'Valid date is required' });
  }
  
  return errors;
}

function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

// Sanitize content to prevent XSS
export function sanitizeContent(content: string): string {
  // Basic HTML entity encoding for now
  // In production, use a proper library like DOMPurify
  return content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}