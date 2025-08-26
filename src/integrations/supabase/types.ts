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
          created_at: string
          display_name: string | null
          id: string
          preferred_currency: string | null
          timezone: string | null
          trading_experience: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          preferred_currency?: string | null
          timezone?: string | null
          trading_experience?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
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
      trades: {
        Row: {
          created_at: string
          entry_date: string
          entry_price: number
          exit_date: string | null
          exit_price: number | null
          fees: number | null
          id: string
          portfolio_id: string
          profit_loss: number | null
          quantity: number
          setup_description: string | null
          status: string
          strategy: string | null
          symbol: string
          tags: string[] | null
          trade_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          entry_date: string
          entry_price: number
          exit_date?: string | null
          exit_price?: number | null
          fees?: number | null
          id?: string
          portfolio_id: string
          profit_loss?: number | null
          quantity: number
          setup_description?: string | null
          status?: string
          strategy?: string | null
          symbol: string
          tags?: string[] | null
          trade_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          entry_date?: string
          entry_price?: number
          exit_date?: string | null
          exit_price?: number | null
          fees?: number | null
          id?: string
          portfolio_id?: string
          profit_loss?: number | null
          quantity?: number
          setup_description?: string | null
          status?: string
          strategy?: string | null
          symbol?: string
          tags?: string[] | null
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
      [_ in never]: never
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
