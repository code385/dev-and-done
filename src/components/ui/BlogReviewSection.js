'use client';

import { useState, useEffect } from 'react';
import Card from './Card';
import Button from './Button';
import Input from './Input';
import Textarea from './Textarea';
import toast from 'react-hot-toast';

export default function BlogReviewSection({ blogSlug, initialReviews = [] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    userName: '',
    userEmail: '',
    rating: 5,
    review: '',
  });

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/blogs/${blogSlug}/reviews`);
      const data = await response.json();
      if (data.success) {
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
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
      const response = await fetch(`/api/blogs/${blogSlug}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewForm),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Review submitted successfully!');
        setReviewForm({ userName: '', userEmail: '', rating: 5, review: '' });
        fetchReviews(); // Refresh to get updated reviews
        // Reload the page to get updated rating
        window.location.reload();
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

  useEffect(() => {
    fetchReviews();
  }, [blogSlug]);

  return (
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
          No reviews yet. Be the first to review this blog!
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
                {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

