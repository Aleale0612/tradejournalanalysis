-- Fix security issues identified by the linter

-- Enable RLS on tables that don't have it
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_snapshots ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for these tables
CREATE POLICY "Users can manage their own chat sessions" 
ON chat_sessions 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own chat messages" 
ON chat_messages 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own embeddings" 
ON embeddings 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own portfolio snapshots" 
ON portfolio_snapshots 
FOR ALL 
USING (auth.uid() = user_id);

-- Fix function search paths by recreating functions with proper security
DROP FUNCTION IF EXISTS update_trade_profit_loss() CASCADE;
CREATE OR REPLACE FUNCTION update_trade_profit_loss()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.exit_price IS NOT NULL AND NEW.status = 'closed' THEN
    -- Calculate P&L based on trade type and lot size
    IF NEW.trade_type = 'BUY' THEN
      NEW.profit_loss = (NEW.exit_price - NEW.entry_price) * NEW.quantity * COALESCE(NEW.lot_size, 1) - COALESCE(NEW.fees, 0);
    ELSE -- SELL
      NEW.profit_loss = (NEW.entry_price - NEW.exit_price) * NEW.quantity * COALESCE(NEW.lot_size, 1) - COALESCE(NEW.fees, 0);
    END IF;
    
    -- Convert to IDR if needed (assuming USD rate of 15,000 for now)
    IF NEW.currency = 'USD' AND NEW.risk_amount_idr IS NOT NULL THEN
      NEW.profit_loss = NEW.profit_loss * 15000;  -- Convert to IDR
    END IF;
  END IF;
  
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER trigger_update_trade_profit_loss
  BEFORE UPDATE ON trades
  FOR EACH ROW EXECUTE FUNCTION update_trade_profit_loss();

-- Fix other functions with search path issues
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;