import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wohofdzewftgseqgkind.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvaG9mZHpld2Z0Z3NlcWdraW5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MzQyNjcsImV4cCI6MjA4ODQxMDI2N30.hBmWq7ENiJhUeQUEHA6wiBKWEYmDhc7i2FhKV2uYAvk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
