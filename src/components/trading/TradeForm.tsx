import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { AssetType, TradeType, Trade, FOREX_PAIRS, COMMODITIES, validateTradeInput } from '@/types/trading';
import { useToast } from '@/hooks/use-toast';

interface TradeFormProps {
  onSubmit: (trade: Partial<Trade>) => Promise<void>;
  initialData?: Partial<Trade>;
  isEditing?: boolean;
}

const popularStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'META', name: 'Meta Platforms Inc.' },
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF' },
];

export function TradeForm({ onSubmit, initialData, isEditing = false }: TradeFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<Partial<Trade>>({
    assetType: 'STOCK',
    tradeType: 'BUY',
    entryDate: new Date().toISOString().split('T')[0],
    fees: 0,
    status: 'OPEN',
    ...initialData,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission started:', formData);
    
    const validationErrors = validateTradeInput(formData);
    setErrors(validationErrors);
    
    console.log('Validation errors:', validationErrors);
    
    if (validationErrors.length > 0) {
      toast({
        title: "Validation Error",
        description: validationErrors[0],
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Calling onSubmit with:', formData);
      await onSubmit(formData);
      toast({
        title: isEditing ? "Trade Updated" : "Trade Added",
        description: `Successfully ${isEditing ? 'updated' : 'added'} ${formData.symbol} trade`,
      });
      
      if (!isEditing) {
        // Reset form after successful submission
        setFormData({
          assetType: formData.assetType,
          tradeType: 'BUY',
          entryDate: new Date().toISOString().split('T')[0],
          fees: 0,
          status: 'OPEN',
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'add'} trade`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAssetOptions = () => {
    switch (formData.assetType) {
      case 'FOREX':
        return FOREX_PAIRS;
      case 'COMMODITY':
        return COMMODITIES;
      case 'STOCK':
        return popularStocks.map(stock => ({
          symbol: stock.symbol,
          name: stock.name,
          type: 'STOCK' as AssetType,
          currency: 'USD'
        }));
      default:
        return [];
    }
  };

  return (
    <Card className="trading-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          {isEditing ? 'Edit Trade' : 'Add New Trade'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Asset Type Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assetType">Asset Type</Label>
              <Select
                value={formData.assetType}
                onValueChange={(value: AssetType) => 
                  setFormData({ ...formData, assetType: value, symbol: '', assetName: '' })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STOCK">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">STOCK</Badge>
                      <span>Stocks & ETFs</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="FOREX">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">FX</Badge>
                      <span>Forex Pairs</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="COMMODITY">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">COMM</Badge>
                      <span>Commodities</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="CRYPTO">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">CRYPTO</Badge>
                      <span>Cryptocurrency</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tradeType">Trade Type</Label>
              <Select
                value={formData.tradeType}
                onValueChange={(value: TradeType) => setFormData({ ...formData, tradeType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BUY">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-profit"></div>
                      <span>BUY / LONG</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="SELL">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-loss"></div>
                      <span>SELL / SHORT</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Symbol Selection */}
          <div className="space-y-2">
            <Label htmlFor="symbol">Symbol</Label>
            {formData.assetType !== 'CRYPTO' ? (
              <Select
                value={formData.symbol}
                onValueChange={(value) => {
                  const asset = getAssetOptions().find(opt => opt.symbol === value);
                  setFormData({ 
                    ...formData, 
                    symbol: value,
                    assetName: asset?.name || value
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select symbol" />
                </SelectTrigger>
                <SelectContent>
                  {getAssetOptions().map((asset) => (
                    <SelectItem key={asset.symbol} value={asset.symbol}>
                      <div className="flex items-center justify-between w-full">
                        <span className="font-mono text-sm">{asset.symbol}</span>
                        <span className="text-xs text-muted-foreground ml-2">{asset.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                placeholder="e.g., BTC, ETH, ADA"
                value={formData.symbol || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  symbol: e.target.value,
                  assetName: e.target.value
                })}
              />
            )}
          </div>

          {/* Price and Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entryPrice">Entry Price</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="entryPrice"
                  type="number"
                  step="0.0001"
                  className="pl-10"
                  value={formData.entryPrice || ''}
                  onChange={(e) => setFormData({ ...formData, entryPrice: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                step="0.001"
                value={formData.quantity || ''}
                onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          {/* Risk Management */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stopLoss">Stop Loss (Optional)</Label>
              <div className="relative">
                <AlertTriangle className="absolute left-3 top-3 h-4 w-4 text-loss" />
                <Input
                  id="stopLoss"
                  type="number"
                  step="0.0001"
                  className="pl-10"
                  value={formData.stopLoss || ''}
                  onChange={(e) => setFormData({ ...formData, stopLoss: parseFloat(e.target.value) || undefined })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="takeProfit">Take Profit (Optional)</Label>
              <div className="relative">
                <TrendingUp className="absolute left-3 top-3 h-4 w-4 text-profit" />
                <Input
                  id="takeProfit"
                  type="number"
                  step="0.0001"
                  className="pl-10"
                  value={formData.takeProfit || ''}
                  onChange={(e) => setFormData({ ...formData, takeProfit: parseFloat(e.target.value) || undefined })}
                />
              </div>
            </div>
          </div>

          {/* Date and Fees */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entryDate">Entry Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="entryDate"
                  type="date"
                  className="pl-10"
                  value={formData.entryDate || ''}
                  onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fees">Fees</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fees"
                  type="number"
                  step="0.01"
                  className="pl-10"
                  value={formData.fees || 0}
                  onChange={(e) => setFormData({ ...formData, fees: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Trade setup, market conditions, strategy notes..."
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          {/* Validation Errors */}
          {errors.length > 0 && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <ul className="text-sm text-destructive space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? 'Processing...' : (isEditing ? 'Update Trade' : 'Add Trade')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}