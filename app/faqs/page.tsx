'use client';

import * as React from 'react';
import { Search, ChevronDown, HelpCircle, MessageSquare, Mail, Phone, Sparkles, ShieldCheck, Truck, RotateCcw, Shirt } from 'lucide-react';
import { faqCategories, faqItems, FAQItem } from '@/data/faqs';

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [openFaqId, setOpenFaqId] = React.useState<string | null>('faq-1');

  const filteredFaqs = React.useMemo(() => {
    return faqItems.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case 'orders':
        return <ShieldCheck className="h-4 w-4" />;
      case 'shipping':
        return <Truck className="h-4 w-4" />;
      case 'returns':
        return <RotateCcw className="h-4 w-4" />;
      case 'products':
        return <Shirt className="h-4 w-4" />;
      case 'support':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <HelpCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf7] pb-24">
      {/* ─── Hero Banner Section ────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#FAEAD9]/60 border-b border-[#e7dccb]/70 py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(#B57A20_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#B57A20]/30 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#B57A20] shadow-sm backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-[#B57A20]" />
            <span>Modern Traders Help Center</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#131213] tracking-tight uppercase">
            How Can We <span className="text-[#B57A20]">Help You?</span>
          </h1>

          <p className="mx-auto max-w-xl text-sm sm:text-base text-neutral-600 leading-relaxed">
            Find instant answers regarding order tracking, nationwide shipping, returns, payment options, and garment sizing.
          </p>

          {/* Search Input */}
          <div className="mx-auto max-w-xl pt-2">
            <div className="relative flex items-center shadow-lg rounded-2xl overflow-hidden border border-[#e7dccb] bg-white">
              <Search className="absolute left-4 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search questions e.g. shipping time, cash on delivery, size guide..."
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
      <main className="mx-auto max-w-5xl px-4 sm:px-6 pt-12 space-y-12">
        
        {/* Category Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {faqCategories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl text-xs font-bold transition-all duration-300 gap-2 border text-center ${
                  isActive
                    ? 'bg-[#B57A20] text-white border-[#B57A20] shadow-md shadow-[#B57A20]/20 scale-105'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:border-[#B57A20] hover:text-[#B57A20]'
                }`}
              >
                {getCategoryIcon(cat.id)}
                <span className="leading-tight">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Accordions Section */}
        <section className="space-y-4">
          <div className="flex justify-between items-center border-b border-[#e7dccb]/80 pb-4">
            <h2 className="text-xl font-extrabold text-[#131213] uppercase tracking-wider">
              {selectedCategory === 'all'
                ? 'Frequently Asked Questions'
                : faqCategories.find((c) => c.id === selectedCategory)?.label}
            </h2>
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              {filteredFaqs.length} {filteredFaqs.length === 1 ? 'Question' : 'Questions'}
            </span>
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="text-center py-16 space-y-4 rounded-3xl bg-white border border-dashed border-neutral-300 p-8">
              <HelpCircle className="h-12 w-12 text-neutral-300 mx-auto" />
              <h3 className="text-lg font-bold text-[#131213]">No matching questions found</h3>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                We couldn't find any questions matching your search term. Feel free to contact our live support team directly!
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="mt-2 rounded-xl bg-[#B57A20] px-6 py-2.5 text-xs font-bold text-white uppercase tracking-wider shadow-md hover:bg-[#8e5c12] transition-colors"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isOpen
                        ? 'bg-white border-[#B57A20] shadow-md'
                        : 'bg-white/90 border-[#e7dccb]/80 hover:border-[#B57A20]/50'
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full flex items-center justify-between p-5 text-left gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FAEAD9] text-[#B57A20] text-xs font-black">
                          Q
                        </span>
                        <span className="text-sm sm:text-base font-extrabold text-[#131213]">
                          {faq.question}
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-neutral-400 shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-[#B57A20]' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 bg-[#fcfaf7]/50">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ─── Contact Support Box ────────────────────────────────────────── */}
        <section className="rounded-3xl bg-white border border-[#e7dccb] p-8 sm:p-12 shadow-xl space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-extrabold text-[#B57A20] uppercase tracking-widest">
              Still Need Help?
            </span>
            <h3 className="text-2xl font-black text-[#131213] uppercase tracking-tight">
              We're Here For You
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500">
              Our dedicated customer concierge team is available to assist with sizing, order customization, and delivery updates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* WhatsApp */}
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center text-center p-6 rounded-2xl bg-[#FAEAD9]/40 border border-[#e7dccb] hover:border-[#B57A20] hover:bg-white transition-all shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B57A20] text-white shadow-md group-hover:scale-110 transition-transform mb-3">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-extrabold text-[#131213] uppercase">Instant WhatsApp Chat</h4>
              <p className="text-xs text-neutral-500 mt-1">Available 24/7 for instant replies</p>
              <span className="mt-3 text-xs font-bold text-[#B57A20] group-hover:underline">
                +92 300 1234567
              </span>
            </a>

            {/* Email Support */}
            <a
              href="mailto:support@moderntraders.com"
              className="group flex flex-col items-center text-center p-6 rounded-2xl bg-[#FAEAD9]/40 border border-[#e7dccb] hover:border-[#B57A20] hover:bg-white transition-all shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#131213] text-white shadow-md group-hover:scale-110 transition-transform mb-3">
                <Mail className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-extrabold text-[#131213] uppercase">Email Support</h4>
              <p className="text-xs text-neutral-500 mt-1">Response within 2 business hours</p>
              <span className="mt-3 text-xs font-bold text-[#B57A20] group-hover:underline">
                support@moderntraders.com
              </span>
            </a>

            {/* Helpline */}
            <a
              href="tel:+923001234567"
              className="group flex flex-col items-center text-center p-6 rounded-2xl bg-[#FAEAD9]/40 border border-[#e7dccb] hover:border-[#B57A20] hover:bg-white transition-all shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B57A20] text-white shadow-md group-hover:scale-110 transition-transform mb-3">
                <Phone className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-extrabold text-[#131213] uppercase">Phone Helpline</h4>
              <p className="text-xs text-neutral-500 mt-1">Mon - Sat: 9:00 AM - 8:00 PM</p>
              <span className="mt-3 text-xs font-bold text-[#B57A20] group-hover:underline">
                UAN: (042) 111-222-333
              </span>
            </a>
          </div>
        </section>

      </main>
    </div>
  );
}
