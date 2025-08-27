-- Fix authentication settings and improve database structure
-- Enable email authentication
UPDATE auth.config SET value = 'true' WHERE key = 'enable_signup';

-- Improve trades table structure for better risk management
ALTER TABLE trades ADD COLUMN IF NOT EXISTS lot_size DECIMAL(10,4) DEFAULT 0.01;
ALTER TABLE trades ADD COLUMN IF NOT EXISTS risk_reward_ratio DECIMAL(5,2);
ALTER TABLE trades ADD COLUMN IF NOT EXISTS risk_amount_idr DECIMAL(15,2);
ALTER TABLE trades ADD COLUMN IF NOT EXISTS stop_loss DECIMAL(10,5);
ALTER TABLE trades ADD COLUMN IF NOT EXISTS take_profit DECIMAL(10,5);
ALTER TABLE trades ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';
ALTER TABLE trades ADD COLUMN IF NOT EXISTS account_balance_idr DECIMAL(15,2);
ALTER TABLE trades ADD COLUMN IF NOT EXISTS risk_percentage DECIMAL(5,2) DEFAULT 2.0;

-- Create risk_calculations table for calculator history
CREATE TABLE IF NOT EXISTS risk_calculations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    account_balance_idr DECIMAL(15,2) NOT NULL,
    risk_percentage DECIMAL(5,2) NOT NULL,
    entry_price DECIMAL(10,5) NOT NULL,
    stop_loss DECIMAL(10,5) NOT NULL,
    take_profit DECIMAL(10,5),
    lot_size DECIMAL(10,4) NOT NULL,
    risk_amount_idr DECIMAL(15,2) NOT NULL,
    reward_amount_idr DECIMAL(15,2),
    risk_reward_ratio DECIMAL(5,2),
    symbol TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on risk_calculations
ALTER TABLE risk_calculations ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for risk_calculations
CREATE POLICY "Users can manage their own risk calculations" 
ON risk_calculations 
FOR ALL 
USING (auth.uid() = user_id);

-- Update profiles table to include IDR preferences
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS default_currency TEXT DEFAULT 'IDR';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS account_balance_idr DECIMAL(15,2) DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS default_risk_percentage DECIMAL(5,2) DEFAULT 2.0;

-- Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_trades_user_date ON trades(user_id, entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_risk_calculations_user_date ON risk_calculations(user_id, created_at DESC);

-- Update trigger for trades table
CREATE OR REPLACE FUNCTION update_trade_profit_loss()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_trade_profit_loss ON trades;
CREATE TRIGGER trigger_update_trade_profit_loss
  BEFORE UPDATE ON trades
  FOR EACH ROW EXECUTE FUNCTION update_trade_profit_loss();