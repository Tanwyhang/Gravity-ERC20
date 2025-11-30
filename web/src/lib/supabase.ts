import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// TypeScript types for our database schema
export interface PaymentLink {
  id: string;
  creator_address: string;
  url: string;
  token_symbol: string;
  usd_amount: string;
  merchant_name: string;
  custom_title: string;
  total_earnings: number;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      payment_links: {
        Row: PaymentLink;
        Insert: Omit<PaymentLink, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<PaymentLink, 'id' | 'created_at'>>;
      };
    };
  };
}
