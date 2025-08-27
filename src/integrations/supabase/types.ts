export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      chat_messages: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          role: string | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          role?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          role?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string | null
          id: string
          session_name: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          session_name?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          session_name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      embeddings: {
        Row: {
          created_at: string | null
          embedding: string | null
          id: string
          item_id: string | null
          item_type: string | null
          text_content: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          embedding?: string | null
          id?: string
          item_id?: string | null
          item_type?: string | null
          text_content?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          embedding?: string | null
          id?: string
          item_id?: string | null
          item_type?: string | null
          text_content?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      portfolio_snapshots: {
        Row: {
          balance: number | null
          equity: number | null
          id: string
          positions: Json | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          balance?: number | null
          equity?: number | null
          id?: string
          positions?: Json | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          balance?: number | null
          equity?: number | null
          id?: string
          positions?: Json | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      portfolios: {
        Row: {
          account_type: string | null
          broker: string | null
          created_at: string
          currency: string
          current_balance: number
          description: string | null
          id: string
          initial_balance: number
          is_active: boolean | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_type?: string | null
          broker?: string | null
          created_at?: string
          currency?: string
          current_balance?: number
          description?: string | null
          id?: string
          initial_balance?: number
          is_active?: boolean | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_type?: string | null
          broker?: string | null
          created_at?: string
          currency?: string
          current_balance?: number
          description?: string | null
          id?: string
          initial_balance?: number
          is_active?: boolean | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_balance_idr: number | null
          created_at: string
          default_currency: string | null
          default_risk_percentage: number | null
          display_name: string | null
          id: string
          preferred_currency: string | null
          timezone: string | null
          trading_experience: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_balance_idr?: number | null
          created_at?: string
          default_currency?: string | null
          default_risk_percentage?: number | null
          display_name?: string | null
          id?: string
          preferred_currency?: string | null
          timezone?: string | null
          trading_experience?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_balance_idr?: number | null
          created_at?: string
          default_currency?: string | null
          default_risk_percentage?: number | null
          display_name?: string | null
          id?: string
          preferred_currency?: string | null
          timezone?: string | null
          trading_experience?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      psychological_notes: {
        Row: {
          created_at: string
          decision_quality: number | null
          discipline_rating: number | null
          entry_emotion: string | null
          exit_emotion: string | null
          id: string
          lessons_learned: string | null
          market_sentiment: string | null
          notes: string | null
          stress_level: number | null
          trade_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          decision_quality?: number | null
          discipline_rating?: number | null
          entry_emotion?: string | null
          exit_emotion?: string | null
          id?: string
          lessons_learned?: string | null
          market_sentiment?: string | null
          notes?: string | null
          stress_level?: number | null
          trade_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          decision_quality?: number | null
          discipline_rating?: number | null
          entry_emotion?: string | null
          exit_emotion?: string | null
          id?: string
          lessons_learned?: string | null
          market_sentiment?: string | null
          notes?: string | null
          stress_level?: number | null
          trade_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "psychological_notes_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "trades"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_calculations: {
        Row: {
          account_balance_idr: number
          created_at: string | null
          entry_price: number
          id: string
          lot_size: number
          reward_amount_idr: number | null
          risk_amount_idr: number
          risk_percentage: number
          risk_reward_ratio: number | null
          stop_loss: number
          symbol: string
          take_profit: number | null
          user_id: string
        }
        Insert: {
          account_balance_idr: number
          created_at?: string | null
          entry_price: number
          id?: string
          lot_size: number
          reward_amount_idr?: number | null
          risk_amount_idr: number
          risk_percentage: number
          risk_reward_ratio?: number | null
          stop_loss: number
          symbol: string
          take_profit?: number | null
          user_id: string
        }
        Update: {
          account_balance_idr?: number
          created_at?: string | null
          entry_price?: number
          id?: string
          lot_size?: number
          reward_amount_idr?: number | null
          risk_amount_idr?: number
          risk_percentage?: number
          risk_reward_ratio?: number | null
          stop_loss?: number
          symbol?: string
          take_profit?: number | null
          user_id?: string
        }
        Relationships: []
      }
      trades: {
        Row: {
          account_balance_idr: number | null
          created_at: string
          currency: string | null
          entry_date: string
          entry_price: number
          exit_date: string | null
          exit_price: number | null
          fees: number | null
          id: string
          lot_size: number | null
          portfolio_id: string
          profit_loss: number | null
          quantity: number
          risk_amount_idr: number | null
          risk_percentage: number | null
          risk_reward_ratio: number | null
          setup_description: string | null
          status: string
          stop_loss: number | null
          strategy: string | null
          symbol: string
          tags: string[] | null
          take_profit: number | null
          trade_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_balance_idr?: number | null
          created_at?: string
          currency?: string | null
          entry_date: string
          entry_price: number
          exit_date?: string | null
          exit_price?: number | null
          fees?: number | null
          id?: string
          lot_size?: number | null
          portfolio_id: string
          profit_loss?: number | null
          quantity: number
          risk_amount_idr?: number | null
          risk_percentage?: number | null
          risk_reward_ratio?: number | null
          setup_description?: string | null
          status?: string
          stop_loss?: number | null
          strategy?: string | null
          symbol: string
          tags?: string[] | null
          take_profit?: number | null
          trade_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_balance_idr?: number | null
          created_at?: string
          currency?: string | null
          entry_date?: string
          entry_price?: number
          exit_date?: string | null
          exit_price?: number | null
          fees?: number | null
          id?: string
          lot_size?: number | null
          portfolio_id?: string
          profit_loss?: number | null
          quantity?: number
          risk_amount_idr?: number | null
          risk_percentage?: number | null
          risk_reward_ratio?: number | null
          setup_description?: string | null
          status?: string
          stop_loss?: number | null
          strategy?: string | null
          symbol?: string
          tags?: string[] | null
          take_profit?: number | null
          trade_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trades_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_reviews: {
        Row: {
          areas_for_improvement: string | null
          avg_loss: number | null
          avg_win: number | null
          created_at: string
          emotional_state: string | null
          ending_balance: number
          id: string
          key_lessons: string | null
          losing_trades: number | null
          market_conditions: string | null
          max_drawdown: number | null
          portfolio_id: string
          risk_reward_ratio: number | null
          starting_balance: number
          total_profit_loss: number | null
          total_trades: number | null
          updated_at: string
          user_id: string
          week_end_date: string
          week_start_date: string
          weekly_goals: string | null
          weekly_reflection: string | null
          win_rate: number | null
          winning_trades: number | null
        }
        Insert: {
          areas_for_improvement?: string | null
          avg_loss?: number | null
          avg_win?: number | null
          created_at?: string
          emotional_state?: string | null
          ending_balance: number
          id?: string
          key_lessons?: string | null
          losing_trades?: number | null
          market_conditions?: string | null
          max_drawdown?: number | null
          portfolio_id: string
          risk_reward_ratio?: number | null
          starting_balance: number
          total_profit_loss?: number | null
          total_trades?: number | null
          updated_at?: string
          user_id: string
          week_end_date: string
          week_start_date: string
          weekly_goals?: string | null
          weekly_reflection?: string | null
          win_rate?: number | null
          winning_trades?: number | null
        }
        Update: {
          areas_for_improvement?: string | null
          avg_loss?: number | null
          avg_win?: number | null
          created_at?: string
          emotional_state?: string | null
          ending_balance?: number
          id?: string
          key_lessons?: string | null
          losing_trades?: number | null
          market_conditions?: string | null
          max_drawdown?: number | null
          portfolio_id?: string
          risk_reward_ratio?: number | null
          starting_balance?: number
          total_profit_loss?: number | null
          total_trades?: number | null
          updated_at?: string
          user_id?: string
          week_end_date?: string
          week_start_date?: string
          weekly_goals?: string | null
          weekly_reflection?: string | null
          win_rate?: number | null
          winning_trades?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "weekly_reviews_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      get_top_strategies: {
        Args: { limit_count?: number; user_uuid: string }
        Returns: {
          strategy: string
          total_profit: number
          total_trades: number
        }[]
      }
      get_weekly_performance: {
        Args: { user_uuid: string }
        Returns: {
          best_trade: number
          total_profit: number
          win_rate: number
          worst_trade: number
        }[]
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
