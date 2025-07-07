import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPost, createPost, updatePost } from '../utils/api/blogApi';

const AdminPostEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = id && id !== 'new';

  const [loading, setLoading] = useState(isEdit);
  const [formData, setFormData] = useState({
    title: '',
    author: 'Pocket Bear',
    excerpt: '',
    content: '',
    tags: '',
    image: '',
    published: false,
  });

  useEffect(() => {
    if (isEdit) {
      loadPost();
    }
  }, [id, isEdit]);

  const loadPost = async () => {
    try {
      const post = await getPost(id!);
      setFormData({
        title: post.title,
        author: post.author,
        excerpt: post.excerpt,
        content: post.content,
        tags: post.tags.join(', '),
        image: post.image || '',
        published: post.published,
      });
    } catch (error) {
      console.error('Failed to load post:', error);
      alert('Failed to load post');
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    const postData = {
      slug,
      title: formData.title,
      author: formData.author,
      excerpt: formData.excerpt,
      content: formData.content,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      image: formData.image || undefined,
      published: formData.published,
      date: new Date().toISOString(),
    };
    
    try {
      if (isEdit) {
        await updatePost(id!, postData);
      } else {
        await createPost(postData);
      }
      navigate('/admin');
    } catch (error) {
      console.error('Failed to save post:', error);
      alert('Failed to save post');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (loading && isEdit) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <p className="text-xl">Loading post...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-4xl mx-auto px-5 py-8">
        <h1 className="text-3xl font-bold text-secondary mb-8">
          {isEdit ? 'Edit Post' : 'New Post'}
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
              required
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
              Author
            </label>
            <input
              id="author"
              name="author"
              type="text"
              value={formData.author}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
              required
            />
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={2}
              value={formData.excerpt}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content (Markdown)
            </label>
            <textarea
              id="content"
              name="content"
              rows={12}
              value={formData.content}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm text-gray-900"
              placeholder="Write your post content in Markdown..."
              required
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma separated)
            </label>
            <input
              id="tags"
              name="tags"
              type="text"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
              placeholder="Focus2025, conference, art"
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image URL
            </label>
            <input
              id="image"
              name="image"
              type="text"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
              placeholder="/images/blog/post-image.jpg"
            />
          </div>

          <div className="flex items-center">
            <input
              id="published"
              name="published"
              type="checkbox"
              checked={formData.published}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
              Publish immediately
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              {isEdit ? 'Update Post' : 'Create Post'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Markdown Tips:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Headers: # H1, ## H2, ### H3</li>
            <li>• Bold: **text**</li>
            <li>• Italic: *text*</li>
            <li>• Links: [text](url)</li>
            <li>• Images: ![alt text](url)</li>
            <li>• Lists: - item or 1. item</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminPostEditor;