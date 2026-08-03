import * as React from 'react';
import Link from 'next/link';
import { Star, MessageSquare, ArrowRight, ShieldCheck, ThumbsUp } from 'lucide-react';
import { getAllReviews } from '@/lib/api';
import { Rating } from '@/components/ui/Rating';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Customer Reviews & Feedback | Antigravity Store',
  description: 'Read genuine verified customer reviews and ratings for products in our store.',
};

export default async function ReviewsPage() {
  const reviews = await getAllReviews();

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
      : 5.0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10 animate-fade-in">
      
      {/* ─── Header Banner (Light Luxury Theme) ─── */}
      <div className="rounded-3xl bg-white border border-[#e7dccb] p-6 sm:p-10 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF6F0] text-[#B57A20] text-xs font-extrabold uppercase tracking-wider border border-[#e7dccb]">
            <Star className="h-3.5 w-3.5 fill-[#B57A20]" />
            <span>Verified Customer Reviews</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#131213]">
            What Our Customers Say
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
            Real feedback and ratings submitted directly by purchasers across all products in our store.
          </p>
        </div>

        {/* Store Overall Rating Stats Badge */}
        <div className="flex items-center gap-4 bg-[#FAF6F0] border border-[#e7dccb] p-4 sm:p-5 rounded-2xl shrink-0">
          <div className="text-center pr-4 border-r border-[#e7dccb]">
            <span className="text-3xl sm:text-4xl font-black text-[#131213]">{averageRating.toFixed(1)}</span>
            <p className="text-[10px] font-bold text-[#B57A20] uppercase tracking-widest mt-0.5">
              Store Rating
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={`hero-star-${i}`} className="h-4.5 w-4.5 fill-current" />
              ))}
            </div>
            <p className="text-xs text-neutral-600 font-semibold">
              Based on <span className="font-extrabold text-[#131213]">{totalReviews}</span> verified review(s)
            </p>
          </div>
        </div>
      </div>

      {/* ─── Reviews Grid / Empty State ─── */}
      {totalReviews === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 px-4 rounded-3xl border-2 border-dashed border-neutral-200 bg-white space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-neutral-100 text-neutral-400">
            <MessageSquare className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-neutral-900">No Customer Reviews Yet</h3>
            <p className="text-sm text-neutral-500 max-w-md leading-relaxed">
              We haven't received any customer reviews yet. Be the first to purchase a product and submit your feedback!
            </p>
          </div>
          <Link href="/products">
            <Button variant="primary" className="gap-2 px-6 shadow-glow">
              <span>Browse Catalog &amp; Write Review</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-2xl border border-neutral-150 bg-white p-6 shadow-sm hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#B57A20] text-white font-extrabold text-base shadow-sm shrink-0 uppercase">
                      {rev.author ? rev.author.trim().charAt(0) : 'U'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900">{rev.author}</h4>
                      {rev.verified && (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase text-emerald-700 tracking-wide mt-0.5">
                          Verified Buyer
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-neutral-400 font-semibold">{rev.date}</span>
                </div>

                <div className="pt-1">
                  <Rating rating={rev.rating} size="sm" />
                </div>

                <h3 className="text-base font-bold text-neutral-900">{rev.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{rev.body}</p>
              </div>

              {rev.productId && (
                <div className="pt-3 border-t border-neutral-100 flex justify-between items-center">
                  <span className="text-xs font-semibold text-neutral-400">Purchased Item</span>
                  <Link
                    href={`/products`}
                    className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                  >
                    <span>View Product</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
