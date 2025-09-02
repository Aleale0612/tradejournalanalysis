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
  User,
  MessageCircle
} from 'lucide-react';
import { PortfolioStats } from '@/components/trading/PortfolioStats';
import { TradeForm } from '@/components/trading/TradeForm';
import { TradeList } from '@/components/trading/TradeList';
import { TradingViewWidget } from '@/components/charts/TradingViewWidget';
import RiskCalculator from '@/components/trading/RiskCalculator';
import { TradingAssistant } from '@/components/trading/TradingAssistant';
import { FloatingActionButton } from '@/components/ui/floating-action-button';
import { useAuth } from '@/components/auth/AuthProvider';
import { useTrades, DatabaseTrade } from '@/hooks/useTrades';
import { useToast } from '@/hooks/use-toast';
import { Trade } from '@/types/trading';

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { trades, loading, addTrade, updateTrade, deleteTrade } = useTrades();
  const { toast } = useToast();
  const [editingTrade, setEditingTrade] = useState<DatabaseTrade | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

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

  const handleAddTrade = async (tradeData: Partial<Trade>) => {
    console.log('handleAddTrade called with:', tradeData);
    try {
      await addTrade(tradeData);
      console.log('addTrade completed successfully');
      setActiveTab('trades');
      toast({
        title: "Trade Added",
        description: `Successfully added ${tradeData.asset} trade`,
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

  const handleEditTrade = async (tradeData: Partial<Trade>) => {
    if (!editingTrade) return;
    
    try {
      await updateTrade(editingTrade.id, tradeData);
      setEditingTrade(null);
      setActiveTab('trades');
      toast({
        title: "Trade Updated",
        description: `Successfully updated ${tradeData.asset} trade`,
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

  // Convert DatabaseTrade to Trade for components
  const convertedTrades: Trade[] = trades.map(trade => ({
    id: trade.id,
    user_id: trade.user_id,
    asset: trade.asset,
    trade_type: trade.trade_type as 'BUY' | 'SELL',
    price: trade.price,
    quantity: trade.quantity,
    stop_loss: trade.stop_loss,
    take_profit: trade.take_profit,
    profit_loss: trade.profit_loss,
    status: trade.status as 'open' | 'closed' | 'cancelled',
    notes: trade.notes,
    created_at: trade.created_at,
    updated_at: trade.updated_at,
  }));

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
                  Trading journal for better decisions
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
                        {trades.filter(t => t.asset?.includes('USD')).length}
                      </div>
                      <div className="text-sm text-muted-foreground">USD Pairs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-400">
                        {trades.filter(t => t.asset?.includes('XAU')).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Gold Trades</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <PortfolioStats trades={convertedTrades} />
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
              trades={convertedTrades}
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
                asset: editingTrade.asset,
                trade_type: editingTrade.trade_type as 'BUY' | 'SELL',
                price: editingTrade.price,
                quantity: editingTrade.quantity,
                stop_loss: editingTrade.stop_loss,
                take_profit: editingTrade.take_profit,
                notes: editingTrade.notes,
              } : undefined}
              isEditing={!!editingTrade}
            />
          </TabsContent>

          <TabsContent value="risk-calculator">
            <RiskCalculator />
          </TabsContent>
        </Tabs>
      </main>

      {/* AI Trading Assistant */}
      <TradingAssistant
        trades={convertedTrades}
        isOpen={isAIAssistantOpen}
        onToggle={() => setIsAIAssistantOpen(!isAIAssistantOpen)}
      />

      {/* Floating Action Button for AI Assistant */}
      {!isAIAssistantOpen && (
        <FloatingActionButton
          onClick={() => setIsAIAssistantOpen(true)}
          icon={<MessageCircle className="w-6 h-6" />}
          isActive={isAIAssistantOpen}
        />
      )}
    </div>
  );
};

export default Index;