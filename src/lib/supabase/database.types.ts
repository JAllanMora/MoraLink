
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "categories": {
                  Row: {
                    "description": string | null,"id": string,"image_url": string | null,"name": string,"position": number,"tenant_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "description"?: string | null,"id"?: string,"image_url"?: string | null,"name": string,"position"?: number,"tenant_id": string
                  }
                  Update: {
                    "description"?: string | null,"id"?: string,"image_url"?: string | null,"name"?: string,"position"?: number,"tenant_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "categories_tenant_id_fkey"
      columns: ["tenant_id"]
isOneToOne: false
      referencedRelation: "tenants"
      referencedColumns: ["id"]
    }
                  ]
                },"customers": {
                  Row: {
                    "code": string,"created_at": string,"id": string,"name": string | null,"phone": string | null,"tenant_id": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "code"?: string,"created_at"?: string,"id"?: string,"name"?: string | null,"phone"?: string | null,"tenant_id": string,"user_id"?: string
                  }
                  Update: {
                    "code"?: string,"created_at"?: string,"id"?: string,"name"?: string | null,"phone"?: string | null,"tenant_id"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "customers_tenant_id_fkey"
      columns: ["tenant_id"]
isOneToOne: false
      referencedRelation: "tenants"
      referencedColumns: ["id"]
    }
                  ]
                },"loyalty_events": {
                  Row: {
                    "amount": number,"created_at": string,"created_by": string | null,"customer_id": string,"id": string,"kind": string,"note": string | null,"reward_id": string | null,"tenant_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "amount": number,"created_at"?: string,"created_by"?: string | null,"customer_id": string,"id"?: string,"kind": string,"note"?: string | null,"reward_id"?: string | null,"tenant_id": string
                  }
                  Update: {
                    "amount"?: number,"created_at"?: string,"created_by"?: string | null,"customer_id"?: string,"id"?: string,"kind"?: string,"note"?: string | null,"reward_id"?: string | null,"tenant_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "loyalty_events_customer_id_fkey"
      columns: ["customer_id"]
isOneToOne: false
      referencedRelation: "customer_balances"
      referencedColumns: ["customer_id"]
    },{
      foreignKeyName: "loyalty_events_customer_id_fkey"
      columns: ["customer_id"]
isOneToOne: false
      referencedRelation: "customers"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "loyalty_events_reward_id_fkey"
      columns: ["reward_id"]
isOneToOne: false
      referencedRelation: "rewards"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "loyalty_events_tenant_id_fkey"
      columns: ["tenant_id"]
isOneToOne: false
      referencedRelation: "tenants"
      referencedColumns: ["id"]
    }
                  ]
                },"loyalty_programs": {
                  Row: {
                    "description": string | null,"id": string,"name": string,"points_per_currency": number,"spend_per_stamp": number | null,"stamp_icon": string,"stamps_required": number,"tenant_id": string,"terms": string | null,"type": string
                  }
                  ComputedFields: never
                  Insert: {
                    "description"?: string | null,"id"?: string,"name"?: string,"points_per_currency"?: number,"spend_per_stamp"?: number | null,"stamp_icon"?: string,"stamps_required"?: number,"tenant_id": string,"terms"?: string | null,"type"?: string
                  }
                  Update: {
                    "description"?: string | null,"id"?: string,"name"?: string,"points_per_currency"?: number,"spend_per_stamp"?: number | null,"stamp_icon"?: string,"stamps_required"?: number,"tenant_id"?: string,"terms"?: string | null,"type"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "loyalty_programs_tenant_id_fkey"
      columns: ["tenant_id"]
isOneToOne: true
      referencedRelation: "tenants"
      referencedColumns: ["id"]
    }
                  ]
                },"order_items": {
                  Row: {
                    "id": string,"name": string,"order_id": string,"price": number,"product_id": string | null,"quantity": number
                  }
                  ComputedFields: never
                  Insert: {
                    "id"?: string,"name": string,"order_id": string,"price"?: number,"product_id"?: string | null,"quantity": number
                  }
                  Update: {
                    "id"?: string,"name"?: string,"order_id"?: string,"price"?: number,"product_id"?: string | null,"quantity"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "order_items_order_id_fkey"
      columns: ["order_id"]
isOneToOne: false
      referencedRelation: "orders"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "order_items_product_id_fkey"
      columns: ["product_id"]
isOneToOne: false
      referencedRelation: "products"
      referencedColumns: ["id"]
    }
                  ]
                },"orders": {
                  Row: {
                    "address": string | null,"created_at": string,"created_by": string | null,"customer_name": string,"customer_phone": string,"delivery": string,"id": string,"notes": string | null,"number": number,"status": string,"tenant_id": string,"token": string,"total": number,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "address"?: string | null,"created_at"?: string,"created_by"?: string | null,"customer_name": string,"customer_phone": string,"delivery"?: string,"id"?: string,"notes"?: string | null,"number": number,"status"?: string,"tenant_id": string,"token"?: string,"total"?: number,"updated_at"?: string
                  }
                  Update: {
                    "address"?: string | null,"created_at"?: string,"created_by"?: string | null,"customer_name"?: string,"customer_phone"?: string,"delivery"?: string,"id"?: string,"notes"?: string | null,"number"?: number,"status"?: string,"tenant_id"?: string,"token"?: string,"total"?: number,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "orders_tenant_id_fkey"
      columns: ["tenant_id"]
isOneToOne: false
      referencedRelation: "tenants"
      referencedColumns: ["id"]
    }
                  ]
                },"products": {
                  Row: {
                    "available": boolean,"category_id": string | null,"coming_soon": boolean,"description": string | null,"group_name": string | null,"id": string,"image_url": string | null,"max_quantity": number,"min_quantity": number,"name": string,"position": number,"price": number | null,"tenant_id": string,"variant": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "available"?: boolean,"category_id"?: string | null,"coming_soon"?: boolean,"description"?: string | null,"group_name"?: string | null,"id"?: string,"image_url"?: string | null,"max_quantity"?: number,"min_quantity"?: number,"name": string,"position"?: number,"price"?: number | null,"tenant_id": string,"variant"?: string | null
                  }
                  Update: {
                    "available"?: boolean,"category_id"?: string | null,"coming_soon"?: boolean,"description"?: string | null,"group_name"?: string | null,"id"?: string,"image_url"?: string | null,"max_quantity"?: number,"min_quantity"?: number,"name"?: string,"position"?: number,"price"?: number | null,"tenant_id"?: string,"variant"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "products_category_id_fkey"
      columns: ["category_id"]
isOneToOne: false
      referencedRelation: "categories"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "products_tenant_id_fkey"
      columns: ["tenant_id"]
isOneToOne: false
      referencedRelation: "tenants"
      referencedColumns: ["id"]
    }
                  ]
                },"rewards": {
                  Row: {
                    "active": boolean,"cost": number,"description": string | null,"id": string,"image_url": string | null,"name": string,"position": number,"tenant_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "active"?: boolean,"cost": number,"description"?: string | null,"id"?: string,"image_url"?: string | null,"name": string,"position"?: number,"tenant_id": string
                  }
                  Update: {
                    "active"?: boolean,"cost"?: number,"description"?: string | null,"id"?: string,"image_url"?: string | null,"name"?: string,"position"?: number,"tenant_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "rewards_tenant_id_fkey"
      columns: ["tenant_id"]
isOneToOne: false
      referencedRelation: "tenants"
      referencedColumns: ["id"]
    }
                  ]
                },"tenant_members": {
                  Row: {
                    "created_at": string,"role": string,"tenant_id": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"role"?: string,"tenant_id": string,"user_id": string
                  }
                  Update: {
                    "created_at"?: string,"role"?: string,"tenant_id"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "tenant_members_tenant_id_fkey"
      columns: ["tenant_id"]
isOneToOne: false
      referencedRelation: "tenants"
      referencedColumns: ["id"]
    }
                  ]
                },"tenants": {
                  Row: {
                    "active": boolean,"address": string | null,"billing_status": string,"cover_url": string | null,"created_at": string,"delivery_enabled": boolean,"id": string,"instagram": string | null,"logo_url": string | null,"name": string,"orders_enabled": boolean,"plan": string,"slug": string,"tagline": string | null,"theme": NonNullable<Json>,"whatsapp": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "active"?: boolean,"address"?: string | null,"billing_status"?: string,"cover_url"?: string | null,"created_at"?: string,"delivery_enabled"?: boolean,"id"?: string,"instagram"?: string | null,"logo_url"?: string | null,"name": string,"orders_enabled"?: boolean,"plan"?: string,"slug": string,"tagline"?: string | null,"theme"?: NonNullable<Json>,"whatsapp"?: string | null
                  }
                  Update: {
                    "active"?: boolean,"address"?: string | null,"billing_status"?: string,"cover_url"?: string | null,"created_at"?: string,"delivery_enabled"?: boolean,"id"?: string,"instagram"?: string | null,"logo_url"?: string | null,"name"?: string,"orders_enabled"?: boolean,"plan"?: string,"slug"?: string,"tagline"?: string | null,"theme"?: NonNullable<Json>,"whatsapp"?: string | null
                  }
                  Relationships: [
                    
                  ]
                }
          }
          Views: {
            "customer_balances": {
                  Row: {
                    "balance": number | null,"customer_id": string | null,"lifetime_earned": number | null,"tenant_id": string | null
                  }
                  ComputedFields: never
                  Relationships: [
                    {
      foreignKeyName: "customers_tenant_id_fkey"
      columns: ["tenant_id"]
isOneToOne: false
      referencedRelation: "tenants"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Functions: {
            "add_loyalty":
{ Args: { "p_amount"?: number,"p_customer_code": string,"p_note"?: string,"p_tenant_id": string }; Returns: number
                           },
"get_order":
{ Args: { "p_token": string }; Returns: Json
                           },
"is_tenant_member":
{ Args: { "p_roles"?: (string)[],"p_tenant_id": string }; Returns: boolean
                           },
"place_order":
{ Args: { "p_address"?: string,"p_customer_name": string,"p_customer_phone": string,"p_delivery"?: string,"p_items": Json,"p_notes"?: string,"p_tenant_slug": string }; Returns: {
              "number": number,"token": string
            }[]
                           },
"redeem_reward":
{ Args: { "p_customer_code": string,"p_reward_id": string,"p_tenant_id": string }; Returns: number
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

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            
          }
        }
} as const
