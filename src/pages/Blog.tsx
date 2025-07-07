import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts, BlogPostMeta } from '../utils/blog/loadPosts';
import { getImageUrl } from '../utils/imageUtils';
import { getPosts } from '../utils/api/blogApi';

interface CombinedPost extends BlogPostMeta {
  isAdmin?: boolean;
}

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<CombinedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        // Load MDX posts
        const mdxPosts = await getAllPosts();
        
        // Load admin posts from API
        const adminPosts = await getPosts();
        const adminPostsMapped = adminPosts
          .filter(post => post.published)
          .map(post => ({
            slug: post.slug,
            title: post.title,
            date: post.date,
            author: post.author,
            excerpt: post.excerpt,
            tags: post.tags,
            image: post.image,
            published: post.published,
            isAdmin: true
          }));
        
        // Combine and sort by date
        const allPosts = [...mdxPosts, ...adminPostsMapped].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        setPosts(allPosts);
      } catch (error) {
        console.error('Failed to load blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-textColor pt-20 flex items-center justify-center">
        <p className="text-xl">Loading blog posts...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-textColor pt-20">
      <div className="max-w-7xl mx-auto px-5">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-primary mb-4">Blog</h1>
          <p className="text-xl text-gray-600">
            Stories, updates, and insights from the Artists Against Taupe movement
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {post.image && (
                  <Link to={`/blog/${post.slug}`}>
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={getImageUrl(post.image)}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                )}
                
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                    <span>•</span>
                    <span>{post.author}</span>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <Link
                      to={`/blog/${post.slug}`}
                      className="text-primary font-semibold hover:underline"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;