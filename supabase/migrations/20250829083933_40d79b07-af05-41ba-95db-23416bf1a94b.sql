-- Remove overly permissive RLS policies that allow any authenticated user to access all trades
-- This is a security vulnerability that allows users to see other users' trading data

DROP POLICY IF EXISTS "Enable insert for all authenticated users" ON trades;
DROP POLICY IF EXISTS "Enable select for all authenticated users" ON trades;

-- The remaining policy "Users can manage their own trades" with condition (auth.uid() = user_id)
-- provides proper user isolation and security