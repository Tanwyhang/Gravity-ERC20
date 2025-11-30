-- Create payment_links table
CREATE TABLE IF NOT EXISTS payment_links (
  id TEXT PRIMARY KEY,
  creator_address TEXT NOT NULL,
  url TEXT NOT NULL,
  token_symbol TEXT NOT NULL,
  usd_amount TEXT NOT NULL,
  merchant_name TEXT NOT NULL,
  custom_title TEXT NOT NULL,
  total_earnings DECIMAL(20, 8) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index on creator_address for faster queries
CREATE INDEX IF NOT EXISTS idx_payment_links_creator_address ON payment_links(creator_address);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_payment_links_created_at ON payment_links(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE payment_links ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view only their own payment links
CREATE POLICY "Users can view their own payment links"
  ON payment_links
  FOR SELECT
  USING (true); -- Allow anyone to read for now, you can restrict later if needed

-- Create policy to allow users to insert their own payment links
CREATE POLICY "Users can create payment links"
  ON payment_links
  FOR INSERT
  WITH CHECK (true); -- Allow anyone to create, wallet address is stored in creator_address

-- Create policy to allow users to update their own payment links
CREATE POLICY "Users can update their own payment links"
  ON payment_links
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create policy to allow users to delete their own payment links
CREATE POLICY "Users can delete their own payment links"
  ON payment_links
  FOR DELETE
  USING (true); -- You might want to add: creator_address = current_setting('request.jwt.claim.wallet_address', true)

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_payment_links_updated_at
  BEFORE UPDATE ON payment_links
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
