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
      checkout_products: {
        Row: {
          category: string
          compliance_note: string | null
          compliance_status: string
          created_at: string
          image_url: string | null
          inventory: number | null
          name: string
          price_usd: number
          sku: string
          updated_at: string
        }
        Insert: {
          category: string
          compliance_note?: string | null
          compliance_status?: string
          created_at?: string
          image_url?: string | null
          inventory?: number | null
          name: string
          price_usd: number
          sku: string
          updated_at?: string
        }
        Update: {
          category?: string
          compliance_note?: string | null
          compliance_status?: string
          created_at?: string
          image_url?: string | null
          inventory?: number | null
          name?: string
          price_usd?: number
          sku?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          ip_address: string | null
          last_name: string
          message: string
          phone: string | null
          status: string
          subject: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          ip_address?: string | null
          last_name: string
          message: string
          phone?: string | null
          status?: string
          subject: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          ip_address?: string | null
          last_name?: string
          message?: string
          phone?: string | null
          status?: string
          subject?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      order_audit_log: {
        Row: {
          created_at: string
          from_status: string | null
          id: string
          order_id: string
          reason: string
          to_status: string
        }
        Insert: {
          created_at?: string
          from_status?: string | null
          id?: string
          order_id: string
          reason: string
          to_status: string
        }
        Update: {
          created_at?: string
          from_status?: string | null
          id?: string
          order_id?: string
          reason?: string
          to_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_audit_log_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: string
          name: string
          order_id: string
          price_usd: number
          sku: string
        }
        Insert: {
          id?: string
          name: string
          order_id: string
          price_usd: number
          sku: string
        }
        Update: {
          id?: string
          name?: string
          order_id?: string
          price_usd?: number
          sku?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_sku_fkey"
            columns: ["sku"]
            isOneToOne: false
            referencedRelation: "checkout_products"
            referencedColumns: ["sku"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          fulfilled_at: string | null
          fulfillment_note: string | null
          fulfillment_status: string
          id: string
          ip_hash: string
          pay_currency: string | null
          provider: string
          provider_invoice_id: string | null
          status: string
          telegram: string
          total_usd: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          fulfilled_at?: string | null
          fulfillment_note?: string | null
          fulfillment_status?: string
          id?: string
          ip_hash: string
          pay_currency?: string | null
          provider: string
          provider_invoice_id?: string | null
          status?: string
          telegram: string
          total_usd: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          fulfilled_at?: string | null
          fulfillment_note?: string | null
          fulfillment_status?: string
          id?: string
          ip_hash?: string
          pay_currency?: string | null
          provider?: string
          provider_invoice_id?: string | null
          status?: string
          telegram?: string
          total_usd?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      payment_events: {
        Row: {
          created_at: string
          id: string
          notification_status: string
          order_id: string | null
          payment_status: string | null
          provider: string
          provider_event_key: string
          raw: Json
          verified: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          notification_status?: string
          order_id?: string | null
          payment_status?: string | null
          provider: string
          provider_event_key: string
          raw: Json
          verified: boolean
        }
        Update: {
          created_at?: string
          id?: string
          notification_status?: string
          order_id?: string | null
          payment_status?: string | null
          provider?: string
          provider_event_key?: string
          raw?: Json
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "payment_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_inquiries: {
        Row: {
          consent: boolean
          created_at: string
          id: string
          ip_hash: string
          message: string
          name: string
          notification_attempt_at: string | null
          notification_status: string
          service: string
          status: string
          telegram: string
          telegram_message_id: number | null
        }
        Insert: {
          consent: boolean
          created_at?: string
          id: string
          ip_hash: string
          message: string
          name: string
          notification_attempt_at?: string | null
          notification_status?: string
          service: string
          status?: string
          telegram: string
          telegram_message_id?: number | null
        }
        Update: {
          consent?: boolean
          created_at?: string
          id?: string
          ip_hash?: string
          message?: string
          name?: string
          notification_attempt_at?: string | null
          notification_status?: string
          service?: string
          status?: string
          telegram?: string
          telegram_message_id?: number | null
        }
        Relationships: []
      }
      telegram_channel_post: {
        Row: {
          id: boolean
          message_id: number | null
          updated_at: string
        }
        Insert: {
          id?: boolean
          message_id?: number | null
          updated_at?: string
        }
        Update: {
          id?: boolean
          message_id?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      telegram_messages: {
        Row: {
          chat_id: number
          created_at: string
          inquiry_id: string | null
          raw_update: Json
          text: string | null
          update_id: number
          user_id: number | null
        }
        Insert: {
          chat_id: number
          created_at?: string
          inquiry_id?: string | null
          raw_update: Json
          text?: string | null
          update_id: number
          user_id?: number | null
        }
        Update: {
          chat_id?: number
          created_at?: string
          inquiry_id?: string | null
          raw_update?: Json
          text?: string | null
          update_id?: number
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "telegram_messages_inquiry_id_fkey"
            columns: ["inquiry_id"]
            isOneToOne: false
            referencedRelation: "pricing_inquiries"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_verified_payment_event: {
        Args: {
          p_currency: string
          p_event_key: string
          p_invoice: string
          p_order: string
          p_provider: string
          p_raw: Json
          p_reason: string
          p_to: string
        }
        Returns: Json
      }
      claim_inquiry_notification: {
        Args: { p_id: string; p_ip_hash: string }
        Returns: {
          consent: boolean
          created_at: string
          id: string
          ip_hash: string
          message: string
          name: string
          notification_attempt_at: string | null
          notification_status: string
          service: string
          status: string
          telegram: string
          telegram_message_id: number | null
        }[]
        SetofOptions: {
          from: "*"
          to: "pricing_inquiries"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      claim_payment_notification: {
        Args: { p_event_key: string; p_provider: string }
        Returns: string
      }
      create_checkout_order: {
        Args: {
          p_ip_hash: string
          p_provider: string
          p_skus: string[]
          p_telegram: string
          p_user_id: string
        }
        Returns: string
      }
      get_user_roles: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      save_pricing_inquiry: {
        Args: {
          p_id: string
          p_ip_hash: string
          p_message: string
          p_name: string
          p_service: string
          p_telegram: string
        }
        Returns: string
      }
      transition_order: {
        Args: { p_order: string; p_reason: string; p_to: string }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
