import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  BarChart3, 
  TrendingUp, 
  BookOpen,
  Settings,
  Target,
  DollarSign
} from 'lucide-react';
import { TradeForm } from '@/components/trading/TradeForm';
import { TradeList } from '@/components/trading/TradeList';
import { PortfolioStats } from '@/components/trading/PortfolioStats';
import { Trade } from '@/types/trading';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockTrades: Trade[] = [
      {
        id: '1',
        userId: 'user1',
        assetType: 'FOREX',
        symbol: 'EUR/USD',
        assetName: 'Euro/US Dollar',
        tradeType: 'BUY',
        status: 'CLOSED',
        entryPrice: 1.0850,
        exitPrice: 1.0920,
        quantity: 100000,
        entryDate: '2024-01-15',
        exitDate: '2024-01-16',
        stopLoss: 1.0800,
        takeProfit: 1.0950,
        fees: 15,
        notes: 'EUR strength after ECB announcement',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        userId: 'user1',
        assetType: 'COMMODITY',
        symbol: 'GC',
        assetName: 'Gold Futures',
        tradeType: 'BUY',
        status: 'OPEN',
        entryPrice: 2050.50,
        quantity: 10,
        entryDate: '2024-01-20',
        stopLoss: 2000.00,
        takeProfit: 2150.00,
        fees: 25,
        notes: 'Inflation hedge play',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        userId: 'user1',
        assetType: 'STOCK',
        symbol: 'AAPL',
        assetName: 'Apple Inc.',
        tradeType: 'BUY',
        status: 'CLOSED',
        entryPrice: 180.25,
        exitPrice: 175.80,
        quantity: 50,
        entryDate: '2024-01-10',
        exitDate: '2024-01-18',
        fees: 10,
        notes: 'Earnings disappointment',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    setTrades(mockTrades);
  }, []);

  const handleAddTrade = async (tradeData: Partial<Trade>) => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      const newTrade: Trade = {
        ...tradeData,
        id: Date.now().toString(),
        userId: 'user1',
        status: 'OPEN',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Trade;

      setTrades(prev => [newTrade, ...prev]);
      setActiveTab('trades');
    } catch (error) {
      console.error('Error adding trade:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleEditTrade = async (tradeData: Partial<Trade>) => {
    if (!editingTrade) return;
    
    setLoading(true);
    try {
      const updatedTrade: Trade = {
        ...editingTrade,
        ...tradeData,
        updatedAt: new Date().toISOString(),
      };

      setTrades(prev => 
        prev.map(trade => trade.id === editingTrade.id ? updatedTrade : trade)
      );
      setEditingTrade(null);
      setActiveTab('trades');
    } catch (error) {
      console.error('Error updating trade:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrade = (tradeId: string) => {
    setTrades(prev => prev.filter(trade => trade.id !== tradeId));
    toast({
      title: "Trade Deleted",
      description: "Trade has been removed from your journal",
    });
  };

  const openTrades = trades.filter(trade => trade.status === 'OPEN').length;
  const totalTrades = trades.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Trading Pulse Journal</h1>
                <p className="text-sm text-muted-foreground">
                  Professional trading analytics & journal
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">{totalTrades}</div>
                  <div className="text-xs text-muted-foreground">Total Trades</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-profit">{openTrades}</div>
                  <div className="text-xs text-muted-foreground">Open Positions</div>
                </div>
              </div>
              
              <Button 
                onClick={() => {
                  setEditingTrade(null);
                  setActiveTab('add-trade');
                }}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Trade
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-4 mx-auto lg:mx-0">
            <TabsTrigger value="overview" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="trades" className="gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Trades</span>
            </TabsTrigger>
            <TabsTrigger value="add-trade" className="gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              {/* Welcome Section */}
              <Card className="trading-card bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Portfolio Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{totalTrades}</div>
                      <div className="text-sm text-muted-foreground">Total Trades</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-profit">{openTrades}</div>
                      <div className="text-sm text-muted-foreground">Open Positions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neutral">
                        {trades.filter(t => t.assetType === 'FOREX').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Forex Trades</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-400">
                        {trades.filter(t => t.assetType === 'COMMODITY').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Commodities</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <PortfolioStats trades={trades} />
            </div>
          </TabsContent>

          <TabsContent value="trades">
            <TradeList
              trades={trades}
              onEdit={(trade) => {
                setEditingTrade(trade);
                setActiveTab('add-trade');
              }}
              onDelete={handleDeleteTrade}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="add-trade">
            <TradeForm
              onSubmit={editingTrade ? handleEditTrade : handleAddTrade}
              initialData={editingTrade || undefined}
              isEditing={!!editingTrade}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <PortfolioStats trades={trades} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;