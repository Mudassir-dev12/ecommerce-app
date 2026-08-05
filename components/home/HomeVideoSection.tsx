'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface VideoCampaign {
  id: string;
  videoUrl: string;
  title: string;
  views: string;
  likes: string;
}

const CAMPAIGNS: VideoCampaign[] = [
  {
    id: 'camp-1',
    videoUrl: '/v1.mp4',
    title: 'Luxury Pret Collection Campaign 2026',
    views: '145.2k',
    likes: '9.8k',
  },
  {
    id: 'camp-2',
    videoUrl: '/v2.mp4',
    title: 'Exclusive Unstitched Silk Runway Highlights',
    views: '98.6k',
    likes: '6.4k',
  },
  {
    id: 'camp-3',
    videoUrl: '/v3.mp4',
    title: 'Behind the Scenes: Festive Editorial Shoot',
    views: '184.9k',
    likes: '12.3k',
  },
  {
    id: 'camp-4',
    videoUrl: '/v4.mp4',
    title: 'Signature Chiffon Festive Edition Launch',
    views: '210.3k',
    likes: '18.2k',
  },
];

export function HomeVideoSection() {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);
  
  // Double the campaigns to make a seamless infinite horizontal loop
  const doubledCampaigns = React.useMemo(() => [...CAMPAIGNS, ...CAMPAIGNS], []);

  return (
    <section className="bg-transparent py-16 overflow-hidden select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center space-y-2 mb-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#B57A20]">
            Campaign Reels
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 uppercase tracking-wider">
            Our collections
          </h2>
          <div className="h-0.5 w-16 rounded-full bg-gradient-to-r from-[#B57A20] via-neutral-300 to-transparent" />
        </div>

        {/* Carousel Ticker Viewport */}
        <div className="relative w-full overflow-hidden py-4">
          <div
            className="animate-ticker gap-6"
            style={{
              animationPlayState: hoveredId !== null ? 'paused' : 'running',
            }}
          >
            {doubledCampaigns.map((camp, idx) => (
              <VideoCard
                key={`${camp.id}-${idx}`}
                campaign={camp}
                hoveredId={hoveredId}
                setHoveredId={setHoveredId}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

interface VideoCardProps {
  campaign: VideoCampaign;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
}

function VideoCard({ campaign, hoveredId, setHoveredId }: VideoCardProps) {
  const isAnyHovered = hoveredId !== null;
  const isSelfHovered = hoveredId === campaign.id;

  return (
    <div
      onMouseEnter={() => setHoveredId(campaign.id)}
      onMouseLeave={() => setHoveredId(null)}
      className="flex flex-col w-[280px] sm:w-[380px] shrink-0 transition-all duration-500 cursor-pointer"
    >
      {/* Video Container (Aspect-video, no border, no play icon overlay) */}
      <div
        className={cn(
          'relative aspect-video w-full overflow-hidden rounded-2xl bg-neutral-100 transition-all duration-500',
          isAnyHovered && !isSelfHovered ? 'blur-[3.5px] scale-[0.97] opacity-50' : 'blur-0 scale-100 opacity-100',
          isSelfHovered && 'scale-[1.02] shadow-lg'
        )}
      >
        <video
          src={campaign.videoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      {/* Campaign Info */}
      <div
        className={cn(
          'mt-3.5 transition-all duration-500',
          isAnyHovered && !isSelfHovered ? 'blur-[1px] opacity-50' : 'opacity-100'
        )}
      >
        <h3 className="text-sm sm:text-base font-bold text-neutral-900 line-clamp-2 leading-snug">
          {campaign.title}
        </h3>
        <p className="mt-1 text-xs text-neutral-500 font-medium">
          {campaign.views} Views • {campaign.likes} Likes
        </p>
      </div>
    </div>
  );
}
