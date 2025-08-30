-- Enable Row Level Security on trades_backup table
ALTER TABLE public.trades_backup ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to manage only their own backup trades
CREATE POLICY "Users can manage their own backup trades" 
ON public.trades_backup 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add comment explaining the security policy
COMMENT ON POLICY "Users can manage their own backup trades" ON public.trades_backup 
IS 'Ensures users can only access, insert, update, and delete their own backup trade records';