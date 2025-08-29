import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';

// Interface matching the new secure trades table
export interface DatabaseTrade {
  id: string;
  user_id: string;
  asset: string;
  trade_type: string;
  price: number;
  quantity: number;
  stop_loss?: number;
  take_profit?: number;
  profit_loss?: number;
  status: string;
  notes?: string;
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
        .order('created_at', { ascending: false });

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

    console.log('useTrades.addTrade called with:', tradeData);

    try {
      // Ensure required fields are present
      const requiredData = {
        asset: tradeData.asset || '',
        trade_type: tradeData.trade_type || 'BUY',
        price: tradeData.price || 0,
        quantity: tradeData.quantity || 1,
        stop_loss: tradeData.stop_loss,
        take_profit: tradeData.take_profit,
        profit_loss: tradeData.profit_loss || 0,
        status: tradeData.status || 'open',
        notes: tradeData.notes,
        user_id: user.id,
      };
      
      console.log('Processed trade data for insert:', requiredData);

      const { data, error } = await supabase
        .from('trades')
        .insert(requiredData)
        .select()
        .single();

      console.log('Supabase insert result:', { data, error });

      if (error) throw error;

      setTrades(prev => [data, ...prev]);
      console.log('Trade added successfully to state');
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