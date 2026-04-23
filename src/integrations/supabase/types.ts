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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      drivers: {
        Row: {
          created_at: string
          current_lat: number
          current_lng: number
          id: string
          last_assigned_at: string | null
          name: string
          phone: string | null
          rating: number
          status: string
          total_deliveries: number
          vehicle: string
        }
        Insert: {
          created_at?: string
          current_lat: number
          current_lng: number
          id: string
          last_assigned_at?: string | null
          name: string
          phone?: string | null
          rating?: number
          status?: string
          total_deliveries?: number
          vehicle?: string
        }
        Update: {
          created_at?: string
          current_lat?: number
          current_lng?: number
          id?: string
          last_assigned_at?: string | null
          name?: string
          phone?: string | null
          rating?: number
          status?: string
          total_deliveries?: number
          vehicle?: string
        }
        Relationships: []
      }
      order_events: {
        Row: {
          actor: string | null
          created_at: string
          id: string
          message: string
          order_id: string
          status: string
        }
        Insert: {
          actor?: string | null
          created_at?: string
          id?: string
          message: string
          order_id: string
          status: string
        }
        Update: {
          actor?: string | null
          created_at?: string
          id?: string
          message?: string
          order_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          arrived_at: string | null
          assignment_reason: Json | null
          community_fund: number
          created_at: string
          customer_address: string
          customer_lat: number
          customer_lng: number
          customer_name: string
          delivered_at: string | null
          delivery_fee: number
          discount: number
          distance_km: number
          driver_earnings: number
          driver_id: string | null
          id: string
          items: Json
          platform_fee: number
          seller_earnings: number
          seller_id: string
          short_code: string
          status: string
          subtotal: number
          total: number
          updated_at: string
          wait_penalty: number
        }
        Insert: {
          arrived_at?: string | null
          assignment_reason?: Json | null
          community_fund?: number
          created_at?: string
          customer_address?: string
          customer_lat: number
          customer_lng: number
          customer_name?: string
          delivered_at?: string | null
          delivery_fee?: number
          discount?: number
          distance_km?: number
          driver_earnings?: number
          driver_id?: string | null
          id?: string
          items: Json
          platform_fee?: number
          seller_earnings?: number
          seller_id: string
          short_code: string
          status?: string
          subtotal: number
          total: number
          updated_at?: string
          wait_penalty?: number
        }
        Update: {
          arrived_at?: string | null
          assignment_reason?: Json | null
          community_fund?: number
          created_at?: string
          customer_address?: string
          customer_lat?: number
          customer_lng?: number
          customer_name?: string
          delivered_at?: string | null
          delivery_fee?: number
          discount?: number
          distance_km?: number
          driver_earnings?: number
          driver_id?: string | null
          id?: string
          items?: Json
          platform_fee?: number
          seller_earnings?: number
          seller_id?: string
          short_code?: string
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
          wait_penalty?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image: string
          in_stock: boolean
          name: string
          original_price: number | null
          price: number
          seller_id: string
          tag: string | null
          unit: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id: string
          image: string
          in_stock?: boolean
          name: string
          original_price?: number | null
          price: number
          seller_id: string
          tag?: string | null
          unit?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image?: string
          in_stock?: boolean
          name?: string
          original_price?: number | null
          price?: number
          seller_id?: string
          tag?: string | null
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      sellers: {
        Row: {
          avg_prep_minutes: number
          banner_image: string | null
          category: string
          contribution_pct: number
          created_at: string
          description: string | null
          id: string
          lat: number
          lng: number
          location_label: string
          name: string
          rating: number
          total_orders: number
        }
        Insert: {
          avg_prep_minutes?: number
          banner_image?: string | null
          category?: string
          contribution_pct?: number
          created_at?: string
          description?: string | null
          id: string
          lat: number
          lng: number
          location_label: string
          name: string
          rating?: number
          total_orders?: number
        }
        Update: {
          avg_prep_minutes?: number
          banner_image?: string | null
          category?: string
          contribution_pct?: number
          created_at?: string
          description?: string | null
          id?: string
          lat?: number
          lng?: number
          location_label?: string
          name?: string
          rating?: number
          total_orders?: number
        }
        Relationships: []
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
