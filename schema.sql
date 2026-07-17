-- SQL Migration Script for Supabase
-- Run this in your Supabase SQL Editor to support credits, models, and posts!

-- 1. Add credits column to profiles table with a default of 300
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 300;

-- 2. Create models table to store AI Influencer Personas
CREATE TABLE IF NOT EXISTS models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  gender TEXT NOT NULL,
  body_type TEXT NOT NULL,
  skin_tone TEXT NOT NULL,
  age_range TEXT NOT NULL,
  hair_style TEXT NOT NULL,
  eye_color TEXT NOT NULL,
  vibe TEXT NOT NULL,
  prompt TEXT NOT NULL,
  portrait_url TEXT NOT NULL,
  full_body_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create posts table to store generated influencer posts
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  model_id UUID REFERENCES models(id) ON DELETE CASCADE,
  caption TEXT NOT NULL,
  image_url TEXT NOT NULL,
  platform TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on new tables
ALTER TABLE models ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policies for models
CREATE POLICY "Users can insert their own models" 
  ON models FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own models" 
  ON models FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own models" 
  ON models FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own models" 
  ON models FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for posts
CREATE POLICY "Users can insert their own posts" 
  ON posts FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own posts" 
  ON posts FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" 
  ON posts FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" 
  ON posts FOR DELETE 
  USING (auth.uid() = user_id);
