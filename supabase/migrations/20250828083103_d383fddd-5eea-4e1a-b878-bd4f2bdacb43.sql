-- Fix numeric field overflow by increasing precision for trading price fields
-- Current precision (10,5) only allows values up to 99,999.99999
-- Increase to (15,5) to allow values up to 999,999,999.99999

ALTER TABLE trades 
  ALTER COLUMN entry_price TYPE NUMERIC(15,5),
  ALTER COLUMN exit_price TYPE NUMERIC(15,5),
  ALTER COLUMN stop_loss TYPE NUMERIC(15,5),
  ALTER COLUMN take_profit TYPE NUMERIC(15,5),
  ALTER COLUMN profit_loss TYPE NUMERIC(15,5);

-- Also update risk_calculations table for consistency
ALTER TABLE risk_calculations
  ALTER COLUMN entry_price TYPE NUMERIC(15,5),
  ALTER COLUMN stop_loss TYPE NUMERIC(15,5),
  ALTER COLUMN take_profit TYPE NUMERIC(15,5),
  ALTER COLUMN risk_amount_idr TYPE NUMERIC(15,2),
  ALTER COLUMN reward_amount_idr TYPE NUMERIC(15,2),
  ALTER COLUMN account_balance_idr TYPE NUMERIC(15,2),
  ALTER COLUMN lot_size TYPE NUMERIC(10,6);