import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  DollarSign,
  Percent,
  BarChart3,
  Calculator,
  Trophy
} from 'lucide-react';
import { Trade, Portfolio, calculatePnL, formatCurrency } from '@/types/trading';

interface PortfolioStatsProps {
  trades: Trade[];
}

export function PortfolioStats({ trades }: PortfolioStatsProps) {
  const calculatePortfolioStats = (trades: Trade[]): Portfolio => {
    const closedTrades = trades.filter(trade => trade.status === 'CLOSED');
    const totalTrades = closedTrades.length;
    
    if (totalTrades === 0) {
      return {
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        winRate: 0,
        totalProfit: 0,
        totalFees: trades.reduce((sum, trade) => sum + trade.fees, 0),
        netProfit: 0,
        averageWin: 0,
        averageLoss: 0,
        profitFactor: 0,
      };
    }

    const pnlResults = closedTrades.map(calculatePnL);
    const winningTrades = pnlResults.filter(pnl => pnl > 0);
    const losingTrades = pnlResults.filter(pnl => pnl < 0);
    
    const totalProfit = pnlResults.reduce((sum, pnl) => sum + (pnl > 0 ? pnl : 0), 0);
    const totalLoss = Math.abs(pnlResults.reduce((sum, pnl) => sum + (pnl < 0 ? pnl : 0), 0));
    const totalFees = trades.reduce((sum, trade) => sum + trade.fees, 0);
    const netProfit = pnlResults.reduce((sum, pnl) => sum + pnl, 0);
    
    return {
      totalTrades,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate: (winningTrades.length / totalTrades) * 100,
      totalProfit,
      totalFees,
      netProfit,
      averageWin: winningTrades.length > 0 ? totalProfit / winningTrades.length : 0,
      averageLoss: losingTrades.length > 0 ? totalLoss / losingTrades.length : 0,
      profitFactor: totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? Infinity : 0,
    };
  };

  const stats = calculatePortfolioStats(trades);
  const openTrades = trades.filter(trade => trade.status === 'OPEN').length;
  const pendingTrades = trades.filter(trade => trade.status === 'PENDING').length;

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    description, 
    trend, 
    className = "" 
  }: {
    title: string;
    value: string | number;
    icon: any;
    description?: string;
    trend?: 'up' | 'down' | 'neutral';
    className?: string;
  }) => (
    <Card className={`trading-card ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <div className={`p-3 rounded-lg ${
            trend === 'up' ? 'bg-profit/10 text-profit' :
            trend === 'down' ? 'bg-loss/10 text-loss' :
            'bg-muted text-muted-foreground'
          }`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Net P&L"
          value={formatCurrency(stats.netProfit)}
          icon={stats.netProfit >= 0 ? TrendingUp : TrendingDown}
          trend={stats.netProfit >= 0 ? 'up' : 'down'}
          description="Total profit/loss"
        />
        
        <StatCard
          title="Win Rate"
          value={`${stats.winRate.toFixed(1)}%`}
          icon={Target}
          trend={stats.winRate >= 60 ? 'up' : stats.winRate >= 40 ? 'neutral' : 'down'}
          description={`${stats.winningTrades}/${stats.totalTrades} trades`}
        />
        
        <StatCard
          title="Profit Factor"
          value={stats.profitFactor === Infinity ? '∞' : stats.profitFactor.toFixed(2)}
          icon={Calculator}
          trend={stats.profitFactor >= 2 ? 'up' : stats.profitFactor >= 1 ? 'neutral' : 'down'}
          description="Gross profit / Gross loss"
        />
        
        <StatCard
          title="Total Trades"
          value={trades.length}
          icon={BarChart3}
          description={`${openTrades} open, ${pendingTrades} pending`}
        />
      </div>

      {/* Detailed Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="trading-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Performance Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Win Rate</span>
              <div className="flex items-center gap-2">
                <Progress value={stats.winRate} className="w-20" />
                <span className="text-sm font-medium">{stats.winRate.toFixed(1)}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Winning Trades</span>
              <Badge className="profit-indicator">
                {stats.winningTrades}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Losing Trades</span>
              <Badge className="loss-indicator">
                {stats.losingTrades}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Average Win</span>
              <span className="text-sm font-medium text-profit">
                {formatCurrency(stats.averageWin)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Average Loss</span>
              <span className="text-sm font-medium text-loss">
                {formatCurrency(stats.averageLoss)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="trading-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Financial Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Gross Profit</span>
              <span className="text-sm font-medium text-profit">
                {formatCurrency(stats.totalProfit)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Fees</span>
              <span className="text-sm font-medium text-muted-foreground">
                {formatCurrency(stats.totalFees)}
              </span>
            </div>
            
            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Net Profit</span>
                <span className={`text-sm font-bold ${
                  stats.netProfit >= 0 ? 'text-profit' : 'text-loss'
                }`}>
                  {formatCurrency(stats.netProfit)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Return %</span>
              <span className={`text-sm font-medium ${
                stats.netProfit >= 0 ? 'text-profit' : 'text-loss'
              }`}>
                {/* This would need initial capital to calculate properly */}
                N/A
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Performance Indicators */}
      {stats.totalTrades > 0 && (
        <Card className="trading-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="w-5 h-5 text-primary" />
              Performance Indicators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-card-elevated">
                <div className={`text-2xl font-bold ${
                  stats.profitFactor >= 2 ? 'text-profit' : 
                  stats.profitFactor >= 1 ? 'text-neutral' : 'text-loss'
                }`}>
                  {stats.profitFactor === Infinity ? '∞' : stats.profitFactor.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Profit Factor</div>
                <div className="text-xs text-muted-foreground">
                  {stats.profitFactor >= 2 ? 'Excellent' : 
                   stats.profitFactor >= 1.5 ? 'Good' :
                   stats.profitFactor >= 1 ? 'Break Even' : 'Poor'}
                </div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-card-elevated">
                <div className={`text-2xl font-bold ${
                  stats.winRate >= 60 ? 'text-profit' :
                  stats.winRate >= 40 ? 'text-neutral' : 'text-loss'
                }`}>
                  {stats.winRate.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground mt-1">Win Rate</div>
                <div className="text-xs text-muted-foreground">
                  {stats.winRate >= 60 ? 'Excellent' :
                   stats.winRate >= 50 ? 'Good' :
                   stats.winRate >= 40 ? 'Average' : 'Needs Work'}
                </div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-card-elevated">
                <div className={`text-2xl font-bold ${
                  stats.averageWin > stats.averageLoss ? 'text-profit' : 'text-loss'
                }`}>
                  {stats.averageLoss > 0 ? (stats.averageWin / stats.averageLoss).toFixed(2) : '∞'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Reward:Risk</div>
                <div className="text-xs text-muted-foreground">
                  {stats.averageWin > stats.averageLoss * 2 ? 'Excellent' :
                   stats.averageWin > stats.averageLoss ? 'Good' : 'Improve Risk Management'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}