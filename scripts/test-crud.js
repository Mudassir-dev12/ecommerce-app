const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach((line) => {
    const [key, val] = line.split('=');
    if (key && val) {
      process.env[key.trim()] = val.trim();
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testCrud() {
  console.log('Testing Supabase Products Table...');

  // 1. Fetch categories
  const { data: catData, error: catErr } = await supabase.from('categories').select('*');
  console.log('Categories count:', catData?.length, 'Err:', catErr);

  // 2. Fetch products
  const { data: prodData, error: prodErr } = await supabase.from('products').select('*');
  console.log('Products count:', prodData?.length, 'Err:', prodErr);

  // 3. Try Insert
  const testId = `test-prod-${Date.now()}`;
  const { data: insData, error: insErr } = await supabase.from('products').insert([{
    id: testId,
    slug: testId,
    name: 'Test Product',
    brand: 'Test Brand',
    price: 99.99,
    category: 'Electronics',
    category_slug: 'electronics',
    sku: `TEST-${Date.now()}`,
  }]).select();
  console.log('Insert test result:', insData, 'Err:', insErr);

  if (insData && insData.length > 0) {
    // 4. Try Delete
    const { error: delErr } = await supabase.from('products').delete().eq('id', testId);
    console.log('Delete test result Err:', delErr);
  }
}

testCrud();
