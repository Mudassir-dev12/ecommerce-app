export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  publishedAt: string;
  readTime: string;
  featured?: boolean;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'art-of-layering-autumn-pret-edition',
    title: 'The Art of Layering: Autumn Pret Edition',
    subtitle: 'Mastering seasonal transitions with structured silhouettes and rich textures',
    excerpt: 'Discover how to seamlessly blend rich embroidered textures, delicate organza dupattas, and structured pret silhouettes as the autumn breeze sets in.',
    category: 'Style Guide',
    featured: true,
    publishedAt: 'August 1, 2026',
    readTime: '5 min read',
    coverImage: '/1.jpg',
    author: {
      name: 'Sophia Al-Mansoor',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
      role: 'Head Fashion Editor',
    },
    tags: ['Pret', 'Autumn Fashion', 'Styling Tips', 'Luxury'],
    content: `
      <p>Transitioning into the crisp autumn season requires a subtle dance between light summer fabrics and rich, textured layers. At Modern Traders, our Autumn Pret Collection celebrates this exact harmony through timeless craftsmanship.</p>
      
      <h3>1. Start with a Breathable Foundation</h3>
      <p>The key to comfortable layering is your base tunic. Opt for 100% fine cotton lawn or soft viscose with understated neckline embroidery. This ensures warmth without adding unnecessary bulk.</p>
      
      <h3>2. Elevate with Structured Capes & Wraps</h3>
      <p>A hand-finished shawl or draped cape instantly converts casual daytime pret into elegant evening wear. Deep jewel tones like midnight navy, emerald green, and burnished gold dominate this season's palette.</p>
      
      <h3>3. Accentuate with Statement Accessories</h3>
      <p>Complete your ensemble with hand-tooled leather sandals and minimalist gold jewellery. Let the intricate threadwork of your outfit take center stage while accessories provide subtle highlights.</p>
    `,
  },
  {
    id: 'post-2',
    slug: 'how-to-extend-the-life-of-unstitched-fabrics',
    title: 'How to Extend the Life of Unstitched Fabrics',
    subtitle: 'Essential care guides for silk, lawn, and velvet collections',
    excerpt: 'Expert tips on pre-soaking, tailor shrinking, and gentle washing to preserve vibrant dyes and intricate embroidery for years.',
    category: 'Fabric Care',
    publishedAt: 'July 28, 2026',
    readTime: '4 min read',
    coverImage: '/2.jpg',
    author: {
      name: 'Tariq Mehmood',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
      role: 'Textile Specialist',
    },
    tags: ['Unstitched', 'Fabric Care', 'Maintenance'],
    content: `
      <p>Unstitched luxury collections offer complete freedom in tailoring, but proper care starts long before the first stitch is placed.</p>

      <h3>Pre-Soaking Unstitched Lawn</h3>
      <p>Always pre-soak pure cotton and lawn fabrics in cold water for at least 30 minutes prior to stitching. This prevents unexpected shrinkage after your outfit is tailored.</p>

      <h3>Washing Embroidered Articles</h3>
      <p>Never scrub intricate threadwork or beaded accents directly. Hand-wash inside out using mild liquid detergent, and avoid wringing delicate organza dupattas.</p>
    `,
  },
  {
    id: 'post-3',
    slug: 'choosing-your-signature-fragrance',
    title: "Choosing Your Signature Fragrance: A Perfumer's Guide",
    subtitle: 'Understanding scent families, notes, and skin chemistry',
    excerpt: 'Discover how ambient humidity, skin warmth, and artisanal oil extractions define scent longevity and unique olfactory signatures.',
    category: 'Luxury Fragrances',
    publishedAt: 'July 24, 2026',
    readTime: '6 min read',
    coverImage: '/3.jpg',
    author: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80',
      role: 'Master Perfumer',
    },
    tags: ['Fragrances', 'Perfume Guide', 'Luxury Lifestyle'],
    content: `
      <p>A signature fragrance is more than an accessory—it is an invisible aura that leaves a lasting impression wherever you go.</p>

      <h3>Top, Heart, and Base Notes</h3>
      <p>Top notes provide the initial burst (citrus, bergamot), heart notes unfold over hours (rose, jasmine, spice), and base notes (amber, oud, musk) linger on skin all day.</p>
    `,
  },
  {
    id: 'post-4',
    slug: '2026-sustainable-luxury-fashion-trends',
    title: '2026 Sustainable Luxury Fashion Trends',
    subtitle: 'Ethical sourcing and hand-woven craftsmanship shaping the future',
    excerpt: 'Explore how conscious fashion, zero-waste pattern cutting, and slow artisanal production are redefining luxury retail worldwide.',
    category: 'Fashion Trends',
    publishedAt: 'July 18, 2026',
    readTime: '7 min read',
    coverImage: '/b4.jpg',
    author: {
      name: 'Sophia Al-Mansoor',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
      role: 'Head Fashion Editor',
    },
    tags: ['Sustainability', 'Luxury Fashion', 'Trends 2026'],
    content: `
      <p>Modern luxury is no longer defined solely by price tags—it is judged by ethical craftsmanship, sustainable materials, and enduring design.</p>
    `,
  },
  {
    id: 'post-5',
    slug: 'accessorizing-101-statement-jewels',
    title: 'Accessorizing 101: From Statement Jewels to Minimalist Elegance',
    subtitle: 'Balancing gold accents with contemporary silhouettes',
    excerpt: 'Master the subtle art of matching statement earrings, handcrafted footwear, and structured clutches with formal evening wear.',
    category: 'Style Guide',
    publishedAt: 'July 10, 2026',
    readTime: '4 min read',
    coverImage: '/b5.jpg',
    author: {
      name: 'Amina Zahra',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80',
      role: 'Senior Stylist',
    },
    tags: ['Accessories', 'Jewellery', 'Styling'],
    content: `
      <p>When your outfit features intricate embroidery or vibrant patterns, accessories should complement rather than compete.</p>
    `,
  },
  {
    id: 'post-6',
    slug: 'behind-the-craft-hand-embroidered-collections',
    title: 'Behind the Craft: Hand-Embroidered Luxury Collections',
    subtitle: 'Inside our master artisan studios',
    excerpt: 'An exclusive look into traditional zardozi, hand-beaded embellishments, and hundreds of hours dedicated to every single garment.',
    category: 'Craftsmanship',
    publishedAt: 'June 29, 2026',
    readTime: '8 min read',
    coverImage: '/b6.jpg',
    author: {
      name: 'Tariq Mehmood',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
      role: 'Textile Specialist',
    },
    tags: ['Craftsmanship', 'Artisans', 'Heritage'],
    content: `
      <p>Behind every Modern Traders piece lies generations of heritage artistry passed down through master craftsmen.</p>
    `,
  },
];
