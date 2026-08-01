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

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon key is missing!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createUser() {
  const email = 'mktradersofficial@gmail.com';
  const password = 'MkT1234@#';

  console.log(`Registering user in Supabase auth: ${email}...`);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Error creating user:', error.message);
  } else {
    console.log('User created successfully!');
    console.log('User ID:', data.user?.id);
    console.log('Email:', data.user?.email);
    console.log('Confirmation sent / User session:', data.session ? 'Active' : 'Awaiting confirmation (or auto-confirmed)');
  }
}

createUser();
