import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, DollarSign, TrendingUp, AlertTriangle, Plus } from 'lucide-react';
import { Trade, TradeType, POPULAR_STOCKS, FOREX_PAIRS, CRYPTO_PAIRS, validateTradeInput } from '@/types/trading';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';

type AssetCategory = 'stocks' | 'forex' | 'crypto' | 'custom';

export function AddTradePage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [assetCategory, setAssetCategory] = useState<AssetCategory>('stocks');
  
  const [formData, setFormData] = useState<Partial<Trade>>({
    trade_type: 'BUY',
    status: 'open',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to add trades",
        variant: "destructive",
      });
      return;
    }
    
    const validationErrors = validateTradeInput(formData);
    setErrors(validationErrors);
    
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
      // Ensure all required fields are present for database insertion
      const tradeData = {
        asset: formData.asset!,
        trade_type: formData.trade_type!,
        price: formData.price!,
        quantity: formData.quantity!,
        stop_loss: formData.stop_loss,
        take_profit: formData.take_profit,
        profit_loss: formData.profit_loss || 0,
        status: formData.status!,
        notes: formData.notes,
        user_id: user.id,
      };

      const { error } = await supabase
        .from('trades')
        .insert(tradeData);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      toast({
        title: "Trade Added",
        description: `Successfully added ${formData.asset} ${formData.trade_type} trade`,
      });
      
      // Reset form
      setFormData({
        trade_type: 'BUY',
        status: 'open',
      });
      setErrors([]);
    } catch (error: any) {
      console.error('Error adding trade:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add trade",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAssetOptions = () => {
    switch (assetCategory) {
      case 'stocks':
        return POPULAR_STOCKS;
      case 'forex':
        return FOREX_PAIRS;
      case 'crypto':
        return CRYPTO_PAIRS;
      default:
        return [];
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Trade</h1>
          <p className="text-muted-foreground">Record your trading positions securely</p>
        </div>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Trade Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Asset Selection */}
            <div className="space-y-4">
              <Label>Asset Category</Label>
              <div className="grid grid-cols-4 gap-2">
                <Button
                  type="button"
                  variant={assetCategory === 'stocks' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAssetCategory('stocks')}
                  className="w-full"
                >
                  <Badge variant="secondary" className="mr-1">STK</Badge>
                  Stocks
                </Button>
                <Button
                  type="button"
                  variant={assetCategory === 'forex' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAssetCategory('forex')}
                  className="w-full"
                >
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 mr-1">FX</Badge>
                  Forex
                </Button>
                <Button
                  type="button"
                  variant={assetCategory === 'crypto' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAssetCategory('crypto')}
                  className="w-full"
                >
                  <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 mr-1">CRY</Badge>
                  Crypto
                </Button>
                <Button
                  type="button"
                  variant={assetCategory === 'custom' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAssetCategory('custom')}
                  className="w-full"
                >
                  Custom
                </Button>
              </div>
            </div>

            {/* Asset Symbol */}
            <div className="space-y-2">
              <Label htmlFor="asset">Asset Symbol</Label>
              {assetCategory !== 'custom' ? (
                <Select
                  value={formData.asset}
                  onValueChange={(value) => setFormData({ ...formData, asset: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAssetOptions().map((asset) => (
                      <SelectItem key={asset.symbol} value={asset.symbol}>
                        <div className="flex items-center justify-between w-full">
                          <span className="font-mono text-sm font-medium">{asset.symbol}</span>
                          <span className="text-xs text-muted-foreground ml-2">{asset.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="asset"
                  placeholder="Enter asset symbol (e.g., AAPL, BTCUSD)"
                  value={formData.asset || ''}
                  onChange={(e) => setFormData({ ...formData, asset: e.target.value.toUpperCase() })}
                  maxLength={50}
                />
              )}
            </div>

            {/* Trade Type */}
            <div className="space-y-2">
              <Label htmlFor="tradeType">Trade Type</Label>
              <Select
                value={formData.trade_type}
                onValueChange={(value: TradeType) => setFormData({ ...formData, trade_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BUY">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span>BUY / LONG</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="SELL">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span>SELL / SHORT</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price and Quantity */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Entry Price *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="price"
                    type="number"
                    step="0.0001"
                    min="0.0001"
                    className="pl-10"
                  placeholder="0.00"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.00000001"
                  min="0.00000001"
                  placeholder="0"
                  value={formData.quantity || ''}
                  onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                  required
                />
              </div>
            </div>

            {/* Risk Management */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stopLoss">Stop Loss (Optional)</Label>
                <div className="relative">
                  <AlertTriangle className="absolute left-3 top-3 h-4 w-4 text-red-500" />
                  <Input
                    id="stopLoss"
                    type="number"
                    step="0.0001"
                    min="0.0001"
                    className="pl-10"
                    placeholder="0.00"
                  value={formData.stop_loss || ''}
                  onChange={(e) => setFormData({ ...formData, stop_loss: parseFloat(e.target.value) || undefined })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="takeProfit">Take Profit (Optional)</Label>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                  <Input
                    id="takeProfit"
                    type="number"
                    step="0.0001"
                    min="0.0001"
                    className="pl-10"
                    placeholder="0.00"
                  value={formData.take_profit || ''}
                  onChange={(e) => setFormData({ ...formData, take_profit: parseFloat(e.target.value) || undefined })}
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Trading Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Market analysis, strategy details, setup description..."
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Validation Errors */}
            {errors.length > 0 && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Please fix the following errors:</h4>
                <ul className="text-sm text-red-600 dark:text-red-300 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-current"></div>
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
              size="lg"
            >
              {loading ? 'Adding Trade...' : 'Add Trade'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}