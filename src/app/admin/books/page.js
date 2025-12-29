'use client';

import { useState, useEffect } from 'react';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { motion } from 'framer-motion';
import Spinner from '@/components/ui/Spinner';
import toast from 'react-hot-toast';

export default function AdminBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [founders, setFounders] = useState([]); // New state for founders

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    content: '',
    pdfUrl: '',
    fileType: 'pdf',
    coverImage: '',
    category: 'General',
    tags: '',
    featured: false,
  });
  
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [coverImagePreview, setCoverImagePreview] = useState('');

  useEffect(() => {
    fetchBooks();
    fetchFounders();
  }, []);

  const fetchFounders = async () => {
    try {
      const response = await fetch('/api/founders');
      const data = await response.json();
      if (data.success) {
        setFounders(data.founders);
        // Set default author to first founder if available
        if (data.founders.length > 0 && !formData.author) {
          setFormData(prev => ({ ...prev, author: data.founders[0].name }));
        }
      }
    } catch (error) {
      console.error('Error fetching founders:', error);
    }
  };

  const fetchBooks = async () => {
    setLoading(true);
    try {
      // Fetch only books created by the current founder
      const response = await fetch('/api/admin/books');
      const data = await response.json();

      if (data.success) {
        setBooks(data.books);
      } else if (data.error === 'Unauthorized') {
        toast.error('Please login to access this page');
        window.location.href = '/admin/login';
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const bookData = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      };

      const url = editingBook ? `/api/books/${editingBook._id}` : '/api/books';
      const method = editingBook ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(editingBook ? 'Book updated successfully!' : 'Book created successfully!');
        setShowForm(false);
        setEditingBook(null);
        setFormData({
          title: '',
          author: founders.length > 0 ? founders[0].name : '',
          description: '',
          content: '',
          pdfUrl: '',
          fileType: 'pdf',
          coverImage: '',
          category: 'General',
          tags: '',
          featured: false,
        });
        setCoverImagePreview('');
        fetchBooks();
      } else {
        toast.error(data.error || 'Failed to save book');
      }
    } catch (error) {
      console.error('Error saving book:', error);
      toast.error('Failed to save book');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description,
      content: book.content || '',
      pdfUrl: book.pdfUrl || '',
      fileType: book.fileType || (book.pdfUrl ? 'pdf' : 'text'),
      coverImage: book.coverImage || '',
      category: book.category || 'General',
      tags: (book.tags || []).join(', '),
      featured: book.featured || false,
    });
    setCoverImagePreview(book.coverImage || '');
    setShowForm(true);
  };

  const handleDelete = async (bookId) => {
    if (!confirm('Are you sure you want to delete this book? This will also delete all reviews.')) {
      return;
    }

    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Book deleted successfully');
        fetchBooks();
      } else {
        toast.error(data.error || 'Failed to delete book');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('Failed to delete book');
    }
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    setUploadingPdf(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch('/api/books/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();

      if (data.success) {
        setFormData({ ...formData, pdfUrl: data.url, fileType: 'pdf' });
        toast.success('PDF uploaded successfully!');
      } else {
        toast.error(data.error || 'Failed to upload PDF');
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      toast.error('Failed to upload PDF');
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload an image file (JPEG, PNG, or WebP)');
      return;
    }

    setUploadingImage(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch('/api/books/upload-image', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();

      if (data.success) {
        setFormData({ ...formData, coverImage: data.url });
        setCoverImagePreview(data.url);
        toast.success('Cover image uploaded successfully!');
      } else {
        toast.error(data.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <Section className="pt-24 pb-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Book Management</h1>
            <p className="text-muted-foreground">Manage books in the Founder's Library</p>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              setShowForm(!showForm);
              setEditingBook(null);
              setFormData({
                title: '',
                author: founders.length > 0 ? founders[0].name : '',
                description: '',
                content: '',
                pdfUrl: '',
                fileType: 'pdf',
                coverImage: '',
                category: 'General',
                tags: '',
                featured: false,
              });
            }}
          >
            {showForm ? 'Cancel' : 'Add New Book'}
          </Button>
        </div>

        {/* Book Form */}
        {showForm && (
          <Card className="mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingBook ? 'Edit Book' : 'Create New Book'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <div>
                  <label htmlFor="author" className="block text-sm font-medium text-foreground mb-2">
                    Author <span className="text-error">*</span>
                  </label>
                  <select
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Select an author</option>
                    {founders.map((founder) => (
                      <option key={founder._id} value={founder.name}>
                        {founder.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Textarea
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                required
              />

              {/* File Type Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Book Type <span className="text-error">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="fileType"
                      value="pdf"
                      checked={formData.fileType === 'pdf'}
                      onChange={(e) => setFormData({ ...formData, fileType: 'pdf', content: '' })}
                      className="w-4 h-4"
                    />
                    <span>PDF Upload</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="fileType"
                      value="text"
                      checked={formData.fileType === 'text'}
                      onChange={(e) => setFormData({ ...formData, fileType: 'text', pdfUrl: '' })}
                      className="w-4 h-4"
                    />
                    <span>Text Content</span>
                  </label>
                </div>
              </div>

              {/* PDF Upload Section */}
              {formData.fileType === 'pdf' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    PDF File <span className="text-error">*</span>
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handlePdfUpload}
                      disabled={uploadingPdf}
                      className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-background hover:file:bg-primary-dark"
                    />
                    {uploadingPdf && (
                      <p className="text-sm text-muted-foreground">Uploading PDF...</p>
                    )}
                    {formData.pdfUrl && (
                      <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <p className="text-sm text-green-500 font-medium">PDF uploaded successfully!</p>
                        <p className="text-xs text-muted-foreground mt-1">{formData.pdfUrl}</p>
                        <a
                          href={formData.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline mt-1 inline-block"
                        >
                          View PDF
                        </a>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Maximum file size: 50MB. Only PDF files are allowed.
                    </p>
                  </div>
                </div>
              )}

              {/* Text Content Section */}
              {formData.fileType === 'text' && (
                <Textarea
                  label="Book Content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={15}
                  required
                  placeholder="Enter the full book content here..."
                />
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Cover Image
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-background hover:file:bg-primary-dark"
                    />
                    {uploadingImage && (
                      <p className="text-sm text-muted-foreground">Uploading image...</p>
                    )}
                    {coverImagePreview && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                        <div className="relative w-full max-w-xs aspect-[3/4] overflow-hidden rounded-lg border border-border">
                          <img
                            src={coverImagePreview}
                            alt="Cover preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{formData.coverImage}</p>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Maximum file size: 5MB. Supported formats: JPEG, PNG, WebP
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="General">General</option>
                    <option value="Technology">Technology</option>
                    <option value="Business">Business</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Development">Development</option>
                    <option value="Design">Design</option>
                  </select>
                </div>
              </div>

              <Input
                label="Tags (comma-separated)"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="tag1, tag2, tag3"
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="featured" className="text-sm font-medium text-foreground">
                  Featured Book
                </label>
              </div>

              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? 'Saving...' : editingBook ? 'Update Book' : 'Create Book'}
              </Button>
            </form>
          </Card>
        )}

        {/* Books List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : (
          <div className="space-y-4">
            {books.length === 0 ? (
              <Card>
                <p className="text-center text-muted-foreground py-8">
                  No books yet. Create your first book!
                </p>
              </Card>
            ) : (
              books.map((book) => (
                <Card key={book._id}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">{book.title}</h3>
                        {book.featured && (
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-2">By {book.author}</p>
                      <p className="text-sm text-foreground line-clamp-2">{book.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{book.category}</span>
                        <span>{book.views || 0} views</span>
                        <span>{book.reviewCount || 0} reviews</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(book)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(book._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </Section>
  );
}

