export type AssetType = 'STOCK' | 'FOREX' | 'COMMODITY' | 'CRYPTO';

export type TradeType = 'BUY' | 'SELL';

export type TradeStatus = 'OPEN' | 'CLOSED' | 'PENDING';

export interface Trade {
  id: string;
  userId: string;
  assetType: AssetType;
  symbol: string;
  assetName: string;
  tradeType: TradeType;
  status: TradeStatus;
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  entryDate: string;
  exitDate?: string;
  stopLoss?: number;
  takeProfit?: number;
  fees: number;
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
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

export interface AssetInfo {
  symbol: string;
  name: string;
  type: AssetType;
  exchange?: string;
  currency: string;
  description?: string;
}

// Forex pairs
export const FOREX_PAIRS: AssetInfo[] = [
  { symbol: 'EUR/USD', name: 'Euro/US Dollar', type: 'FOREX', currency: 'USD' },
  { symbol: 'GBP/USD', name: 'British Pound/US Dollar', type: 'FOREX', currency: 'USD' },
  { symbol: 'USD/JPY', name: 'US Dollar/Japanese Yen', type: 'FOREX', currency: 'JPY' },
  { symbol: 'USD/CHF', name: 'US Dollar/Swiss Franc', type: 'FOREX', currency: 'CHF' },
  { symbol: 'AUD/USD', name: 'Australian Dollar/US Dollar', type: 'FOREX', currency: 'USD' },
  { symbol: 'USD/CAD', name: 'US Dollar/Canadian Dollar', type: 'FOREX', currency: 'CAD' },
  { symbol: 'NZD/USD', name: 'New Zealand Dollar/US Dollar', type: 'FOREX', currency: 'USD' },
  { symbol: 'EUR/GBP', name: 'Euro/British Pound', type: 'FOREX', currency: 'GBP' },
  { symbol: 'EUR/JPY', name: 'Euro/Japanese Yen', type: 'FOREX', currency: 'JPY' },
  { symbol: 'GBP/JPY', name: 'British Pound/Japanese Yen', type: 'FOREX', currency: 'JPY' },
];

// Commodities
export const COMMODITIES: AssetInfo[] = [
  { symbol: 'OANDA:XAUUSD', name: 'Gold/US Dollar', type: 'COMMODITY', currency: 'USD', exchange: 'OANDA' },
  { symbol: 'TVC:DXY', name: 'US Dollar Index', type: 'COMMODITY', currency: 'USD', exchange: 'TVC' },
  { symbol: 'GC', name: 'Gold Futures', type: 'COMMODITY', currency: 'USD', exchange: 'COMEX' },
  { symbol: 'SI', name: 'Silver Futures', type: 'COMMODITY', currency: 'USD', exchange: 'COMEX' },
  { symbol: 'CL', name: 'Crude Oil WTI', type: 'COMMODITY', currency: 'USD', exchange: 'NYMEX' },
  { symbol: 'BZ', name: 'Brent Crude Oil', type: 'COMMODITY', currency: 'USD', exchange: 'ICE' },
  { symbol: 'NG', name: 'Natural Gas', type: 'COMMODITY', currency: 'USD', exchange: 'NYMEX' },
  { symbol: 'HG', name: 'Copper', type: 'COMMODITY', currency: 'USD', exchange: 'COMEX' },
  { symbol: 'PL', name: 'Platinum', type: 'COMMODITY', currency: 'USD', exchange: 'COMEX' },
  { symbol: 'PA', name: 'Palladium', type: 'COMMODITY', currency: 'USD', exchange: 'COMEX' },
  { symbol: 'ZC', name: 'Corn Futures', type: 'COMMODITY', currency: 'USD', exchange: 'CBOT' },
  { symbol: 'ZS', name: 'Soybean Futures', type: 'COMMODITY', currency: 'USD', exchange: 'CBOT' },
  { symbol: 'ZW', name: 'Wheat Futures', type: 'COMMODITY', currency: 'USD', exchange: 'CBOT' },
  { symbol: 'CT', name: 'Cotton Futures', type: 'COMMODITY', currency: 'USD', exchange: 'ICE' },
];

export function calculatePnL(trade: Trade): number {
  if (!trade.exitPrice || trade.status !== 'CLOSED') return 0;
  
  const priceDiff = trade.tradeType === 'BUY' 
    ? trade.exitPrice - trade.entryPrice
    : trade.entryPrice - trade.exitPrice;
    
  return (priceDiff * trade.quantity) - trade.fees;
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function validateTradeInput(trade: Partial<Trade>): string[] {
  const errors: string[] = [];
  
  if (!trade.symbol?.trim()) errors.push('Symbol is required');
  if (!trade.assetType) errors.push('Asset type is required');
  if (!trade.tradeType) errors.push('Trade type is required');
  if (!trade.entryPrice || trade.entryPrice <= 0) errors.push('Entry price must be greater than 0');
  if (!trade.quantity || trade.quantity <= 0) errors.push('Quantity must be greater than 0');
  if (!trade.entryDate) errors.push('Entry date is required');
  if (trade.fees && trade.fees < 0) errors.push('Fees cannot be negative');
  if (trade.stopLoss && trade.stopLoss <= 0) errors.push('Stop loss must be greater than 0');
  if (trade.takeProfit && trade.takeProfit <= 0) errors.push('Take profit must be greater than 0');
  
  return errors;
}