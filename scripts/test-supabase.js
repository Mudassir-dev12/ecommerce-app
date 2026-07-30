const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kghczdhlzymwuytgixyw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnaGN6ZGhsenltd3V5dGdpeHl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzNDE2MzMsImV4cCI6MjEwMDkxNzYzM30.bjzp8L8DtjO218zMKW9a3E0e1siBCGMiSL57WRh7VWY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabase() {
  console.log('--- TESTING SUPABASE SELECT ---');
  const { data: selectData, error: selectErr } = await supabase.from('products').select('*');
  console.log('SELECT result:', { count: selectData ? selectData.length : 0, error: selectErr });

  console.log('\n--- TESTING SUPABASE INSERT ---');
  const testId = `test-prod-${Date.now()}`;
  const testProduct = {
    id: testId,
    slug: testId,
    name: 'Test Product Diagnostic',
    brand: 'Test Brand',
    description: 'Test description',
    long_description: 'Test long description',
    price: 99.99,
    category: 'Electronics',
    category_slug: 'electronics',
    tags: ['test'],
    images: [{ id: 'img-1', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', alt: 'Test', isPrimary: true }],
    variants: [],
    rating: 5,
    review_count: 1,
    in_stock: true,
    stock_count: 10,
    is_new: true,
    is_featured: false,
    is_best_seller: false,
    sku: `SKU-TEST-${Date.now()}`,
  };

  const { data: insertData, error: insertErr } = await supabase.from('products').insert([testProduct]).select();
  console.log('INSERT result:', { data: insertData, error: insertErr });

  if (!insertErr && insertData && insertData.length > 0) {
    console.log('\n--- TESTING SUPABASE UPDATE ---');
    const { data: updateData, error: updateErr } = await supabase
      .from('products')
      .update({ price: 149.99, stock_count: 25 })
      .eq('id', testId)
      .select();
    console.log('UPDATE result:', { data: updateData, error: updateErr });

    console.log('\n--- TESTING SUPABASE DELETE ---');
    const { data: deleteData, error: deleteErr } = await supabase
      .from('products')
      .delete()
      .eq('id', testId)
      .select();
    console.log('DELETE result:', { data: deleteData, error: deleteErr });
  }
}

testSupabase();
