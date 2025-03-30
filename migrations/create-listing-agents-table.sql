-- Create listing_agents table
CREATE TABLE listing_agents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  commission_rate DECIMAL(5,2) NOT NULL CHECK (commission_rate BETWEEN 0 AND 100),
  terms TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(listing_id, agent_id)
);

-- Add RLS policies
ALTER TABLE listing_agents ENABLE ROW LEVEL SECURITY;

-- Allow users to request to be agents
CREATE POLICY "Users can request to be agents"
  ON listing_agents
  FOR INSERT
  TO authenticated
  WITH CHECK (
    agent_id = auth.uid() AND
    status = 'pending'
  );

-- Allow listing owners to manage agent requests
CREATE POLICY "Listing owners can manage agent requests"
  ON listing_agents
  FOR ALL
  TO authenticated
  USING (
    owner_id = auth.uid()
  );

-- Allow agents to view their own requests
CREATE POLICY "Agents can view their own requests"
  ON listing_agents
  FOR SELECT
  TO authenticated
  USING (
    agent_id = auth.uid()
  );

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_listing_agents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_listing_agents_updated_at
  BEFORE UPDATE ON listing_agents
  FOR EACH ROW
  EXECUTE FUNCTION update_listing_agents_updated_at(); 