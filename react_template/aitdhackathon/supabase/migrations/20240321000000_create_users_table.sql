-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  phone TEXT NOT NULL,
  linkedin_url TEXT NOT NULL,
  linkedin_username TEXT,
  linkedin_password TEXT,
  preference TEXT,
  skills TEXT NOT NULL,
  location TEXT,
  uploads TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS users_username_idx ON users (username);
CREATE INDEX IF NOT EXISTS users_email_idx ON users (email);

-- Add RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON users
  FOR SELECT USING (true);

-- Allow public insert access
CREATE POLICY "Allow public insert access" ON users
  FOR INSERT WITH CHECK (true); 