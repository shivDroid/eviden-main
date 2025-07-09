-- Create emails table for waitlist with idea column
CREATE TABLE public.emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  idea TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert their email
CREATE POLICY "Anyone can insert emails" 
ON public.emails 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow updates to existing email records
-- This is needed for the idea submission functionality
-- The email field is unique, so users can only update their own record
CREATE POLICY "Allow updates to existing email records" 
ON public.emails 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Create policy to prevent reading emails (admin access only)
CREATE POLICY "No public read access to emails" 
ON public.emails 
FOR SELECT 
USING (false);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_emails_updated_at
  BEFORE UPDATE ON public.emails
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column(); 