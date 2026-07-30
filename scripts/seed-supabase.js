/**
 * scripts/seed-supabase.js
 * Run using: node scripts/seed-supabase.js
 * Make sure you ran `supabase_schema.sql` in your Supabase SQL Editor first!
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

// Load environment variables manually from .env.local
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

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Import mock data directly (compiled or evaluated)
async function seed() {
  console.log('🚀 Starting Supabase Database Seeding...');

  // 1. Check Connection
  const { data: catCheck, error: connError } = await supabase.from('categories').select('*').limit(1);
  if (connError) {
    if (connError.code === 'PGRST205') {
      console.error('❌ Error: Tables do not exist yet in Supabase!');
      console.error('👉 Please open your Supabase Dashboard -> SQL Editor and run the SQL code from "supabase_schema.sql" file first.');
      process.exit(1);
    } else {
      console.error('❌ Connection Error:', connError.message);
      process.exit(1);
    }
  }

  console.log('✅ Connection to Supabase successful!');
}

seed();
