export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'super_admin' | 'researcher';
export type PostType = 'research' | 'field_study' | 'opinion';
export type PostStatus = 'draft' | 'submitted' | 'under_review' | 'published' | 'rejected';
export type MediaType = 'video' | 'image' | 'document';
export type ModerationAction = 'submitted' | 'approved' | 'rejected' | 'revision_requested';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          role: UserRole;
          bio: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          role?: UserRole;
          bio?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          role?: UserRole;
          bio?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string | null;
          type: PostType;
          status: PostStatus;
          author_id: string;
          category_id: string | null;
          featured_image_url: string | null;
          document_url: string | null;
          view_count: number;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content: string;
          excerpt?: string | null;
          type: PostType;
          status?: PostStatus;
          author_id: string;
          category_id?: string | null;
          featured_image_url?: string | null;
          document_url?: string | null;
          view_count?: number;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          excerpt?: string | null;
          type?: PostType;
          status?: PostStatus;
          author_id?: string;
          category_id?: string | null;
          featured_image_url?: string | null;
          document_url?: string | null;
          view_count?: number;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      post_tags: {
        Row: {
          post_id: string;
          tag_id: string;
          created_at: string;
        };
        Insert: {
          post_id: string;
          tag_id: string;
          created_at?: string;
        };
        Update: {
          post_id?: string;
          tag_id?: string;
          created_at?: string;
        };
      };
      media: {
                    Row: {
                  id(id: (id: any) => void): void;
                  id(id: any): void;
                  _id: string;
                  title: string;
                  description: string | null;
                  type: "image" | "video" | "document";
                  url: string;
                  thumbnail_url: string | null;
                  file_size: number | null;
                  duration: number | null;
                  uploaded_by: string;
                  post_id: string | null;
                  status: "pending" | "published";   // ✅ ADD THIS
                  approved_by: string | null;         // ✅ ADD THIS
                  created_at: string;
                };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          type: MediaType;
          url: string;
          thumbnail_url?: string | null;
          file_size?: number | null;
          duration?: number | null;
          uploaded_by: string;
          post_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          type?: MediaType;
          url?: string;
          thumbnail_url?: string | null;
          file_size?: number | null;
          duration?: number | null;
          uploaded_by?: string;
          post_id?: string | null;
          created_at?: string;
        };
      };
      moderation_log: {
        Row: {
          id: string;
          post_id: string;
          moderator_id: string;
          action: ModerationAction;
          feedback: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          moderator_id: string;
          action: ModerationAction;
          feedback?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          moderator_id?: string;
          action?: ModerationAction;
          feedback?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
