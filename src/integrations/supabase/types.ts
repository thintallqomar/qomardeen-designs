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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_blog_posts: {
        Row: {
          category: string
          content: string
          created_at: string
          excerpt: string
          hero_image_url: string | null
          id: string
          published_at: string | null
          read_time: string
          slug: string
          status: string
          tags: string[]
          title: string
        }
        Insert: {
          category?: string
          content: string
          created_at?: string
          excerpt: string
          hero_image_url?: string | null
          id?: string
          published_at?: string | null
          read_time?: string
          slug: string
          status?: string
          tags?: string[]
          title: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          excerpt?: string
          hero_image_url?: string | null
          id?: string
          published_at?: string | null
          read_time?: string
          slug?: string
          status?: string
          tags?: string[]
          title?: string
        }
        Relationships: []
      }
      atlas_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          thread_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          thread_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          thread_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "atlas_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "atlas_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      atlas_threads: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          actor_email: string | null
          actor_id: string | null
          created_at: string
          details: Json
          event_type: string
          id: string
          ip_hash: string | null
          outcome: string
          target_id: string | null
          target_table: string | null
          user_agent: string | null
        }
        Insert: {
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          details?: Json
          event_type: string
          id?: string
          ip_hash?: string | null
          outcome?: string
          target_id?: string | null
          target_table?: string | null
          user_agent?: string | null
        }
        Update: {
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          details?: Json
          event_type?: string
          id?: string
          ip_hash?: string | null
          outcome?: string
          target_id?: string | null
          target_table?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      auth_attempts: {
        Row: {
          created_at: string
          id: string
          identifier: string
          ip_hash: string | null
          success: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          identifier: string
          ip_hash?: string | null
          success?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          identifier?: string
          ip_hash?: string | null
          success?: boolean
        }
        Relationships: []
      }
      blog_comments: {
        Row: {
          article_slug: string
          content: string
          created_at: string
          guest_name: string | null
          id: string
          is_edited: boolean
          parent_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          article_slug: string
          content: string
          created_at?: string
          guest_name?: string | null
          id?: string
          is_edited?: boolean
          parent_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          article_slug?: string
          content?: string
          created_at?: string
          guest_name?: string | null
          id?: string
          is_edited?: boolean
          parent_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "blog_comments_public"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_likes: {
        Row: {
          article_slug: string
          created_at: string
          id: string
          user_id: string | null
          visitor_id: string | null
        }
        Insert: {
          article_slug: string
          created_at?: string
          id?: string
          user_id?: string | null
          visitor_id?: string | null
        }
        Update: {
          article_slug?: string
          created_at?: string
          id?: string
          user_id?: string | null
          visitor_id?: string | null
        }
        Relationships: []
      }
      comment_contacts: {
        Row: {
          comment_id: string
          created_at: string
          email: string
          id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_contacts_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_contacts_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "blog_comments_public"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          subject?: string
        }
        Relationships: []
      }
      content_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      content_items: {
        Row: {
          author_avatar: string | null
          author_id: string | null
          author_name: string | null
          body_html: string | null
          body_json: Json | null
          body_markdown: string | null
          canonical_url: string | null
          category: string | null
          cover_image: string | null
          cover_image_alt: string | null
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          is_featured: boolean
          is_pinned: boolean
          legacy_slug: string | null
          publish_date: string | null
          reading_time_minutes: number
          resource_file_size: number | null
          resource_file_type: string | null
          resource_url: string | null
          seo_description: string | null
          seo_image: string | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          subtitle: string | null
          tags: string[]
          title: string
          tldr: string | null
          type: Database["public"]["Enums"]["content_type"]
          updated_at: string
          updated_date: string | null
          visibility: Database["public"]["Enums"]["content_visibility"]
          word_count: number
        }
        Insert: {
          author_avatar?: string | null
          author_id?: string | null
          author_name?: string | null
          body_html?: string | null
          body_json?: Json | null
          body_markdown?: string | null
          canonical_url?: string | null
          category?: string | null
          cover_image?: string | null
          cover_image_alt?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean
          is_pinned?: boolean
          legacy_slug?: string | null
          publish_date?: string | null
          reading_time_minutes?: number
          resource_file_size?: number | null
          resource_file_type?: string | null
          resource_url?: string | null
          seo_description?: string | null
          seo_image?: string | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          subtitle?: string | null
          tags?: string[]
          title: string
          tldr?: string | null
          type: Database["public"]["Enums"]["content_type"]
          updated_at?: string
          updated_date?: string | null
          visibility?: Database["public"]["Enums"]["content_visibility"]
          word_count?: number
        }
        Update: {
          author_avatar?: string | null
          author_id?: string | null
          author_name?: string | null
          body_html?: string | null
          body_json?: Json | null
          body_markdown?: string | null
          canonical_url?: string | null
          category?: string | null
          cover_image?: string | null
          cover_image_alt?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean
          is_pinned?: boolean
          legacy_slug?: string | null
          publish_date?: string | null
          reading_time_minutes?: number
          resource_file_size?: number | null
          resource_file_type?: string | null
          resource_url?: string | null
          seo_description?: string | null
          seo_image?: string | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          subtitle?: string | null
          tags?: string[]
          title?: string
          tldr?: string | null
          type?: Database["public"]["Enums"]["content_type"]
          updated_at?: string
          updated_date?: string | null
          visibility?: Database["public"]["Enums"]["content_visibility"]
          word_count?: number
        }
        Relationships: []
      }
      content_relations: {
        Row: {
          created_at: string
          id: string
          sort_order: number
          source_content_id: string | null
          source_project_slug: string | null
          target_content_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          sort_order?: number
          source_content_id?: string | null
          source_project_slug?: string | null
          target_content_id: string
        }
        Update: {
          created_at?: string
          id?: string
          sort_order?: number
          source_content_id?: string | null
          source_project_slug?: string | null
          target_content_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_relations_source_content_id_fkey"
            columns: ["source_content_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_relations_target_content_id_fkey"
            columns: ["target_content_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      content_tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          alt_text: string | null
          created_at: string
          file_name: string
          file_size: number | null
          folder: string
          height: number | null
          id: string
          mime_type: string | null
          public_url: string
          storage_path: string
          updated_at: string
          uploaded_by: string | null
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          file_name: string
          file_size?: number | null
          folder?: string
          height?: number | null
          id?: string
          mime_type?: string | null
          public_url: string
          storage_path: string
          updated_at?: string
          uploaded_by?: string | null
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          file_name?: string
          file_size?: number | null
          folder?: string
          height?: number | null
          id?: string
          mime_type?: string | null
          public_url?: string
          storage_path?: string
          updated_at?: string
          uploaded_by?: string | null
          width?: number | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      project_inquiries: {
        Row: {
          budget_range: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          project_type: string
          status: string
          timeline: string | null
          updated_at: string
        }
        Insert: {
          budget_range?: string | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          project_type: string
          status?: string
          timeline?: string | null
          updated_at?: string
        }
        Update: {
          budget_range?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          project_type?: string
          status?: string
          timeline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      visitor_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          metadata: Json | null
          page_path: string
          referrer: string | null
          session_id: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json | null
          page_path: string
          referrer?: string | null
          session_id: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          page_path?: string
          referrer?: string | null
          session_id?: string
          user_agent?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      blog_comments_public: {
        Row: {
          article_slug: string | null
          content: string | null
          created_at: string | null
          guest_name: string | null
          id: string | null
          is_edited: boolean | null
          parent_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          article_slug?: string | null
          content?: string | null
          created_at?: string | null
          guest_name?: string | null
          id?: string | null
          is_edited?: boolean | null
          parent_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          article_slug?: string | null
          content?: string | null
          created_at?: string | null
          guest_name?: string | null
          id?: string | null
          is_edited?: boolean | null
          parent_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "blog_comments_public"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "editor" | "contributor"
      content_status: "draft" | "published" | "scheduled" | "archived"
      content_type:
        | "article"
        | "thinking"
        | "architecture"
        | "resource"
        | "case_study"
      content_visibility: "public" | "unlisted" | "private"
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
      app_role: ["admin", "moderator", "user", "editor", "contributor"],
      content_status: ["draft", "published", "scheduled", "archived"],
      content_type: [
        "article",
        "thinking",
        "architecture",
        "resource",
        "case_study",
      ],
      content_visibility: ["public", "unlisted", "private"],
    },
  },
} as const
