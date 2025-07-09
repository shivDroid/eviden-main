-- Add rate limiting function
CREATE OR REPLACE FUNCTION check_rate_limit(
  email_address TEXT,
  max_attempts INTEGER DEFAULT 5,
  time_window_minutes INTEGER DEFAULT 60
)
RETURNS BOOLEAN AS $$
DECLARE
  attempt_count INTEGER;
BEGIN
  -- Count attempts in the last time window
  SELECT COUNT(*) INTO attempt_count
  FROM public.emails
  WHERE email = email_address
    AND created_at > NOW() - INTERVAL '1 minute' * time_window_minutes;
  
  -- Return true if under limit, false if over limit
  RETURN attempt_count < max_attempts;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add input validation function
CREATE OR REPLACE FUNCTION validate_email_input(
  email_address TEXT,
  idea_text TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Basic email validation
  IF email_address IS NULL OR email_address = '' THEN
    RETURN FALSE;
  END IF;
  
  -- Check email format (basic regex)
  IF email_address !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RETURN FALSE;
  END IF;
  
  -- Check idea length if provided
  IF idea_text IS NOT NULL AND LENGTH(idea_text) > 1000 THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a secure insert function
CREATE OR REPLACE FUNCTION secure_insert_email(
  email_address TEXT,
  idea_text TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Validate input
  IF NOT validate_email_input(email_address, idea_text) THEN
    RETURN json_build_object('error', 'Invalid input data');
  END IF;
  
  -- Check rate limiting
  IF NOT check_rate_limit(email_address) THEN
    RETURN json_build_object('error', 'Rate limit exceeded');
  END IF;
  
  -- Insert the email
  INSERT INTO public.emails (email, idea)
  VALUES (email_address, idea_text)
  ON CONFLICT (email) DO UPDATE SET
    idea = COALESCE(EXCLUDED.idea, emails.idea),
    updated_at = NOW();
  
  RETURN json_build_object('success', true);
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('error', 'Database error');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION check_rate_limit(TEXT, INTEGER, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION validate_email_input(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION secure_insert_email(TEXT, TEXT) TO anon; 