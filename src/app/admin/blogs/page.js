'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { motion, AnimatePresence } from 'framer-motion';
import Spinner from '@/components/ui/Spinner';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminBlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [founder, setFounder] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    category: 'Web Development',
    readTime: '5 min read',
    featured: false,
    isPublished: true,
    coverImage: '',
  });
  const [uploadingCover, setUploadingCover] = useState(false);

  const categories = [
    'Web Development',
    'Mobile Development',
    'AI & Technology',
    'Design',
    'Development',
    'Business',
  ];

  useEffect(() => {
    checkAuth();
    fetchBlogs();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      if (data.success) {
        setFounder(data.founder);
        setFormData(prev => ({ ...prev, author: data.founder.name || 'DevAndDone Team' }));
      } else {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      router.push('/admin/login');
    }
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/blogs');
      const data = await response.json();

      if (data.success) {
        console.log('Blogs fetched:', data.blogs.length);
        setBlogs(data.blogs || []);
      } else if (data.error === 'Unauthorized') {
        toast.error('Please login to access this page');
        router.push('/admin/login');
      } else {
        console.error('Failed to fetch blogs:', data.error);
        toast.error(data.error || 'Failed to load blogs');
        setBlogs([]);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to load blogs');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: editingBlog ? prev.slug : generateSlug(title),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingBlog ? `/api/admin/blogs/${editingBlog._id}` : '/api/admin/blogs';
      const method = editingBlog ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(editingBlog ? 'Blog updated successfully!' : 'Blog created successfully!');
        setShowForm(false);
        setEditingBlog(null);
        resetForm();
        fetchBlogs();
      } else {
        toast.error(data.error || 'Failed to save blog');
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      toast.error('Failed to save blog');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || '',
      slug: blog.slug || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      author: blog.author || 'DevAndDone Team',
      category: blog.category || 'Web Development',
      readTime: blog.readTime || '5 min read',
      featured: blog.featured || false,
      isPublished: blog.isPublished !== undefined ? blog.isPublished : true,
      coverImage: blog.coverImage || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Blog deleted successfully!');
        fetchBlogs();
      } else {
        toast.error(data.error || 'Failed to delete blog');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete blog');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      author: founder?.name || 'DevAndDone Team',
      category: 'Web Development',
      readTime: '5 min read',
      featured: false,
      isPublished: true,
      coverImage: '',
    });
    setEditingBlog(null);
  };

  const handleCoverImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only image files are allowed (JPEG, PNG, WebP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/blogs/upload-cover', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setFormData(prev => ({ ...prev, coverImage: data.url }));
        toast.success('Cover image uploaded successfully!');
      } else {
        toast.error(data.error || 'Failed to upload cover image');
      }
    } catch (error) {
      console.error('Error uploading cover image:', error);
      toast.error('Failed to upload cover image');
    } finally {
      setUploadingCover(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBlog(null);
    resetForm();
  };

  if (loading) {
    return (
      <Section className="pt-24 pb-16">
        <div className="text-center py-12">
          <Spinner />
        </div>
      </Section>
    );
  }

  return (
    <Section className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Blog Management</h1>
            <p className="text-muted-foreground">Manage your blog posts</p>
          </div>
          <div className="flex gap-4">
            <Link href="/admin/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
            {!showForm && (
              <Button variant="primary" onClick={() => setShowForm(true)}>
                + New Blog Post
              </Button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">
                  {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Title *"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      required
                      placeholder="Next.js vs React: Which Should You Choose?"
                    />
                    <Input
                      label="Slug *"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                      placeholder="nextjs-vs-react-which-to-choose"
                      helpText="URL-friendly version of the title"
                    />
                  </div>

                  <Textarea
                    label="Excerpt *"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    required
                    rows={3}
                    placeholder="A brief description of the blog post..."
                  />

                  <Textarea
                    label="Content *"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    rows={15}
                    placeholder="Write your blog post content here. You can use HTML tags for formatting."
                    helpText="HTML is supported. Use <p>, <h2>, <h3>, <ul>, <li>, <strong>, etc."
                  />

                  {/* Cover Image Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Cover Image
                    </label>
                    <div className="flex flex-col gap-4">
                      {formData.coverImage && (
                        <div className="relative w-full max-w-md h-48 rounded-lg overflow-hidden border border-border">
                          <img
                            src={formData.coverImage}
                            alt="Cover preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, coverImage: '' }))}
                            className="absolute top-2 right-2 bg-error text-white rounded-full p-2 hover:bg-error/90 transition-colors"
                            aria-label="Remove cover image"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                      <div className="flex items-center gap-4">
                        <label className="flex-1 cursor-pointer">
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleCoverImageUpload}
                            disabled={uploadingCover}
                            className="hidden"
                          />
                          <div className="px-4 py-2 border border-border rounded-lg bg-background hover:bg-muted transition-colors text-center">
                            {uploadingCover ? 'Uploading...' : formData.coverImage ? 'Change Cover Image' : 'Upload Cover Image'}
                          </div>
                        </label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Recommended: 1200x630px. Max file size: 5MB. Formats: JPEG, PNG, WebP
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input
                      label="Author *"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      required
                    />
                    <div>
                      <label className="block text-sm font-medium mb-2">Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                        required
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Input
                      label="Read Time"
                      value={formData.readTime}
                      onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                      placeholder="5 min read"
                    />
                  </div>

                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span>Featured</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isPublished}
                        onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span>Published</span>
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={submitting}
                    >
                      {submitting ? 'Saving...' : editingBlog ? 'Update Blog' : 'Create Blog'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {blogs.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold mb-2">No blog posts yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first blog post to get started!
            </p>
            <Button variant="primary" onClick={() => setShowForm(true)}>
              Create First Blog Post
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {blogs.map((blog, index) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{blog.title}</h3>
                        {blog.featured && (
                          <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                            Featured
                          </span>
                        )}
                        {!blog.isPublished && (
                          <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded">
                            Draft
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-3">{blog.excerpt}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{blog.category}</span>
                        <span>•</span>
                        <span>{blog.readTime}</span>
                        <span>•</span>
                        <span>
                          {new Date(blog.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        {blog.views > 0 && (
                          <>
                            <span>•</span>
                            <span>{blog.views} views</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(blog)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(blog._id)}
                        className="text-destructive hover:text-destructive"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}

