import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getGalleries, createGallery, updateGallery, deleteGallery, Gallery } from '../utils/api/galleryApi';

// Gallery type already includes imageCount from galleryApi

const AdminGalleries: React.FC = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: ''
  });

  useEffect(() => {
    loadGalleries();
  }, []);

  const loadGalleries = async () => {
    try {
      const galleriesData = await getGalleries();
      setGalleries(galleriesData);
    } catch (error) {
      console.error('Failed to load galleries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createGallery(formData);
      setShowCreateModal(false);
      setFormData({ title: '', description: '', date: '', location: '' });
      await loadGalleries();
    } catch (error) {
      console.error('Failed to create gallery:', error);
      alert('Failed to create gallery');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGallery) return;
    
    try {
      await updateGallery(editingGallery.id, formData);
      setEditingGallery(null);
      setFormData({ title: '', description: '', date: '', location: '' });
      await loadGalleries();
    } catch (error) {
      console.error('Failed to update gallery:', error);
      alert('Failed to update gallery');
    }
  };

  const handleDelete = async (gallery: Gallery) => {
    const message = gallery.imageCount && gallery.imageCount > 0
      ? `Are you sure you want to delete "${gallery.title}"? This will permanently delete ${gallery.imageCount} image${gallery.imageCount === 1 ? '' : 's'}.`
      : `Are you sure you want to delete "${gallery.title}"?`;
    
    if (!confirm(message)) return;
    
    try {
      await deleteGallery(gallery.id);
      await loadGalleries();
    } catch (error) {
      console.error('Failed to delete gallery:', error);
      alert('Failed to delete gallery');
    }
  };

  const startEdit = (gallery: Gallery) => {
    setEditingGallery(gallery);
    setFormData({
      title: gallery.title,
      description: gallery.description,
      date: gallery.date,
      location: gallery.location
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <p className="text-xl">Loading galleries...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-6xl mx-auto px-5 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-secondary">Gallery Management</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create Gallery
            </button>
            <Link
              to="/admin"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((gallery) => (
            <div key={gallery.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-primary mb-2">{gallery.title}</h2>
                <p className="text-gray-600 text-sm mb-2">{gallery.location} • {gallery.date}</p>
                <p className="text-gray-700 mb-4 line-clamp-3">{gallery.description}</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {gallery.imageCount || 0} {gallery.imageCount === 1 ? 'image' : 'images'}
                    </span>
                    <Link
                      to={`/admin/galleries/${gallery.id}`}
                      className="bg-primary text-white px-3 py-1 rounded hover:bg-primary/90 transition-colors text-sm"
                    >
                      Manage Images
                    </Link>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(gallery)}
                      className="flex-1 bg-secondary text-white px-3 py-1 rounded hover:bg-secondary/90 transition-colors text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(gallery)}
                      className="flex-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {galleries.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No galleries found.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create Your First Gallery
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingGallery) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-secondary mb-4">
              {editingGallery ? 'Edit Gallery' : 'Create New Gallery'}
            </h2>
            <form onSubmit={editingGallery ? handleUpdate : handleCreate}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 2024"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {editingGallery ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingGallery(null);
                    setFormData({ title: '', description: '', date: '', location: '' });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGalleries;