'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import SocialShare from '@/components/ui/SocialShare';
import RelatedContent from '@/components/ui/RelatedContent';
import { motion } from 'framer-motion';
import Spinner from '@/components/ui/Spinner';
import toast from 'react-hot-toast';

export default function BookDetailPage() {
  const params = useParams();
  const bookId = params.id;
  
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  
  const [reviewForm, setReviewForm] = useState({
    userName: '',
    userEmail: '',
    rating: 5,
    review: '',
  });

  useEffect(() => {
    if (bookId) {
      fetchBook();
    }
  }, [bookId]);

  const fetchBook = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/books/${bookId}`);
      const data = await response.json();

      if (data.success) {
        setBook(data.book);
        setReviews(data.reviews || []);
      } else {
        toast.error('Book not found');
      }
    } catch (error) {
      console.error('Error fetching book:', error);
      toast.error('Failed to load book');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!reviewForm.userName || !reviewForm.userEmail || !reviewForm.review) {
      toast.error('Please fill in all fields');
      return;
    }

    setSubmittingReview(true);
    try {
      const response = await fetch(`/api/books/${bookId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewForm),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Review submitted successfully!');
        setReviewForm({ userName: '', userEmail: '', rating: 5, review: '' });
        fetchBook(); // Refresh to get updated reviews and rating
      } else {
        toast.error(data.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <Section className="pt-24 pb-16">
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      </Section>
    );
  }

  if (!book) {
    return (
      <Section className="pt-24 pb-16">
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Book not found</p>
        </div>
      </Section>
    );
  }

  const ratingStars = Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < Math.floor(book.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300'}>
      ★
    </span>
  ));

  return (
    <Section className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto">
        {/* Book Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {book.coverImage && (
            <div className="mb-6 aspect-[3/4] max-w-xs mx-auto overflow-hidden rounded-lg bg-muted">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="text-center mb-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{book.title}</h1>
            <p className="text-xl text-muted-foreground mb-2">By {book.author}</p>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {ratingStars}
              </div>
              <span className="text-muted-foreground">
                {book.averageRating > 0 ? book.averageRating.toFixed(1) : 'No ratings'} 
                {book.reviewCount > 0 && ` (${book.reviewCount} reviews)`}
              </span>
            </div>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
              <span>{book.views || 0} views</span>
              <span>•</span>
              <span>{book.category}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-muted-foreground">Share:</span>
              <SocialShare
                url={`/books/${bookId}`}
                title={`${book.title} by ${book.author}`}
                description={book.description}
                contentType="book"
                contentId={book._id?.toString() || bookId}
                image={book.coverImage}
                variant="horizontal"
                size="md"
              />
            </div>
          </div>
        </motion.div>

        {/* Book Description */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold mb-4">About This Book</h2>
          <p className="text-foreground whitespace-pre-line">{book.description}</p>
        </Card>

        {/* Book Content */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Book Content</h2>
          {book.fileType === 'pdf' && book.pdfUrl ? (
            <div className="w-full">
              <iframe
                src={book.pdfUrl}
                className="w-full h-[800px] border border-border rounded-lg"
                title={book.title}
              />
              <div className="mt-4 text-center">
                <a
                  href={book.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-background rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </a>
              </div>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-line text-foreground leading-relaxed">
                {book.content || 'No content available.'}
              </div>
            </div>
          )}
        </Card>

        {/* Reviews Section */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold mb-6">
            Reviews ({reviews.length})
          </h2>

          {/* Review Form */}
          <form onSubmit={handleSubmitReview} className="mb-8 p-4 bg-muted rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Your Name"
                  value={reviewForm.userName}
                  onChange={(e) => setReviewForm({ ...reviewForm, userName: e.target.value })}
                  required
                />
                <Input
                  label="Your Email"
                  type="email"
                  value={reviewForm.userEmail}
                  onChange={(e) => setReviewForm({ ...reviewForm, userEmail: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating })}
                      className={`text-2xl transition-all ${
                        rating <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'
                      } hover:text-yellow-400`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              
              <Textarea
                label="Your Review"
                value={reviewForm.review}
                onChange={(e) => setReviewForm({ ...reviewForm, review: e.target.value })}
                rows={4}
                required
              />
              
              <Button type="submit" variant="primary" disabled={submittingReview}>
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </Button>
            </div>
          </form>

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No reviews yet. Be the first to review this book!
            </p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border-b border-border pb-6 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{review.userName}</h4>
                      <p className="text-sm text-muted-foreground">{review.userEmail}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span
                          key={i}
                          className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-foreground whitespace-pre-line">{review.review}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Related Content */}
        {book && <RelatedContent contentType="book" contentId={bookId} />}
      </div>
    </Section>
  );
}

