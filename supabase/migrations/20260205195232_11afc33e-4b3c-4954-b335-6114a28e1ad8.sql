-- Create analytics_events table for tracking user interactions
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_data JSONB,
  page_path TEXT NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS but allow public inserts for analytics
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert analytics events (no auth required for portfolio)
CREATE POLICY "Allow public insert of analytics events" 
ON public.analytics_events 
FOR INSERT 
WITH CHECK (true);

-- Only allow reading through service role (not public)
-- No SELECT policy means no public reads

-- Create index for efficient queries
CREATE INDEX idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at DESC);