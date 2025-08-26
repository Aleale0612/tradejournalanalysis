import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';

export interface DatabaseTrade {
  id: string;
  user_id: string;
  portfolio_id: string;
  symbol: string;
  trade_type: string;
  status: string;
  entry_price: number;
  exit_price?: number;
  quantity: number;
  entry_date: string;
  exit_date?: string;
  profit_loss?: number;
  fees: number;
  strategy?: string;
  setup_description?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export function useTrades() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [trades, setTrades] = useState<DatabaseTrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch trades
  const fetchTrades = async () => {
    if (!user) {
      setTrades([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', user.id)
        .order('entry_date', { ascending: false });

      if (error) {
        throw error;
      }

      setTrades(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching trades:', err);
      setError(err.message);
      toast({
        title: "Error loading trades",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add trade
  const addTrade = async (tradeData: Partial<DatabaseTrade>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Get or create default portfolio
      let portfolio_id = await getDefaultPortfolio();

      // Ensure required fields are present
      const requiredData = {
        symbol: tradeData.symbol || '',
        trade_type: tradeData.trade_type || 'BUY',
        status: tradeData.status || 'open',
        entry_price: tradeData.entry_price || 0,
        exit_price: tradeData.exit_price,
        quantity: tradeData.quantity || 1,
        entry_date: tradeData.entry_date || new Date().toISOString().split('T')[0],
        exit_date: tradeData.exit_date,
        fees: tradeData.fees || 0,
        strategy: tradeData.strategy,
        setup_description: tradeData.setup_description,
        tags: tradeData.tags,
        user_id: user.id,
        portfolio_id,
      };

      const { data, error } = await supabase
        .from('trades')
        .insert(requiredData)
        .select()
        .single();

      if (error) throw error;

      setTrades(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      console.error('Error adding trade:', err);
      throw err;
    }
  };

  // Update trade
  const updateTrade = async (id: string, updates: Partial<DatabaseTrade>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('trades')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setTrades(prev => prev.map(trade => 
        trade.id === id ? data : trade
      ));
      return data;
    } catch (err: any) {
      console.error('Error updating trade:', err);
      throw err;
    }
  };

  // Delete trade
  const deleteTrade = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('trades')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setTrades(prev => prev.filter(trade => trade.id !== id));
    } catch (err: any) {
      console.error('Error deleting trade:', err);
      throw err;
    }
  };

  // Get or create default portfolio
  const getDefaultPortfolio = async (): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Check if user has any portfolios
      const { data: existingPortfolios, error: fetchError } = await supabase
        .from('portfolios')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      if (fetchError) throw fetchError;

      if (existingPortfolios && existingPortfolios.length > 0) {
        return existingPortfolios[0].id;
      }

      // Create default portfolio
      const { data, error } = await supabase
        .from('portfolios')
        .insert({
          user_id: user.id,
          name: 'Default Portfolio',
          initial_balance: 10000,
          current_balance: 10000,
          currency: 'USD',
          is_active: true
        })
        .select('id')
        .single();

      if (error) throw error;

      return data.id;
    } catch (err: any) {
      console.error('Error with portfolio:', err);
      throw err;
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('trades-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trades',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time trade update:', payload);
          // Refetch trades to ensure consistency
          fetchTrades();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Initial fetch
  useEffect(() => {
    fetchTrades();
  }, [user]);

  return {
    trades,
    loading,
    error,
    addTrade,
    updateTrade,
    deleteTrade,
    refetch: fetchTrades
  };
}