import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xyjjxofhcpcqxcacnpof.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5amp4b2ZoY3BjcXhjYWNucG9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4MzQyMjQsImV4cCI6MjA5NjQxMDIyNH0.BJLT3S3pcqsS4aJoSVIkBhZEYyljRlIV1e8DT56bmWU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
