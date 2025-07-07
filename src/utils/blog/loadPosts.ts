import { ComponentType } from 'react';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  tags: string[];
  image?: string;
  published: boolean;
  content: ComponentType;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  tags: string[];
  image?: string;
  published: boolean;
}

// Get all blog posts
export async function getAllPosts(): Promise<BlogPost[]> {
  const modules = import.meta.glob<{
    default: ComponentType;
    frontmatter: Omit<BlogPostMeta, 'slug'>;
  }>('/src/content/blog/*.mdx', { eager: true });

  const posts: BlogPost[] = [];

  for (const [path, module] of Object.entries(modules)) {
    const slug = path
      .replace('/src/content/blog/', '')
      .replace('.mdx', '');

    posts.push({
      slug,
      ...module.frontmatter,
      content: module.default,
    });
  }

  // Sort by date (newest first)
  return posts
    .filter(post => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Get a single post by slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const module = await import(`../../content/blog/${slug}.mdx`);
    
    return {
      slug,
      ...module.frontmatter,
      content: module.default,
    };
  } catch (error) {
    console.error(`Failed to load post: ${slug}`, error);
    return null;
  }
}

// Get posts by tag
export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter(post => post.tags.includes(tag));
}

// Get all unique tags
export async function getAllTags(): Promise<string[]> {
  const allPosts = await getAllPosts();
  const tagSet = new Set<string>();
  
  allPosts.forEach(post => {
    post.tags.forEach(tag => tagSet.add(tag));
  });
  
  return Array.from(tagSet).sort();
}