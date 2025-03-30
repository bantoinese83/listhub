-- Create agent_referrals table
CREATE TABLE agent_referrals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  buyer_email TEXT,
  buyer_phone TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'contacted', 'viewing', 'offer', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(referral_code)
);

-- Create agent_sales table
CREATE TABLE agent_sales (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  referral_id UUID REFERENCES agent_referrals(id) ON DELETE SET NULL,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  sale_amount DECIMAL(12,2) NOT NULL,
  commission_amount DECIMAL(12,2) NOT NULL,
  commission_rate DECIMAL(5,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'disputed', 'cancelled')),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add RLS policies
ALTER TABLE agent_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_sales ENABLE ROW LEVEL SECURITY;

-- Agents can create and view their own referrals
CREATE POLICY "Agents can manage their referrals"
  ON agent_referrals
  FOR ALL
  TO authenticated
  USING (agent_id = auth.uid());

-- Listing owners can view referrals for their listings
CREATE POLICY "Owners can view referrals for their listings"
  ON agent_referrals
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = agent_referrals.listing_id
      AND listings.user_id = auth.uid()
    )
  );

-- Agents can view their own sales
CREATE POLICY "Agents can view their sales"
  ON agent_sales
  FOR SELECT
  TO authenticated
  USING (agent_id = auth.uid());

-- Listing owners can view sales for their listings
CREATE POLICY "Owners can view sales for their listings"
  ON agent_sales
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = agent_sales.listing_id
      AND listings.user_id = auth.uid()
    )
  );

-- Create functions to update updated_at
CREATE OR REPLACE FUNCTION update_agent_referrals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_agent_sales_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_agent_referrals_updated_at
  BEFORE UPDATE ON agent_referrals
  FOR EACH ROW
  EXECUTE FUNCTION update_agent_referrals_updated_at();

CREATE TRIGGER update_agent_sales_updated_at
  BEFORE UPDATE ON agent_sales
  FOR EACH ROW
  EXECUTE FUNCTION update_agent_sales_updated_at(); 