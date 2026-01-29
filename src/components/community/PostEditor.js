'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import TagInput from '@/components/ui/TagInput';
import Card from '@/components/ui/Card';
import { useRouter } from '@/i18n/routing';
import toast from 'react-hot-toast';
import { Save, Eye } from 'lucide-react';

export default function PostEditor({ post = null, onSave, defaultCategory = 'general' }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: post?.title || '',
    content: post?.content || '',
    excerpt: post?.excerpt || '',
    category: post?.category || defaultCategory,
    tags: post?.tags || [],
    status: post?.status || 'published',
  });

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'tech', label: 'Tech' },
    { value: 'help', label: 'Help' },
    { value: 'announcements', label: 'Announcements' },
    { value: 'showcase', label: 'Showcase' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setLoading(true);
    try {
      const url = post 
        ? `/api/community/posts/${post._id?.toString() || post.slug}`
        : '/api/community/posts';
      
      const method = post ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(post ? 'Post updated!' : 'Post created!');
        if (onSave) {
          onSave(data.post || data);
        } else if (data.post?.slug) {
          router.push(`/community/posts/${data.post.slug}`);
        } else {
          router.push('/community/posts');
        }
      } else {
        toast.error(data.error || 'Failed to save post');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Title *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter post title..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Content * (Markdown supported)
            </label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your post content here... (Markdown supported: # for headings, **bold**, *italic*, `code`)"
              rows={15}
              required
            />
            <p className="mt-2 text-sm text-muted-foreground">
              Supports Markdown: # Headings, **bold**, *italic*, `code`, etc.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Excerpt (optional)
            </label>
            <Textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief summary of your post..."
              rows={3}
            />
            <p className="mt-2 text-sm text-muted-foreground">
              Leave empty to auto-generate from content
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div>
            <TagInput
              label="Tags"
              value={formData.tags.map(tag => typeof tag === 'string' ? { name: tag, slug: tag.toLowerCase().replace(/\s+/g, '-') } : tag)}
              onChange={(tags) => setFormData({ ...formData, tags: tags.map(t => t.name || t) })}
              placeholder="Add tags (e.g., nextjs, react, web-dev)"
            />
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <div className="flex gap-2">
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : post ? 'Update Post' : 'Publish Post'}
          </Button>
        </div>
      </div>
    </form>
  );
}

