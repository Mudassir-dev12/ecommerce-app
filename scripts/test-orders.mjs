import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

let envVars = {};
try {
  const envContent = fs.readFileSync(path.resolve('.env.local'), 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, ...val] = line.split('=');
    if (key && val.length > 0) {
      envVars[key.trim()] = val.join('=').trim().replace(/^["']|["']$/g, '');
    }
  });
} catch (e) {}

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const testOrder = {
    id: 'test-ord-' + Date.now(),
    order_number: 'EC-TEST-' + Math.floor(Math.random() * 10000),
    status: 'pending',
    items: [{ productId: 'prod-1', name: 'Test Item', price: 50, quantity: 1 }],
    subtotal: 50,
    shipping: 300,
    tax: 4.5,
    discount: 0,
    total: 354.5,
    shipping_address: { firstName: 'Test Customer', guestUserId: 'guest_test' },
    payment_method: 'Cash on Delivery (COD)'
  };

  const res = await supabase.from('orders').upsert([testOrder]).select();
  if (res.error) {
    console.log('Status: BLOCKED BY SUPABASE RLS');
    console.log('Error:', res.error.message);
  } else {
    console.log('Status: SUCCESS! ORDER SAVED TO SUPABASE CLOUD!');
    console.log('Inserted Order:', res.data);
  }
}

check();
