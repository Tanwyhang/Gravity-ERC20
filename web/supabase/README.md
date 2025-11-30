# Supabase Setup Guide

## Prerequisites
1. Supabase account and project created at: https://dfwgwvgecaoonykbimlj.supabase.co
2. Anon key from your Supabase project

## Setup Steps

### 1. Get Your Supabase Anon Key
1. Go to your Supabase project dashboard: https://dfwgwvgecaoonykbimlj.supabase.co
2. Click on "Settings" (gear icon in the left sidebar)
3. Navigate to "API" section
4. Copy the `anon` `public` key
5. Update the `.env` file with your actual anon key:
   ```
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
   ```

### 2. Run the Migration

You can run the migration in two ways:

#### Option A: Using Supabase Dashboard (Recommended for beginners)
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the entire contents of `supabase/migrations/20251130_create_payment_links.sql`
5. Paste it into the SQL editor
6. Click "Run" to execute the migration

#### Option B: Using Supabase CLI (Advanced)
```bash
# Install Supabase CLI (if not already installed)
brew install supabase/tap/supabase

# Login to Supabase
supabase login

# Link your project (you'll need your project ref: dfwgwvgecaoonykbimlj)
supabase link --project-ref dfwgwvgecaoonykbimlj

# Run migrations
supabase db push
```

### 3. Verify the Migration
1. Go to "Table Editor" in your Supabase dashboard
2. You should see a new table called `payment_links` with the following columns:
   - `id` (text, primary key)
   - `creator_address` (text)
   - `url` (text)
   - `token_symbol` (text)
   - `usd_amount` (text)
   - `merchant_name` (text)
   - `custom_title` (text)
   - `total_earnings` (numeric)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

### 4. Test the Connection
After updating your `.env` file with the correct anon key, restart your development server:
```bash
pnpm dev
```

The app should now connect to Supabase and store payment links remotely!

## Database Schema

### payment_links Table
Stores all payment links created by users.

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Unique identifier for the payment link |
| creator_address | TEXT | Wallet address of the creator |
| url | TEXT | Full URL of the payment link |
| token_symbol | TEXT | Token symbol (e.g., MNEE, USDC) |
| usd_amount | TEXT | Amount in USD |
| merchant_name | TEXT | Name of the merchant |
| custom_title | TEXT | Custom title for the payment link |
| total_earnings | DECIMAL | Total earnings in MNEE |
| created_at | TIMESTAMP | When the link was created |
| updated_at | TIMESTAMP | Last update timestamp |

### Row Level Security (RLS)
- All users can read any payment links
- All users can create payment links
- All users can update/delete payment links
- You can tighten these policies later based on your security requirements

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure you've updated `.env` with your actual anon key
- Restart your development server after updating `.env`

### Can't connect to Supabase
- Verify your project URL is correct: https://dfwgwvgecaoonykbimlj.supabase.co
- Check that your anon key is correct
- Make sure your Supabase project is active and running

### Migration errors
- Make sure you're running the migration on the correct project
- Check the Supabase dashboard logs for detailed error messages
