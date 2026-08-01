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
} catch (e) {
  // Fallback
}

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon key is missing!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function ping() {
  const start = Date.now();
  const { data, error } = await supabase.from('products').select('id').limit(1);
  const duration = Date.now() - start;

  if (error) {
    console.error(`[${new Date().toISOString()}] Ping failed:`, error.message);
  } else {
    console.log(`[${new Date().toISOString()}] Supabase keep-alive ping successful! (${duration}ms latency)`);
  }
}

ping();
