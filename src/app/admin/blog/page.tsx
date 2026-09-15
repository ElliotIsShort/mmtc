'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  ExternalLink,
} from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import AdminLayout from '@/components/admin/AdminLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { BlogPost } from '@/types';
import {
  getBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from '@/lib/firestore';

const FILTER_OPTIONS = [
  { value: 'all', label: 'All Posts' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Drafts' },
];

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  author: string;
  isPublished: boolean;
}

const defaultFormData: BlogFormData = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImageUrl: '',
  author: '',
  isPublished: false,
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<BlogFormData>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete confirmation
  const [deleteConfirmPost, setDeleteConfirmPost] = useState<BlogPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const data = await getBlogPosts(true); // Include unpublished
      setPosts(data);
      setFilteredPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Filter posts
  useEffect(() => {
    let filtered = posts;

    // Status filter
    if (statusFilter === 'published') {
      filtered = filtered.filter((p) => p.isPublished);
    } else if (statusFilter === 'draft') {
      filtered = filtered.filter((p) => !p.isPublished);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.author.toLowerCase().includes(query) ||
          p.excerpt.toLowerCase().includes(query)
      );
    }

    setFilteredPosts(filtered);
  }, [searchQuery, statusFilter, posts]);

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  // Open modal for new post
  const handleAddPost = () => {
    setEditingPost(null);
    setFormData(defaultFormData);
    setFormError('');
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImageUrl: post.coverImageUrl || '',
      author: post.author,
      isPublished: post.isPublished,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title || !formData.slug || !formData.content || !formData.author) {
      setFormError('Please fill in all required fields.');
      return;
    }

    // Check for duplicate slug (excluding current post if editing)
    const duplicateSlug = posts.find(
      (p) => p.slug === formData.slug && p.id !== editingPost?.id
    );
    if (duplicateSlug) {
      setFormError('This slug is already in use. Please choose a different one.');
      return;
    }

    setIsSubmitting(true);

    try {
      const postData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt || formData.content.substring(0, 150) + '...',
        content: formData.content,
        coverImageUrl: formData.coverImageUrl || undefined,
        author: formData.author,
        isPublished: formData.isPublished,
        publishedAt: editingPost?.publishedAt || Timestamp.now(),
      };

      if (editingPost) {
        await updateBlogPost(editingPost.id, postData);
      } else {
        await createBlogPost(postData);
      }

      setIsModalOpen(false);
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      setFormError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteConfirmPost) return;

    setIsDeleting(true);

    try {
      await deleteBlogPost(deleteConfirmPost.id);
      setDeleteConfirmPost(null);
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Toggle publish status
  const handleTogglePublish = async (post: BlogPost) => {
    try {
      await updateBlogPost(post.id, { isPublished: !post.isPublished });
      fetchPosts();
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };

      // Auto-generate slug when title changes (only for new posts)
      if (name === 'title' && !editingPost) {
        newData.slug = generateSlug(value);
      }

      return newData;
    });
  };

  // Format date
  const formatDate = (timestamp: { toDate: () => Date }) => {
    try {
      return timestamp.toDate().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <AdminLayout title="Blog Manager">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-gray-600">
            Create and manage blog posts, news, and announcements.
          </p>
          <Button leftIcon={<Plus size={18} />} onClick={handleAddPost}>
            New Post
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                type="search"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <Select
                options={FILTER_OPTIONS}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-40"
              />
            </div>
          </div>
        </div>

        {/* Posts List */}
        {loading ? (
          <LoadingSpinner size="lg" className="py-12" />
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-gray-600 mb-4">
              {posts.length === 0
                ? 'No blog posts yet. Write your first one!'
                : 'No posts match your filters.'}
            </p>
            {posts.length === 0 && (
              <Button onClick={handleAddPost} leftIcon={<Plus size={18} />}>
                Write Your First Post
              </Button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Post
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                            {post.coverImageUrl ? (
                              <Image
                                src={post.coverImageUrl}
                                alt={post.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                No img
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {post.title}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              /{post.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {post.author}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            post.isPublished
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {post.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(post.publishedAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          {post.isPublished && (
                            <a
                              href={`/blog/post?slug=${post.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                              title="View post"
                            >
                              <ExternalLink size={18} />
                            </a>
                          )}
                          <button
                            onClick={() => handleTogglePublish(post)}
                            className={`p-2 rounded-lg transition-colors ${
                              post.isPublished
                                ? 'text-green-600 bg-green-50 hover:bg-green-100'
                                : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                            }`}
                            title={post.isPublished ? 'Unpublish' : 'Publish'}
                          >
                            {post.isPublished ? (
                              <Eye size={18} />
                            ) : (
                              <EyeOff size={18} />
                            )}
                          </button>
                          <button
                            onClick={() => handleEditPost(post)}
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Edit post"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmPost(post)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete post"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPost ? 'Edit Post' : 'New Blog Post'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {formError}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter post title"
            />
            <Input
              label="Slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              placeholder="url-friendly-slug"
              helperText="URL path for the post (auto-generated from title)"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              placeholder="Author name"
            />
            <Input
              label="Cover Image URL"
              name="coverImageUrl"
              type="url"
              value={formData.coverImageUrl}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <Textarea
            label="Excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="Brief summary of the post (optional - will be auto-generated if empty)"
            rows={2}
          />

          <Textarea
            label="Content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            placeholder="Write your blog post content here. HTML is supported for formatting."
            rows={12}
            helperText="You can use HTML tags for formatting (e.g., <p>, <strong>, <ul>, <li>)"
          />

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPublished"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="isPublished" className="text-sm text-gray-700">
              Publish immediately (uncheck to save as draft)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingPost ? 'Save Changes' : 'Create Post'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmPost}
        onClose={() => setDeleteConfirmPost(null)}
        title="Delete Post"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete{' '}
            <strong>&quot;{deleteConfirmPost?.title}&quot;</strong>? This action cannot
            be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setDeleteConfirmPost(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
