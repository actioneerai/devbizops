-- Supabase Schema for DevBizOps

-- Profiles table to store user information
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Metrics table to store all metrics
CREATE TABLE metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('technical', 'business')),
  unit TEXT,
  description TEXT,
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

-- Create policies for metrics
CREATE POLICY "Users can view their own metrics" ON metrics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own metrics" ON metrics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own metrics" ON metrics
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own metrics" ON metrics
  FOR DELETE USING (auth.uid() = user_id);

-- Metric history table to store historical data
CREATE TABLE metric_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_id UUID REFERENCES metrics(id) ON DELETE CASCADE NOT NULL,
  value NUMERIC NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE metric_history ENABLE ROW LEVEL SECURITY;

-- Create policies for metric_history
CREATE POLICY "Users can view history of their own metrics" ON metric_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM metrics
      WHERE metrics.id = metric_history.metric_id
      AND metrics.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert history for their own metrics" ON metric_history
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM metrics
      WHERE metrics.id = metric_history.metric_id
      AND metrics.user_id = auth.uid()
    )
  );

-- User favorites table to track favorite metrics
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  metric_id UUID REFERENCES metrics(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, metric_id)
);

-- Enable Row Level Security
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Create policies for user_favorites
CREATE POLICY "Users can view their own favorites" ON user_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" ON user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON user_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Dashboard configurations table
CREATE TABLE dashboard_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  layout JSONB NOT NULL DEFAULT '{}',
  theme TEXT DEFAULT 'light',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE dashboard_configs ENABLE ROW LEVEL SECURITY;

-- Create policies for dashboard_configs
CREATE POLICY "Users can view their own dashboard config" ON dashboard_configs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own dashboard config" ON dashboard_configs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dashboard config" ON dashboard_configs
  FOR UPDATE USING (auth.uid() = user_id);

-- Integrations table to store external system connections
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('github', 'jira', 'slack', 'discord', 'crm', 'ci_cd')),
  config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- Create policies for integrations
CREATE POLICY "Users can view their own integrations" ON integrations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own integrations" ON integrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own integrations" ON integrations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own integrations" ON integrations
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_metrics_updated_at
BEFORE UPDATE ON metrics
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dashboard_configs_updated_at
BEFORE UPDATE ON dashboard_configs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integrations_updated_at
BEFORE UPDATE ON integrations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically add metric history when a metric is updated
CREATE OR REPLACE FUNCTION add_metric_history()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.value <> NEW.value THEN
    INSERT INTO metric_history (metric_id, value)
    VALUES (NEW.id, NEW.value);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for metric history
CREATE TRIGGER add_metric_history_on_update
AFTER UPDATE ON metrics
FOR EACH ROW EXECUTE FUNCTION add_metric_history();

-- Create trigger for initial metric history
CREATE OR REPLACE FUNCTION add_initial_metric_history()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO metric_history (metric_id, value)
  VALUES (NEW.id, NEW.value);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER add_metric_history_on_insert
AFTER INSERT ON metrics
FOR EACH ROW EXECUTE FUNCTION add_initial_metric_history();
