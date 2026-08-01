export interface FAQItem {
  id: string;
  category: 'orders' | 'shipping' | 'returns' | 'products' | 'support';
  categoryLabel: string;
  question: string;
  answer: string;
}

export const faqCategories = [
  { id: 'all', label: 'All Questions' },
  { id: 'orders', label: 'Orders & Payment' },
  { id: 'shipping', label: 'Shipping & Delivery' },
  { id: 'returns', label: 'Returns & Exchange' },
  { id: 'products', label: 'Sizing & Fabric Care' },
  { id: 'support', label: 'Support & Wholesale' },
];

export const faqItems: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'orders',
    categoryLabel: 'Orders & Payment',
    question: 'What payment methods do you accept?',
    answer: 'We accept Cash on Delivery (COD), Major Credit/Debit Cards (Visa, MasterCard, UnionPay), and Direct Bank Wire Transfers. All online card transactions are processed securely through 256-bit encrypted payment gateways.',
  },
  {
    id: 'faq-2',
    category: 'orders',
    categoryLabel: 'Orders & Payment',
    question: 'How do I know if my order was successfully placed?',
    answer: 'Once your order is submitted, you will immediately receive an automated confirmation email and SMS containing your unique Order ID and summary. You can also track your live order status anytime in your Account Dashboard.',
  },
  {
    id: 'faq-3',
    category: 'orders',
    categoryLabel: 'Orders & Payment',
    question: 'Can I modify or cancel my order after placing it?',
    answer: 'Orders can be modified or cancelled within 2 hours of placement by reaching out to our customer support team via WhatsApp or email. Once an order enters processing or dispatch, changes may no longer be possible.',
  },
  {
    id: 'faq-4',
    category: 'shipping',
    categoryLabel: 'Shipping & Delivery',
    question: 'What are your delivery timelines and shipping charges?',
    answer: 'We offer FREE Nationwide Delivery on all orders over Rs. 3,000. Standard delivery takes 2 to 4 business days nationwide. Expedited 24-48 hour delivery is available in major metropolitan cities for a nominal fee.',
  },
  {
    id: 'faq-5',
    category: 'shipping',
    categoryLabel: 'Shipping & Delivery',
    question: 'Do you offer international worldwide shipping?',
    answer: 'Yes! We ship globally to over 50 countries via DHL Express and FedEx International. Shipping fees and estimated customs clearance times are automatically calculated at checkout based on your destination.',
  },
  {
    id: 'faq-6',
    category: 'shipping',
    categoryLabel: 'Shipping & Delivery',
    question: 'How can I track my shipment parcel?',
    answer: 'As soon as your package is dispatched, we send a tracking link with your courier tracking number via SMS and email. You can also enter your order ID on our order tracking page.',
  },
  {
    id: 'faq-7',
    category: 'returns',
    categoryLabel: 'Returns & Exchange',
    question: 'What is your Return and Exchange Policy?',
    answer: 'We offer a hassle-free 7-Day Exchange Policy for unused items in original condition with tags intact. If you receive a damaged or incorrect item, we provide free pickup and replacement at no extra cost.',
  },
  {
    id: 'faq-8',
    category: 'returns',
    categoryLabel: 'Returns & Exchange',
    question: 'How long does a refund or store credit take to process?',
    answer: 'Once returned items pass quality inspection at our fulfillment center, refunds are issued back to your original payment method or as store credit within 3 to 5 business days.',
  },
  {
    id: 'faq-9',
    category: 'products',
    categoryLabel: 'Sizing & Fabric Care',
    question: 'How do I choose the correct size for Pret outfits?',
    answer: 'Each product page features a detailed Size Guide with precise chest, waist, shoulder, and length measurements in inches. If you are between sizes, we recommend sizing up for a relaxed luxury fit.',
  },
  {
    id: 'faq-10',
    category: 'products',
    categoryLabel: 'Sizing & Fabric Care',
    question: 'Are unstitched fabrics guaranteed colorfast and shrink-resistant?',
    answer: 'Yes, all our luxury unstitched fabrics undergo rigorous colorfastness and pre-wash testing. However, we advise pre-soaking unstitched cotton in cold water before tailoring for optimum durability.',
  },
  {
    id: 'faq-11',
    category: 'support',
    categoryLabel: 'Support & Wholesale',
    question: 'How can I contact your Customer Support team?',
    answer: 'Our customer care team is available Monday to Saturday, 9am - 8pm PKT. You can reach us via instant WhatsApp chat (+92 300 1234567), email at support@moderntraders.com, or through our direct hotline.',
  },
  {
    id: 'faq-12',
    category: 'support',
    categoryLabel: 'Support & Wholesale',
    question: 'Do you accept corporate gifting and bulk wholesale inquiries?',
    answer: 'Yes! We specialize in custom corporate luxury packages and wholesale collections. Please contact corporate@moderntraders.com for custom branding, bulk discount structures, and catalog requests.',
  },
];
