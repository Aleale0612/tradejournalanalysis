import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { Trade, TradeType, POPULAR_STOCKS, FOREX_PAIRS, COMMODITIES, validateTradeInput } from '@/types/trading';
import { useToast } from '@/hooks/use-toast';

interface TradeFormProps {
  onSubmit: (trade: Partial<Trade>) => Promise<void>;
  initialData?: Partial<Trade>;
  isEditing?: boolean;
}

export function TradeForm({ onSubmit, initialData, isEditing = false }: TradeFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<Partial<Trade>>({
    asset: '',
    trade_type: 'BUY',
    price: 0,
    quantity: 1,
    status: 'open',
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
        description: `Successfully ${isEditing ? 'updated' : 'added'} ${formData.asset} trade`,
      });
      
      if (!isEditing) {
        // Reset form after successful submission
        setFormData({
          asset: '',
          trade_type: 'BUY',
          price: 0,
          quantity: 1,
          status: 'open',
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
          {/* Asset and Trade Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="asset">Asset Symbol</Label>
              <Input
                id="asset"
                placeholder="e.g., AAPL, EURUSD, XAUUSD"
                value={formData.asset || ''}
                onChange={(e) => setFormData({ ...formData, asset: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trade_type">Trade Type</Label>
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

          {/* Price and Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Entry Price</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="price"
                  type="number"
                  step="0.0001"
                  className="pl-10"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
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
                onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 1 })}
              />
            </div>
          </div>

          {/* Risk Management */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stop_loss">Stop Loss (Optional)</Label>
              <div className="relative">
                <AlertTriangle className="absolute left-3 top-3 h-4 w-4 text-loss" />
                <Input
                  id="stop_loss"
                  type="number"
                  step="0.0001"
                  className="pl-10"
                  value={formData.stop_loss || ''}
                  onChange={(e) => setFormData({ ...formData, stop_loss: parseFloat(e.target.value) || undefined })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="take_profit">Take Profit (Optional)</Label>
              <div className="relative">
                <TrendingUp className="absolute left-3 top-3 h-4 w-4 text-profit" />
                <Input
                  id="take_profit"
                  type="number"
                  step="0.0001"
                  className="pl-10"
                  value={formData.take_profit || ''}
                  onChange={(e) => setFormData({ ...formData, take_profit: parseFloat(e.target.value) || undefined })}
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