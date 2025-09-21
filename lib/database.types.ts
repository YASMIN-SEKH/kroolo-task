export type Database = {
  public: {
    Tables: {
      accounts: {
        Row: {
          country: string | null
          created_at: string
          id: string
          name: string
          owner_id: string | null
          status: string
          support_channel: string
          updated_at: string
          website: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          id?: string
          name: string
          owner_id?: string | null
          status?: string
          support_channel?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string
          id?: string
          name?: string
          owner_id?: string | null
          status?: string
          support_channel?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      departments: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department_id: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          role: string
          status: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department_id?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string
          status?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department_id?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_department_id_fkey"
            columns: ["department_id"]
            referencedRelation: "departments"
            referencedColumns: ["id"]
          }
        ]
      }
      service_categories: {
        Row: {
          color: string | null
          created_at: string
          department_id: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          department_id?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          department_id?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_categories_department_id_fkey"
            columns: ["department_id"]
            referencedRelation: "departments"
            referencedColumns: ["id"]
          }
        ]
      }
      services: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          estimated_time_hours: number | null
          id: string
          is_active: boolean
          name: string
          rating: number | null
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          estimated_time_hours?: number | null
          id?: string
          is_active?: boolean
          name: string
          rating?: number | null
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          estimated_time_hours?: number | null
          id?: string
          is_active?: boolean
          name?: string
          rating?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          }
        ]
      }
      sla_policies: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          priority: string
          resolution_time_minutes: number
          response_time_minutes: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          priority: string
          resolution_time_minutes: number
          response_time_minutes: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          priority?: string
          resolution_time_minutes?: number
          response_time_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      ticket_attachments: {
        Row: {
          created_at: string
          file_size: number | null
          file_url: string
          filename: string
          id: string
          mime_type: string | null
          ticket_id: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          file_size?: number | null
          file_url: string
          filename: string
          id?: string
          mime_type?: string | null
          ticket_id?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          file_size?: number | null
          file_url?: string
          filename?: string
          id?: string
          mime_type?: string | null
          ticket_id?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_attachments_ticket_id_fkey"
            columns: ["ticket_id"]
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      ticket_comments: {
        Row: {
          author_id: string | null
          content: string
          created_at: string
          id: string
          is_internal: boolean
          ticket_id: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string
          id?: string
          is_internal?: boolean
          ticket_id?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string
          id?: string
          is_internal?: boolean
          ticket_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_comments_author_id_fkey"
            columns: ["author_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_comments_ticket_id_fkey"
            columns: ["ticket_id"]
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          }
        ]
      }
      tickets: {
        Row: {
          account_id: string | null
          assignee_id: string | null
          closed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          notes: string | null
          priority: string
          reporter_id: string | null
          resolved_at: string | null
          service_id: string | null
          sla_policy_id: string | null
          status: string
          ticket_number: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          account_id?: string | null
          assignee_id?: string | null
          closed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          priority?: string
          reporter_id?: string | null
          resolved_at?: string | null
          service_id?: string | null
          sla_policy_id?: string | null
          status?: string
          ticket_number: string
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          account_id?: string | null
          assignee_id?: string | null
          closed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          priority?: string
          reporter_id?: string | null
          resolved_at?: string | null
          service_id?: string | null
          sla_policy_id?: string | null
          status?: string
          ticket_number?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_account_id_fkey"
            columns: ["account_id"]
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_assignee_id_fkey"
            columns: ["assignee_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_reporter_id_fkey"
            columns: ["reporter_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_service_id_fkey"
            columns: ["service_id"]
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_sla_policy_id_fkey"
            columns: ["sla_policy_id"]
            referencedRelation: "sla_policies"
            referencedColumns: ["id"]
          }
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