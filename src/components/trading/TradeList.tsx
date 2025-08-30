import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  TrendingUp,
  TrendingDown,
  Calendar,
  Target
} from 'lucide-react';
import { Trade, TradeStatus, formatCurrency } from '@/types/trading';

interface TradeListProps {
  trades: Trade[];
  onEdit: (trade: Trade) => void;
  onDelete: (tradeId: string) => void;
  loading?: boolean;
}

export function TradeList({ trades, onEdit, onDelete, loading = false }: TradeListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<TradeStatus | 'ALL'>('ALL');

  const filteredTrades = trades.filter(trade => {
    const matchesSearch = trade.asset?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || trade.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getTradeTypeBadge = (tradeType: string) => {
    return tradeType === 'BUY' ? (
      <Badge className="profit-indicator text-xs">
        <TrendingUp className="w-3 h-3 mr-1" />
        BUY
      </Badge>
    ) : (
      <Badge className="loss-indicator text-xs">
        <TrendingDown className="w-3 h-3 mr-1" />
        SELL
      </Badge>
    );
  };

  const getStatusBadge = (status: TradeStatus) => {
    const variants = {
      open: 'default',
      closed: 'secondary',
      cancelled: 'outline',
    } as const;

    return (
      <Badge variant={variants[status]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const getPnLDisplay = (trade: Trade) => {
    if (trade.status !== 'closed' || !trade.profit_loss) return '-';
    
    const isProfit = trade.profit_loss > 0;
    return (
      <span className={isProfit ? 'text-profit font-medium' : 'text-loss font-medium'}>
        {formatCurrency(trade.profit_loss)}
      </span>
    );
  };

  if (loading) {
    return (
      <Card className="trading-card">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading trades...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="trading-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Trade History
            <Badge variant="outline">{filteredTrades.length}</Badge>
          </div>
        </CardTitle>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by asset symbol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={filterStatus} onValueChange={(value: TradeStatus | 'ALL') => setFilterStatus(value)}>
              <SelectTrigger className="w-32">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {filteredTrades.length === 0 ? (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No trades found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterStatus !== 'ALL'
                ? 'Try adjusting your filters'
                : 'Add your first trade to get started'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>P&L</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrades.map((trade) => (
                  <TableRow key={trade.id} className="hover:bg-card-elevated">
                    <TableCell>
                      <div className="font-mono font-medium text-sm">{trade.asset}</div>
                    </TableCell>
                    
                    <TableCell>
                      {getTradeTypeBadge(trade.trade_type)}
                    </TableCell>
                    
                    <TableCell className="font-mono text-sm">
                      {formatCurrency(trade.price)}
                    </TableCell>
                    
                    <TableCell className="font-mono text-sm">
                      {trade.quantity.toLocaleString()}
                    </TableCell>
                    
                    <TableCell>
                      {getPnLDisplay(trade)}
                    </TableCell>
                    
                    <TableCell>
                      {getStatusBadge(trade.status)}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {trade.created_at ? new Date(trade.created_at).toLocaleDateString() : 'N/A'}
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(trade)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(trade.id!)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}