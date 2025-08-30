export type TradeType = 'BUY' | 'SELL';
export type TradeStatus = 'open' | 'closed' | 'cancelled';
export type AssetType = 'STOCK' | 'FOREX' | 'COMMODITY' | 'CRYPTO';

// Simplified Trade interface matching the new secure database schema
export interface Trade {
  id?: string;
  user_id?: string;
  asset: string;
  trade_type: TradeType;
  price: number;
  quantity: number;
  stop_loss?: number;
  take_profit?: number;
  profit_loss?: number;
  status: TradeStatus;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Portfolio {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalProfit: number;
  totalFees: number;
  netProfit: number;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
  sharpeRatio?: number;
}

// Popular trading assets for quick selection
export const POPULAR_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'META', name: 'Meta Platforms Inc.' },
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF' },
];

export const FOREX_PAIRS = [
  { symbol: 'EURUSD', name: 'Euro / US Dollar' },
  { symbol: 'GBPUSD', name: 'British Pound / US Dollar' },
  { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen' },
  { symbol: 'USDCHF', name: 'US Dollar / Swiss Franc' },
  { symbol: 'AUDUSD', name: 'Australian Dollar / US Dollar' },
  { symbol: 'USDCAD', name: 'US Dollar / Canadian Dollar' },
];

export const CRYPTO_PAIRS = [
  { symbol: 'BTCUSD', name: 'Bitcoin / US Dollar' },
  { symbol: 'ETHUSD', name: 'Ethereum / US Dollar' },
  { symbol: 'ADAUSD', name: 'Cardano / US Dollar' },
  { symbol: 'SOLUSD', name: 'Solana / US Dollar' },
  { symbol: 'DOTUSD', name: 'Polkadot / US Dollar' },
];

export const COMMODITIES = [
  { symbol: 'XAUUSD', name: 'Gold / US Dollar' },
  { symbol: 'XAGUSD', name: 'Silver / US Dollar' },
  { symbol: 'USOIL', name: 'US Oil' },
  { symbol: 'UKOIL', name: 'UK Oil' },
  { symbol: 'NATGAS', name: 'Natural Gas' },
];

// Calculate PnL for a trade
export function calculatePnL(trade: Trade): number {
  if (trade.status !== 'closed' || !trade.profit_loss) return 0;
  return trade.profit_loss;
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Validation function for trade input
export function validateTradeInput(trade: Partial<Trade>): string[] {
  const errors: string[] = [];

  // Required fields validation
  if (!trade.asset || trade.asset.trim().length === 0) {
    errors.push('Asset symbol is required');
  } else if (trade.asset.length > 50) {
    errors.push('Asset symbol must be 50 characters or less');
  }

  if (!trade.trade_type) {
    errors.push('Trade type is required');
  } else if (!['BUY', 'SELL'].includes(trade.trade_type)) {
    errors.push('Trade type must be BUY or SELL');
  }

  if (trade.price === undefined || trade.price === null) {
    errors.push('Price is required');
  } else if (trade.price <= 0) {
    errors.push('Price must be greater than 0');
  }

  if (trade.quantity === undefined || trade.quantity === null) {
    errors.push('Quantity is required');
  } else if (trade.quantity <= 0) {
    errors.push('Quantity must be greater than 0');
  }

  // Optional fields validation
  if (trade.stop_loss !== undefined && trade.stop_loss !== null && trade.stop_loss <= 0) {
    errors.push('Stop loss must be greater than 0 if provided');
  }

  if (trade.take_profit !== undefined && trade.take_profit !== null && trade.take_profit <= 0) {
    errors.push('Take profit must be greater than 0 if provided');
  }

  // Business logic validation
  if (trade.trade_type === 'BUY' && trade.stop_loss && trade.price && trade.stop_loss >= trade.price) {
    errors.push('For BUY trades, stop loss must be less than entry price');
  }

  if (trade.trade_type === 'SELL' && trade.stop_loss && trade.price && trade.stop_loss <= trade.price) {
    errors.push('For SELL trades, stop loss must be greater than entry price');
  }

  if (trade.trade_type === 'BUY' && trade.take_profit && trade.price && trade.take_profit <= trade.price) {
    errors.push('For BUY trades, take profit must be greater than entry price');
  }

  if (trade.trade_type === 'SELL' && trade.take_profit && trade.price && trade.take_profit >= trade.price) {
    errors.push('For SELL trades, take profit must be less than entry price');
  }

  return errors;
}