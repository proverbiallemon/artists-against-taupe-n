import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';
import { renderMarkdown } from '../utils/blog/adminPosts';
import { BlogPost } from '../utils/blog/types';
import { getPost } from '../utils/api/blogApi';

const AdminBlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    
    const loadPost = async () => {
      try {
        const foundPost = await getPost(slug);
        setPost(foundPost);
      } catch (error) {
        console.error('Failed to load post:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-textColor pt-20 flex items-center justify-center">
        <p className="text-xl">Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-textColor pt-20">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Post not found</h1>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the blog post you're looking for.
          </p>
          <Link
            to="/blog"
            className="text-primary font-semibold hover:underline"
          >
            ← Back to blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-background pt-20">
      <div className="max-w-3xl mx-auto px-5 py-8">
        <Link
          to="/blog"
          className="inline-flex items-center text-primary font-semibold hover:underline mb-8"
        >
          ← Back to blog
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-4 text-gray-600 mb-6">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <span>•</span>
              <span>By {post.author}</span>
            </div>

            <div className="flex gap-2 mb-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          {post.image && (
            <div className="mb-8 -mx-8 md:-mx-12">
              <img
                src={getImageUrl(post.image)}
                alt={post.title}
                className="w-full"
              />
            </div>
          )}

          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
          />
        </div>
      </div>
    </article>
  );
};

export default AdminBlogPost;