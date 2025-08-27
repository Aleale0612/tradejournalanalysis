import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Save, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

interface RiskCalculation {
  id?: string;
  account_balance_idr: number;
  risk_percentage: number;
  entry_price: number;
  stop_loss: number;
  take_profit?: number;
  lot_size: number;
  risk_amount_idr: number;
  reward_amount_idr?: number;
  risk_reward_ratio?: number;
  symbol: string;
  created_at?: string;
}

export default function RiskCalculator() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [calculation, setCalculation] = useState<RiskCalculation>({
    account_balance_idr: 10000000, // 10 juta IDR default
    risk_percentage: 2,
    entry_price: 0,
    stop_loss: 0,
    take_profit: 0,
    lot_size: 0.01,
    risk_amount_idr: 0,
    reward_amount_idr: 0,
    risk_reward_ratio: 0,
    symbol: 'XAUUSD'
  });

  const [history, setHistory] = useState<RiskCalculation[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Format currency in IDR
  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate risk and reward
  const calculateRisk = () => {
    const { account_balance_idr, risk_percentage, entry_price, stop_loss, take_profit } = calculation;
    
    if (!account_balance_idr || !risk_percentage || !entry_price || !stop_loss) {
      return;
    }

    // Calculate risk amount in IDR
    const risk_amount_idr = (account_balance_idr * risk_percentage) / 100;
    
    // Calculate pip value (assuming XAUUSD - 1 pip = $0.01 for 0.01 lot)
    const pip_difference_risk = Math.abs(entry_price - stop_loss);
    
    // Calculate lot size based on risk
    // For XAUUSD: 1 lot = $1 per pip, so 0.01 lot = $0.01 per pip
    // Convert USD to IDR (assuming 1 USD = 15,000 IDR)
    const usd_to_idr = 15000;
    const pip_value_idr_per_001_lot = 0.01 * usd_to_idr; // 0.01 USD * 15000 = 150 IDR per 0.01 lot per pip
    
    const calculated_lot_size = risk_amount_idr / (pip_difference_risk * pip_value_idr_per_001_lot * 100);
    
    let reward_amount_idr = 0;
    let risk_reward_ratio = 0;
    
    if (take_profit && take_profit > 0) {
      const pip_difference_reward = Math.abs(take_profit - entry_price);
      reward_amount_idr = calculated_lot_size * pip_difference_reward * pip_value_idr_per_001_lot * 100;
      risk_reward_ratio = reward_amount_idr / risk_amount_idr;
    }

    setCalculation(prev => ({
      ...prev,
      lot_size: Math.round(calculated_lot_size * 100) / 100, // Round to 2 decimal places
      risk_amount_idr,
      reward_amount_idr,
      risk_reward_ratio: Math.round(risk_reward_ratio * 100) / 100
    }));
  };

  // Auto-calculate when values change
  useEffect(() => {
    calculateRisk();
  }, [calculation.account_balance_idr, calculation.risk_percentage, calculation.entry_price, calculation.stop_loss, calculation.take_profit]);

  // Save calculation to database
  const saveCalculation = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save calculations.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('risk_calculations')
        .insert([{
          user_id: user.id,
          ...calculation
        }]);

      if (error) throw error;

      toast({
        title: "Calculation Saved",
        description: "Risk calculation has been saved successfully.",
      });

      loadHistory();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Load calculation history
  const loadHistory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('risk_calculations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setHistory(data || []);
    } catch (error: any) {
      console.error('Error loading history:', error);
    }
  };

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const symbols = [
    'XAUUSD', 'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD'
  ];

  return (
    <div className="space-y-6">
      <Card className="trading-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Kalkulator Manajemen Risiko (IDR)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Account Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="balance">Saldo Akun (IDR)</Label>
              <Input
                id="balance"
                type="number"
                value={calculation.account_balance_idr}
                onChange={(e) => setCalculation(prev => ({
                  ...prev,
                  account_balance_idr: Number(e.target.value)
                }))}
                placeholder="10000000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="risk-percent">Persentase Risiko (%)</Label>
              <Input
                id="risk-percent"
                type="number"
                step="0.1"
                value={calculation.risk_percentage}
                onChange={(e) => setCalculation(prev => ({
                  ...prev,
                  risk_percentage: Number(e.target.value)
                }))}
                placeholder="2"
              />
            </div>
          </div>

          {/* Trade Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Select
                value={calculation.symbol}
                onValueChange={(value) => setCalculation(prev => ({
                  ...prev,
                  symbol: value
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {symbols.map(symbol => (
                    <SelectItem key={symbol} value={symbol}>
                      {symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="entry-price">Harga Entry</Label>
              <Input
                id="entry-price"
                type="number"
                step="0.00001"
                value={calculation.entry_price}
                onChange={(e) => setCalculation(prev => ({
                  ...prev,
                  entry_price: Number(e.target.value)
                }))}
                placeholder="2024.50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stop-loss">Stop Loss</Label>
              <Input
                id="stop-loss"
                type="number"
                step="0.00001"
                value={calculation.stop_loss}
                onChange={(e) => setCalculation(prev => ({
                  ...prev,
                  stop_loss: Number(e.target.value)
                }))}
                placeholder="2020.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="take-profit">Take Profit (Opsional)</Label>
              <Input
                id="take-profit"
                type="number"
                step="0.00001"
                value={calculation.take_profit || ''}
                onChange={(e) => setCalculation(prev => ({
                  ...prev,
                  take_profit: Number(e.target.value) || undefined
                }))}
                placeholder="2030.00"
              />
            </div>
          </div>

          {/* Results */}
          <div className="p-4 bg-muted rounded-lg space-y-3">
            <h3 className="font-semibold">Hasil Perhitungan:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Lot Size</p>
                <p className="text-lg font-semibold">{calculation.lot_size.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Risiko (IDR)</p>
                <p className="text-lg font-semibold text-red-600">
                  {formatIDR(calculation.risk_amount_idr)}
                </p>
              </div>
              {calculation.reward_amount_idr && calculation.reward_amount_idr > 0 && (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Reward (IDR)</p>
                    <p className="text-lg font-semibold text-green-600">
                      {formatIDR(calculation.reward_amount_idr)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Risk:Reward</p>
                    <p className="text-lg font-semibold">
                      1:{calculation.risk_reward_ratio?.toFixed(2)}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={saveCalculation} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Simpan Perhitungan
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowHistory(!showHistory)}
            >
              <History className="w-4 h-4 mr-2" />
              Riwayat
            </Button>
          </div>

          {/* History */}
          {showHistory && (
            <div className="space-y-3">
              <h3 className="font-semibold">Riwayat Perhitungan:</h3>
              {history.length === 0 ? (
                <p className="text-muted-foreground">Belum ada riwayat perhitungan.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {history.map((calc) => (
                    <div key={calc.id} className="p-3 border rounded-lg text-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{calc.symbol}</span>
                        <span className="text-muted-foreground">
                          {new Date(calc.created_at!).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>Lot: {calc.lot_size}</div>
                        <div>Risiko: {formatIDR(calc.risk_amount_idr)}</div>
                        <div>R:R: 1:{calc.risk_reward_ratio?.toFixed(2) || 'N/A'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}