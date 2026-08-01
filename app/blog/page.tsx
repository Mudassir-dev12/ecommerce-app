'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Clock, User, ArrowRight, Sparkles, BookOpen, ChevronRight } from 'lucide-react';
import { blogPosts, BlogPost } from '@/data/blogs';

const categories = [
  'All',
  'Style Guide',
  'Fabric Care',
  'Luxury Fragrances',
  'Fashion Trends',
  'Craftsmanship',
];

export default function BlogListingPage() {
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredPosts = React.useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesCategory =
        selectedCategory === 'All' || post.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const featuredPost = blogPosts.find((p) => p.featured) || blogPosts[0];

  return (
    <div className="min-h-screen bg-[#fcfaf7] pb-24">
      {/* ─── Hero Banner Section ────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#FAEAD9]/60 border-b border-[#e7dccb]/70 py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(#B57A20_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#B57A20]/30 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#B57A20] shadow-sm backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-[#B57A20]" />
            <span>Modern Traders Journal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#131213] tracking-tight uppercase">
            Stories, Style &amp; <span className="text-[#B57A20]">Craftsmanship</span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-base text-neutral-600 leading-relaxed">
            Explore curated fashion guides, textile maintenance, signature scent reviews, and exclusive behind-the-craft stories from our artisan ateliers.
          </p>

          {/* Search Bar */}
          <div className="mx-auto max-w-xl pt-4">
            <div className="relative flex items-center shadow-lg rounded-2xl overflow-hidden border border-[#e7dccb] bg-white">
              <Search className="absolute left-4 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search articles, trends, fabric care..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent py-4 pl-12 pr-4 text-sm font-medium text-[#131213] placeholder-neutral-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="pr-4 text-xs font-bold text-neutral-400 hover:text-neutral-700"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Main Content Container ──────────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        
        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 no-scrollbar justify-start sm:justify-center">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? 'bg-[#B57A20] text-white shadow-md shadow-[#B57A20]/20 scale-105'
                    : 'bg-white text-neutral-700 border border-neutral-200 hover:border-[#B57A20] hover:text-[#B57A20]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Featured Article Card (Shown when viewing 'All' and no search query) */}
        {selectedCategory === 'All' && !searchQuery && featuredPost && (
          <section className="relative overflow-hidden rounded-3xl bg-white border border-[#e7dccb] shadow-xl transition-all hover:shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              {/* Featured Image */}
              <div className="relative h-[280px] sm:h-[400px] lg:h-[480px] lg:col-span-7 w-full overflow-hidden bg-neutral-900">
                <Image
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  fill
                  priority
                  className="object-cover object-center transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="rounded-full bg-[#B57A20] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md">
                    Featured Story
                  </span>
                </div>
              </div>

              {/* Featured Content */}
              <div className="p-8 sm:p-12 lg:col-span-5 space-y-6 flex flex-col justify-center">
                <div className="flex items-center gap-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  <span className="text-[#B57A20]">{featuredPost.category}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-neutral-400" />
                    <span>{featuredPost.readTime}</span>
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-[#131213] tracking-tight leading-tight">
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="hover:text-[#B57A20] transition-colors"
                  >
                    {featuredPost.title}
                  </Link>
                </h2>

                <p className="text-sm text-neutral-600 leading-relaxed line-clamp-3">
                  {featuredPost.excerpt}
                </p>

                {/* Author Info */}
                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden border border-[#e7dccb]">
                      <Image
                        src={featuredPost.author.avatar}
                        alt={featuredPost.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#131213]">{featuredPost.author.name}</p>
                      <p className="text-[11px] text-neutral-400">{featuredPost.author.role}</p>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="group inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#B57A20] hover:text-[#8e5c12] transition-colors"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ─── Articles Grid ────────────────────────────────────────────── */}
        <section className="space-y-8">
          <div className="flex justify-between items-baseline border-b border-[#e7dccb]/70 pb-4">
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#131213] uppercase tracking-wider">
              {selectedCategory === 'All' ? 'Latest Articles' : `${selectedCategory} Articles`}
            </h3>
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'Post' : 'Posts'}
            </span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 space-y-4 rounded-3xl bg-white border border-dashed border-neutral-300 p-8">
              <BookOpen className="h-12 w-12 text-neutral-300 mx-auto" />
              <h4 className="text-lg font-bold text-[#131213]">No articles found</h4>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                We couldn't find any articles matching your search query. Try clearing your filters or search terms.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="mt-2 rounded-xl bg-[#B57A20] px-6 py-2.5 text-xs font-bold text-white uppercase tracking-wider shadow-md hover:bg-[#8e5c12] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="group flex flex-col rounded-3xl bg-white border border-[#e7dccb]/80 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Post Image */}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="relative h-56 w-full overflow-hidden bg-neutral-100 block"
                  >
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#B57A20] shadow-sm">
                        {post.category}
                      </span>
                    </div>
                  </Link>

                  {/* Post Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                        <span>{post.publishedAt}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-extrabold text-[#131213] tracking-tight group-hover:text-[#B57A20] transition-colors line-clamp-2">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>

                      <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Post Footer */}
                    <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="relative h-7 w-7 rounded-full overflow-hidden border border-neutral-200">
                          <Image
                            src={post.author.avatar}
                            alt={post.author.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-xs font-bold text-neutral-700">{post.author.name}</span>
                      </div>

                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-neutral-100 text-neutral-700 group-hover:bg-[#B57A20] group-hover:text-white transition-colors"
                        aria-label={`Read ${post.title}`}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* ─── Newsletter Card Section ────────────────────────────────────── */}
        <section className="rounded-3xl bg-gradient-to-r from-[#131213] to-[#2a241e] p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
            <Sparkles className="h-96 w-96 text-[#B57A20]" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-6 text-center sm:text-left">
            <span className="inline-block rounded-full bg-[#B57A20]/30 px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-[#B57A20] border border-[#B57A20]/40">
              Exclusive Style Edits
            </span>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white uppercase">
              Stay Inspired With Private Journal Drops
            </h2>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Subscribe to receive weekly fashion forecasts, fabric maintenance guides, and VIP invitations to private seasonal collection drops.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you for subscribing to Modern Traders Journal!');
              }}
              className="flex flex-col sm:flex-row gap-3 pt-2 max-w-md"
            >
              <input
                type="email"
                required
                placeholder="Enter your email address"
                className="flex-1 rounded-xl bg-white/10 px-4 py-3.5 text-xs text-white placeholder-neutral-400 border border-white/20 focus:outline-none focus:border-[#B57A20]"
              />
              <button
                type="submit"
                className="rounded-xl bg-[#B57A20] px-6 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg hover:bg-[#8e5c12] transition-colors shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>

      </main>
    </div>
  );
}
