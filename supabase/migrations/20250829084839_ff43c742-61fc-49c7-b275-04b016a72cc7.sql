-- Backup existing data (optional - remove if you want fresh start)
CREATE TABLE IF NOT EXISTS trades_backup AS SELECT * FROM trades;

-- Drop existing trades table and recreate with proper structure
DROP TABLE IF EXISTS trades CASCADE;

-- Create the new trades table with standard columns and proper constraints
CREATE TABLE public.trades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    asset TEXT NOT NULL CHECK (LENGTH(asset) > 0 AND LENGTH(asset) <= 50),
    trade_type TEXT NOT NULL CHECK (trade_type IN ('BUY', 'SELL')),
    price NUMERIC(15,4) NOT NULL CHECK (price > 0),
    quantity NUMERIC(15,8) NOT NULL CHECK (quantity > 0),
    stop_loss NUMERIC(15,4) CHECK (stop_loss IS NULL OR stop_loss > 0),
    take_profit NUMERIC(15,4) CHECK (take_profit IS NULL OR take_profit > 0),
    profit_loss NUMERIC(15,4) DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add additional constraints for business logic
ALTER TABLE public.trades ADD CONSTRAINT check_stop_loss_buy 
    CHECK (
        (trade_type = 'BUY' AND (stop_loss IS NULL OR stop_loss < price)) OR
        (trade_type = 'SELL' AND (stop_loss IS NULL OR stop_loss > price)) OR
        trade_type NOT IN ('BUY', 'SELL')
    );

ALTER TABLE public.trades ADD CONSTRAINT check_take_profit_buy 
    CHECK (
        (trade_type = 'BUY' AND (take_profit IS NULL OR take_profit > price)) OR
        (trade_type = 'SELL' AND (take_profit IS NULL OR take_profit < price)) OR
        trade_type NOT IN ('BUY', 'SELL')
    );

-- Enable Row Level Security
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: Users can only access their own trades
CREATE POLICY "Users can manage their own trades" 
ON public.trades 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.trades
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Add indexes for better performance
CREATE INDEX idx_trades_user_id ON public.trades(user_id);
CREATE INDEX idx_trades_created_at ON public.trades(created_at DESC);
CREATE INDEX idx_trades_status ON public.trades(status);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trades TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;