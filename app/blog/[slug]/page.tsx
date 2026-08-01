import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Calendar, Share2, Tag, ChevronRight, BookOpen } from 'lucide-react';
import { blogPosts } from '@/data/blogs';

interface BlogDetailPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = blogPosts
    .filter((p) => p.id !== post.id && (p.category === post.category || p.tags.some((t) => post.tags.includes(t))))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#fcfaf7] pb-24">
      {/* Top Header Breadcrumb */}
      <div className="bg-[#FAEAD9]/60 border-b border-[#e7dccb]/70 py-6">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#B57A20] hover:text-[#8e5c12] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Journal</span>
          </Link>
        </div>
      </div>

      <article className="mx-auto max-w-4xl px-4 sm:px-6 pt-10 space-y-10">
        {/* Article Meta Header */}
        <header className="space-y-6 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <span className="rounded-full bg-[#B57A20] px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-white shadow-sm">
              {post.category}
            </span>
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-wider">
              <Calendar className="h-3.5 w-3.5" />
              <span>{post.publishedAt}</span>
              <span>•</span>
              <Clock className="h-3.5 w-3.5" />
              <span>{post.readTime}</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#131213] tracking-tight leading-tight uppercase">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 font-medium leading-relaxed">
            {post.subtitle}
          </p>

          {/* Author Bar */}
          <div className="pt-6 border-t border-[#e7dccb] flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-[#B57A20]">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-extrabold text-[#131213]">{post.author.name}</p>
                <p className="text-xs text-neutral-500">{post.author.role}</p>
              </div>
            </div>

            {/* Share / Tags */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider mr-1">Share:</span>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    navigator.clipboard?.writeText(window.location.href);
                    alert('Article link copied to clipboard!');
                  }
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-neutral-200 text-neutral-700 hover:border-[#B57A20] hover:text-[#B57A20] shadow-sm transition-colors"
                aria-label="Share article"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Featured Cover Image */}
        <div className="relative h-[320px] sm:h-[480px] w-full overflow-hidden rounded-3xl border border-[#e7dccb] shadow-2xl bg-neutral-900">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            className="object-cover object-center"
          />
        </div>

        {/* Article Body Content */}
        <div
          className="prose prose-lg max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-[#131213] prose-p:text-neutral-700 prose-p:leading-relaxed prose-a:text-[#B57A20] prose-[#B57A20] pt-4"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        <div className="pt-8 border-t border-[#e7dccb] flex items-center gap-3 flex-wrap">
          <Tag className="h-4 w-4 text-[#B57A20]" />
          <span className="text-xs font-extrabold text-neutral-500 uppercase tracking-wider">Tags:</span>
          {post.tags.map((t) => (
            <span
              key={t}
              className="rounded-lg bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-700 border border-neutral-200"
            >
              #{t}
            </span>
          ))}
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="pt-12 border-t border-[#e7dccb] space-y-6">
            <h3 className="text-xl font-black text-[#131213] uppercase tracking-wider">
              Related Journal Stories
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="group rounded-2xl bg-white border border-[#e7dccb]/70 p-4 shadow-sm hover:shadow-md transition-all space-y-3 block"
                >
                  <div className="relative h-36 w-full rounded-xl overflow-hidden bg-neutral-100">
                    <Image
                      src={rel.coverImage}
                      alt={rel.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <span className="text-[10px] font-extrabold text-[#B57A20] uppercase tracking-wider">
                    {rel.category}
                  </span>
                  <h4 className="text-sm font-bold text-[#131213] group-hover:text-[#B57A20] transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
