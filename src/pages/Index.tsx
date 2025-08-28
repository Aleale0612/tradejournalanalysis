import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
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
  DollarSign,
  LogOut,
  User
} from 'lucide-react';
import { PortfolioStats } from '@/components/trading/PortfolioStats';
import { TradeForm } from '@/components/trading/TradeForm';
import { TradeList } from '@/components/trading/TradeList';
import { TradingViewWidget } from '@/components/charts/TradingViewWidget';
import RiskCalculator from '@/components/trading/RiskCalculator';
import { useAuth } from '@/components/auth/AuthProvider';
import { useTrades, DatabaseTrade } from '@/hooks/useTrades';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { trades, loading, addTrade, updateTrade, deleteTrade } = useTrades();
  const { toast } = useToast();
  const [editingTrade, setEditingTrade] = useState<DatabaseTrade | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect to auth if not logged in
  if (!authLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handleAddTrade = async (tradeData: any) => {
    console.log('handleAddTrade called with:', tradeData);
    try {
      const dbTradeData = {
        symbol: tradeData.symbol,
        trade_type: tradeData.tradeType,
        status: tradeData.status || 'open',
        entry_price: tradeData.entryPrice,
        exit_price: tradeData.exitPrice,
        quantity: tradeData.quantity,
        entry_date: tradeData.entryDate ? new Date(tradeData.entryDate).toISOString() : new Date().toISOString(),
        exit_date: tradeData.exitDate ? new Date(tradeData.exitDate).toISOString() : null,
        fees: tradeData.fees || 0,
        stop_loss: tradeData.stopLoss || null,
        take_profit: tradeData.takeProfit || null,
        strategy: tradeData.strategy || null,
        setup_description: tradeData.notes || null,
        tags: tradeData.tags || null
      };
      
      console.log('Calling addTrade with transformed data:', dbTradeData);
      await addTrade(dbTradeData);
      console.log('addTrade completed successfully');
      setActiveTab('trades');
      toast({
        title: "Trade Added",
        description: `Successfully added ${tradeData.symbol} trade`,
      });
    } catch (error: any) {
      console.error('Error adding trade:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add trade",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleEditTrade = async (tradeData: any) => {
    if (!editingTrade) return;
    
    try {
      await updateTrade(editingTrade.id, {
        symbol: tradeData.symbol,
        trade_type: tradeData.tradeType,
        status: tradeData.status || 'open',
        entry_price: tradeData.entryPrice,
        exit_price: tradeData.exitPrice,
        quantity: tradeData.quantity,
        entry_date: tradeData.entryDate ? new Date(tradeData.entryDate).toISOString() : editingTrade.entry_date,
        exit_date: tradeData.exitDate ? new Date(tradeData.exitDate).toISOString() : null,
        fees: tradeData.fees || 0,
        stop_loss: tradeData.stopLoss || null,
        take_profit: tradeData.takeProfit || null,
        strategy: tradeData.strategy || null,
        setup_description: tradeData.notes || null,
        tags: tradeData.tags || null
      });
      
      setEditingTrade(null);
      setActiveTab('trades');
      toast({
        title: "Trade Updated",
        description: `Successfully updated ${tradeData.symbol} trade`,
      });
    } catch (error: any) {
      console.error('Error updating trade:', error);
      toast({
        title: "Error",
        description: "Failed to update trade",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleDeleteTrade = async (tradeId: string) => {
    try {
      await deleteTrade(tradeId);
      toast({
        title: "Trade Deleted",
        description: "Trade has been removed from your journal",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete trade",
        variant: "destructive",
      });
    }
  };

  const openTrades = trades.filter(trade => trade.status === 'open').length;
  const totalTrades = trades.length;

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

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
                <h1 className="text-2xl font-bold">JournalPaper</h1>
                <p className="text-sm text-muted-foreground">
                 Journaling One Step for the futures.
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
              
              <div className="flex items-center gap-2">
                {user && (
                  <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    {user.email}
                  </div>
                )}
                
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
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-5 mx-auto lg:mx-0">
            <TabsTrigger value="overview" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="charts" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Charts</span>
            </TabsTrigger>
            <TabsTrigger value="trades" className="gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Trades</span>
            </TabsTrigger>
            <TabsTrigger value="add-trade" className="gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add</span>
            </TabsTrigger>
            <TabsTrigger value="risk-calculator" className="gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Risk Calc</span>
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
                        {trades.filter(t => t.symbol?.includes('/')).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Forex Trades</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-400">
                        {trades.filter(t => t.symbol?.includes('XAUUSD') || t.symbol?.includes('DXY')).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Commodities</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <PortfolioStats trades={trades.map(trade => ({
                id: trade.id,
                userId: trade.user_id,
                assetType: trade.symbol?.includes('/') ? 'FOREX' as const : 
                          trade.symbol?.includes('XAUUSD') || trade.symbol?.includes('DXY') ? 'COMMODITY' as const :
                          'STOCK' as const,
                symbol: trade.symbol,
                assetName: trade.symbol,
                tradeType: trade.trade_type === 'BUY' ? 'BUY' as const : 'SELL' as const,
                status: trade.status === 'open' ? 'OPEN' as const : 
                       trade.status === 'closed' ? 'CLOSED' as const : 'PENDING' as const,
                entryPrice: trade.entry_price,
                exitPrice: trade.exit_price,
                quantity: trade.quantity,
                entryDate: trade.entry_date,
                exitDate: trade.exit_date,
                fees: trade.fees,
                notes: trade.setup_description,
                createdAt: trade.created_at,
                updatedAt: trade.updated_at,
              }))} />
            </div>
          </TabsContent>

          <TabsContent value="charts">
            <div className="space-y-6">
              <TradingViewWidget
                symbol="PEPPERSTONE:XAUUSD"
                title="Gold/USD (XAUUSD) - Pepperstone"
                height="600"
              />
            </div>
          </TabsContent>


          <TabsContent value="trades">
            <TradeList
              trades={trades.map(trade => ({
                id: trade.id,
                userId: trade.user_id,
                assetType: trade.symbol?.includes('/') ? 'FOREX' as const : 
                          trade.symbol?.includes('XAUUSD') || trade.symbol?.includes('DXY') ? 'COMMODITY' as const :
                          'STOCK' as const,
                symbol: trade.symbol,
                assetName: trade.symbol,
                tradeType: trade.trade_type === 'BUY' ? 'BUY' as const : 'SELL' as const,
                status: trade.status === 'open' ? 'OPEN' as const : 
                       trade.status === 'closed' ? 'CLOSED' as const : 'PENDING' as const,
                entryPrice: trade.entry_price,
                exitPrice: trade.exit_price,
                quantity: trade.quantity,
                entryDate: trade.entry_date,
                exitDate: trade.exit_date,
                fees: trade.fees,
                notes: trade.setup_description,
                createdAt: trade.created_at,
                updatedAt: trade.updated_at,
              }))}
              onEdit={(trade) => {
                const dbTrade = trades.find(t => t.id === trade.id);
                if (dbTrade) {
                  setEditingTrade(dbTrade);
                  setActiveTab('add-trade');
                }
              }}
              onDelete={handleDeleteTrade}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="add-trade">
            <TradeForm
              onSubmit={editingTrade ? handleEditTrade : handleAddTrade}
              initialData={editingTrade ? {
                symbol: editingTrade.symbol,
                tradeType: editingTrade.trade_type === 'BUY' ? 'BUY' : 'SELL',
                entryPrice: editingTrade.entry_price,
                exitPrice: editingTrade.exit_price,
                quantity: editingTrade.quantity,
                entryDate: editingTrade.entry_date ? new Date(editingTrade.entry_date).toISOString().split('T')[0] : '',
                exitDate: editingTrade.exit_date ? new Date(editingTrade.exit_date).toISOString().split('T')[0] : '',
                fees: editingTrade.fees,
                stopLoss: editingTrade.stop_loss,
                takeProfit: editingTrade.take_profit,
                notes: editingTrade.setup_description,
              } : undefined}
              isEditing={!!editingTrade}
            />
          </TabsContent>

          <TabsContent value="risk-calculator">
            <RiskCalculator />
          </TabsContent>

          <TabsContent value="analytics">
            <PortfolioStats trades={trades.map(trade => ({
              id: trade.id,
              userId: trade.user_id,
              assetType: trade.symbol?.includes('/') ? 'FOREX' as const : 
                        trade.symbol?.includes('XAUUSD') || trade.symbol?.includes('DXY') ? 'COMMODITY' as const :
                        'STOCK' as const,
              symbol: trade.symbol,
              assetName: trade.symbol,
              tradeType: trade.trade_type === 'BUY' ? 'BUY' as const : 'SELL' as const,
              status: trade.status === 'open' ? 'OPEN' as const : 
                     trade.status === 'closed' ? 'CLOSED' as const : 'PENDING' as const,
              entryPrice: trade.entry_price,
              exitPrice: trade.exit_price,
              quantity: trade.quantity,
              entryDate: trade.entry_date,
              exitDate: trade.exit_date,
              fees: trade.fees,
              notes: trade.setup_description,
              createdAt: trade.created_at,
              updatedAt: trade.updated_at,
            }))} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;