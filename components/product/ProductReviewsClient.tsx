'use client';

import * as React from 'react';
import { Star, MessageSquare, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import type { Review } from '@/types';
import { getReviewsByProductId, createReview } from '@/lib/api';
import { Rating } from '@/components/ui/Rating';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

interface ProductReviewsClientProps {
  productId: string;
  initialReviews: Review[];
  initialRating: number;
  initialReviewCount: number;
}

export function ProductReviewsClient({
  productId,
  initialReviews,
  initialRating,
  initialReviewCount,
}: ProductReviewsClientProps) {
  const { toast } = useToast();
  const [reviews, setReviews] = React.useState<Review[]>(initialReviews);
  const [showForm, setShowForm] = React.useState(false);

  // Form State
  const [author, setAuthor] = React.useState('');
  const [rating, setRating] = React.useState(5);
  const [title, setTitle] = React.useState('');
  const [body, setBody] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Fetch updated reviews
  const loadReviews = React.useCallback(async () => {
    try {
      const data = await getReviewsByProductId(productId);
      setReviews(data);
    } catch (e) {}
  }, [productId]);

  React.useEffect(() => {
    loadReviews();

    const handleSubmitted = () => {
      loadReviews();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('review-submitted', handleSubmitted);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('review-submitted', handleSubmitted);
      }
    };
  }, [loadReviews]);

  // Derived rating calculation
  const currentReviewCount = reviews.length;
  const currentRating =
    currentReviewCount > 0
      ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / currentReviewCount).toFixed(1))
      : initialRating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast('Please fill out all review fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const newReview = await createReview({
        productId,
        author: author.trim() || 'Verified Customer',
        rating,
        title: title.trim(),
        body: body.trim(),
      });

      setReviews((prev) => [newReview, ...prev.filter((r) => r.id !== newReview.id)]);
      toast('Thank you! Your review has been published.', 'success');
      
      // Reset form
      setAuthor('');
      setTitle('');
      setBody('');
      setRating(5);
      setShowForm(false);
    } catch (err) {
      toast('Failed to submit review. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="border-t border-neutral-150 pt-12 space-y-8 animate-fade-in">
      {/* Header & Write Review Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-neutral-900 tracking-tight">Customer Reviews</h3>
          <p className="text-xs text-neutral-500 mt-1">Real feedback from verified store purchasers</p>
        </div>

        <Button
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? 'outline' : 'primary'}
          className="gap-2 shrink-0 font-bold shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>{showForm ? 'Close Form' : 'Write a Review'}</span>
        </Button>
      </div>

      {/* Interactive Write Review Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-primary-200 bg-white p-6 sm:p-8 space-y-5 shadow-card animate-slide-up"
        >
          <h4 className="text-lg font-extrabold text-neutral-900">Write a Customer Review</h4>

          {/* Rating selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
              Your Rating
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={`star-btn-${star}`}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-amber-400 hover:scale-125 transition-transform focus:outline-none"
                >
                  <Star className="h-6 w-6" fill={star <= rating ? 'currentColor' : 'none'} />
                </button>
              ))}
              <span className="text-xs font-bold text-neutral-500 ml-2">{rating} out of 5 Stars</span>
            </div>
          </div>

          {/* Author Name & Review Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Mudassir / Verified Buyer"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm font-semibold text-neutral-900 focus:border-primary-500 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Review Headline / Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Exceptional Quality & Excellent Packaging!"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm font-semibold text-neutral-900 focus:border-primary-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Review Body */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
              Review Details
            </label>
            <textarea
              required
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Tell others what you loved about this product..."
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm font-semibold text-neutral-900 focus:border-primary-500 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Submit CTA */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowForm(false)}
              className="px-5 font-bold"
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting} className="px-6 font-bold shadow-glow">
              {isSubmitting ? 'Publishing...' : 'Submit Review'}
            </Button>
          </div>
        </form>
      )}

      {/* Reviews List or Empty State */}
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-12 px-4 rounded-2xl border-2 border-dashed border-neutral-200 bg-white/60 space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
            <MessageSquare className="h-6 w-6" />
          </div>
          <h4 className="text-base font-bold text-neutral-900">No reviews yet for this product</h4>
          <p className="text-xs text-neutral-500 max-w-sm">
            Be the first customer to share your thoughts and write a review!
          </p>
        </div>
      ) : (
        <div className="divide-y divide-neutral-150 border-t border-neutral-100 bg-white rounded-2xl p-6 shadow-sm">
          {reviews.map((rev) => (
            <div key={rev.id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-6 items-start">
              {/* Author Avatar & Info */}
              <div className="flex items-center sm:flex-col sm:items-start gap-3 w-full sm:w-44 shrink-0">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#B57A20] text-white font-extrabold text-sm sm:text-base shadow-sm shrink-0 uppercase">
                  {rev.author ? rev.author.trim().charAt(0) : 'U'}
                </div>
                <div>
                  <h5 className="text-sm font-bold text-neutral-900 truncate w-32">{rev.author}</h5>
                  {rev.verified && (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700 tracking-wide mt-1">
                      Verified Buyer
                    </span>
                  )}
                </div>
              </div>

              {/* Review Content */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <Rating rating={rev.rating} size="sm" />
                  <span className="text-xs text-neutral-400">{rev.date}</span>
                </div>
                <h4 className="text-base font-bold text-neutral-900">{rev.title}</h4>
                <p className="text-sm text-neutral-600 leading-relaxed">{rev.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
