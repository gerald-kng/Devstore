export type OrderStatus = "pending" | "paid" | "failed" | "expired";
export type ProductVideoKind = "demo" | "install" | "other";

export type Database = {
  public: {
    Tables: {
      product_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      static_pages: {
        Row: {
          id: string;
          slug: string;
          title: string;
          body: string;
          is_published: boolean;
          nav_label: string | null;
          show_in_header: boolean;
          show_in_footer: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          body?: string;
          is_published?: boolean;
          nav_label?: string | null;
          show_in_header?: boolean;
          show_in_footer?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          body?: string;
          is_published?: boolean;
          nav_label?: string | null;
          show_in_header?: boolean;
          show_in_footer?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          email: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          message?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      site_social_links: {
        Row: {
          key: string;
          href: string;
          is_active: boolean;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          key: string;
          href?: string;
          is_active?: boolean;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          key?: string;
          href?: string;
          is_active?: boolean;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      product_comments: {
        Row: {
          id: string;
          product_id: string;
          email: string;
          message: string;
          admin_reply: string | null;
          is_deleted: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          email: string;
          message: string;
          admin_reply?: string | null;
          is_deleted?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          email?: string;
          message?: string;
          admin_reply?: string | null;
          is_deleted?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_comments_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      site_reviews: {
        Row: {
          id: string;
          email: string;
          rating: number;
          message: string;
          admin_reply: string | null;
          is_deleted: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          rating: number;
          message: string;
          admin_reply?: string | null;
          is_deleted?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          rating?: number;
          message?: string;
          admin_reply?: string | null;
          is_deleted?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      product_reviews: {
        Row: {
          id: string;
          product_id: string;
          email: string;
          rating: number;
          message: string;
          admin_reply: string | null;
          is_deleted: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          email: string;
          rating: number;
          message: string;
          admin_reply?: string | null;
          is_deleted?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          email?: string;
          rating?: number;
          message?: string;
          admin_reply?: string | null;
          is_deleted?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          storage_path: string;
          alt_text: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          storage_path: string;
          alt_text?: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          storage_path?: string;
          alt_text?: string;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_videos: {
        Row: {
          id: string;
          product_id: string;
          kind: ProductVideoKind;
          title: string;
          storage_path: string | null;
          external_url: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          kind: ProductVideoKind;
          title?: string;
          storage_path?: string | null;
          external_url?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          kind?: ProductVideoKind;
          title?: string;
          storage_path?: string | null;
          external_url?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_videos_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          summary: string;
          description: string;
          price_amount: number;
          price_currency: string;
          app_storage_path: string;
          video_storage_path: string;
          demo_video_url: string | null;
          features: unknown;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          category_id: string | null;
          main_image_path: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          summary?: string;
          description?: string;
          price_amount: number;
          price_currency?: string;
          app_storage_path: string;
          video_storage_path: string;
          demo_video_url?: string | null;
          features?: unknown;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          category_id?: string | null;
          main_image_path?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          summary?: string;
          description?: string;
          price_amount?: number;
          price_currency?: string;
          app_storage_path?: string;
          video_storage_path?: string;
          demo_video_url?: string | null;
          features?: unknown;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          category_id?: string | null;
          main_image_path?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "product_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          id: string;
          customer_email: string;
          status: OrderStatus;
          payment_provider: string;
          provider_payment_id: string | null;
          invoice_id: string | null;
          amount: number;
          currency: string;
          product_id: string;
          metadata: Record<string, unknown> | null;
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_email: string;
          status?: OrderStatus;
          payment_provider?: string;
          provider_payment_id?: string | null;
          invoice_id?: string | null;
          amount: number;
          currency?: string;
          product_id: string;
          metadata?: Record<string, unknown> | null;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_email?: string;
          status?: OrderStatus;
          payment_provider?: string;
          provider_payment_id?: string | null;
          invoice_id?: string | null;
          amount?: number;
          currency?: string;
          product_id?: string;
          metadata?: Record<string, unknown> | null;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      order_access_tokens: {
        Row: {
          id: string;
          order_id: string;
          token_hash: string;
          expires_at: string;
          revoked_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          token_hash: string;
          expires_at: string;
          revoked_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          token_hash?: string;
          expires_at?: string;
          revoked_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_access_tokens_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
