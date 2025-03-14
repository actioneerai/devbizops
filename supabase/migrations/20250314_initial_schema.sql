-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own profile
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create metrics table
CREATE TABLE IF NOT EXISTS metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('technical', 'business')),
  unit TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up Row Level Security (RLS)
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own metrics
CREATE POLICY "Users can view their own metrics" ON metrics
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own metrics
CREATE POLICY "Users can insert their own metrics" ON metrics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own metrics
CREATE POLICY "Users can update their own metrics" ON metrics
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own metrics
CREATE POLICY "Users can delete their own metrics" ON metrics
  FOR DELETE USING (auth.uid() = user_id);

-- Create metric_history table
CREATE TABLE IF NOT EXISTS metric_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_id UUID REFERENCES metrics ON DELETE CASCADE NOT NULL,
  value NUMERIC NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up Row Level Security (RLS)
ALTER TABLE metric_history ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own metric history
CREATE POLICY "Users can view their own metric history" ON metric_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM metrics
      WHERE metrics.id = metric_history.metric_id
      AND metrics.user_id = auth.uid()
    )
  );

-- Create user_favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  metric_id UUID REFERENCES metrics NOT NULL,
  UNIQUE(user_id, metric_id)
);

-- Set up Row Level Security (RLS)
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own favorites
CREATE POLICY "Users can view their own favorites" ON user_favorites
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own favorites
CREATE POLICY "Users can insert their own favorites" ON user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete their own favorites
CREATE POLICY "Users can delete their own favorites" ON user_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Create integrations table
CREATE TABLE IF NOT EXISTS integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up Row Level Security (RLS)
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own integrations
CREATE POLICY "Users can view their own integrations" ON integrations
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own integrations
CREATE POLICY "Users can insert their own integrations" ON integrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own integrations
CREATE POLICY "Users can update their own integrations" ON integrations
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own integrations
CREATE POLICY "Users can delete their own integrations" ON integrations
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically set updated_at on update
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically set updated_at on update
CREATE TRIGGER set_metrics_updated_at
BEFORE UPDATE ON metrics
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_integrations_updated_at
BEFORE UPDATE ON integrations
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Create function to handle new user signups
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();
