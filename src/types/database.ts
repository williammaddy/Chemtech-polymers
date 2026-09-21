export interface CategoryRow {
  id: string;
  slug: string;
  name: string;
  short_name?: string | null;
  category_number?: string | null;
  headline?: string | null;
  description?: string | null;
  banner_image_url?: string | null;
  icon_name?: string | null;
  accent_color?: string | null;
  created_at?: string;
}

export interface ProductRow {
  id: string;
  slug: string;
  name: string;
  category_id?: string | null;
  category_slug: string;
  code?: string | null;
  tagline?: string | null;
  short_desc?: string | null;
  description?: string | null;
  image_url?: string | null;
  pdf_url?: string | null;
  specs: {
    meshCount?: string;
    cureTemp?: string;
    viscosity?: string;
    washFastness?: string;
    chemistry?: string;
    shelfLife?: string;
    durometer?: string;
    [key: string]: any;
  };
  features?: string[];
  applications?: string[];
  curing_notes?: string | null;
  badge?: string | null;
  accent_color?: string | null;
  created_at?: string;
}

export interface ResourceRow {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  category?: string | null;
  teaser?: string | null;
  body?: string | null;
  image_url?: string | null;
  badge_color?: string | null;
  read_time?: string | null;
  publish_date?: string | null;
  author?: string | null;
  created_at?: string;
}

export interface GalleryImageRow {
  id: string;
  image_url: string;
  caption?: string | null;
  sort_order: number;
  created_at?: string;
}

export interface ContactInfoRow {
  id: string;
  phone?: string | null;
  phone_support?: string | null;
  phone_sales?: string | null;
  email?: string | null;
  email_sales?: string | null;
  address?: string | null;
  whatsapp_number?: string | null;
  map_embed_url?: string | null;
  hours?: string | null;
  formspree_endpoint?: string | null;
  created_at?: string;
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: CategoryRow;
        Insert: Partial<CategoryRow> & { slug: string; name: string };
        Update: Partial<CategoryRow>;
      };
      products: {
        Row: ProductRow;
        Insert: Partial<ProductRow> & { id: string; slug: string; name: string; category_slug: string };
        Update: Partial<ProductRow>;
      };
      resources: {
        Row: ResourceRow;
        Insert: Partial<ResourceRow> & { slug: string; title: string };
        Update: Partial<ResourceRow>;
      };
      gallery_images: {
        Row: GalleryImageRow;
        Insert: Partial<GalleryImageRow> & { image_url: string };
        Update: Partial<GalleryImageRow>;
      };
      contact_info: {
        Row: ContactInfoRow;
        Insert: Partial<ContactInfoRow>;
        Update: Partial<ContactInfoRow>;
      };
    };
  };
}
