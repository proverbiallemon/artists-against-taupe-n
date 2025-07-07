export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  author: string;
  excerpt: string;
  content: string;
  tags: string[];
  image?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}