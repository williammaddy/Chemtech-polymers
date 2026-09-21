import { createClient } from '@supabase/supabase-js';
import type { Database, ProductRow, CategoryRow, ResourceRow, GalleryImageRow, ContactInfoRow } from '../types/database';
import { productsData, productCategories, Product } from '../data/productsData';
import { articlesData } from '../data/articlesData';
import { CONTACT_INFO } from '../config/contactInfo';

// Read env variables safely in Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-id')
);

export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

// ============================================================
// ADAPTER HELPERS (convert static types to DB rows if needed)
// ============================================================

function mapProductToRow(p: Product): ProductRow {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category_slug: p.categorySlug,
    code: p.code,
    tagline: p.tagline,
    short_desc: p.shortDesc,
    description: p.longDesc,
    image_url: p.image,
    pdf_url: p.pdfUrl,
    specs: p.specs,
    features: p.features,
    applications: p.applications,
    curing_notes: p.curingNotes || null,
    badge: p.badge,
    accent_color: p.accentColor,
    created_at: new Date().toISOString(),
  };
}

function mapCategoryToRow(c: typeof productCategories[0]): CategoryRow {
  return {
    id: c.slug,
    slug: c.slug,
    name: c.name,
    short_name: c.shortName,
    category_number: c.categoryNumber,
    headline: c.headline,
    description: c.description,
    banner_image_url: c.bannerImage,
    icon_name: c.iconName,
    accent_color: c.accentColor,
    created_at: new Date().toISOString(),
  };
}

function mapArticleToRow(a: typeof articlesData[0]): ResourceRow {
  return {
    id: a.slug,
    slug: a.slug,
    title: a.title,
    subtitle: a.subtitle,
    category: a.category,
    teaser: a.summary,
    body: a.overview,
    image_url: a.image,
    badge_color: a.badgeColor,
    read_time: a.readTime,
    publish_date: a.publishDate,
    author: a.author,
    created_at: new Date().toISOString(),
  };
}

// ============================================================
// PRODUCTS CRUD (with Local Cache Fallback)
// ============================================================

const LOCAL_PRODUCTS_KEY = 'chemtech_products_cache';

function getLocalProducts(): ProductRow[] {
  try {
    const cached = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error reading local products cache:', e);
  }
  const initial = productsData.map(mapProductToRow);
  try {
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(initial));
  } catch (e) {}
  return initial;
}

function saveLocalProducts(products: ProductRow[]) {
  try {
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Error saving local products cache:', e);
  }
}

export async function getProducts(): Promise<ProductRow[]> {
  if (!isSupabaseConfigured) {
    return getLocalProducts();
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn('Supabase getProducts returned no data or error, falling back to local dataset:', error);
      return getLocalProducts();
    }

    return data as ProductRow[];
  } catch (err) {
    console.error('Error fetching products from Supabase:', err);
    return getLocalProducts();
  }
}

export async function getProductBySlug(slug: string): Promise<ProductRow | null> {
  if (!isSupabaseConfigured) {
    const local = getLocalProducts();
    const found = local.find((p) => p.slug === slug);
    return found || null;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) {
      const local = getLocalProducts();
      const fallback = local.find((p) => p.slug === slug);
      return fallback || null;
    }

    return data as ProductRow;
  } catch (err) {
    console.error(`Error fetching product ${slug} from Supabase:`, err);
    const local = getLocalProducts();
    const fallback = local.find((p) => p.slug === slug);
    return fallback || null;
  }
}

export async function createProduct(product: Partial<ProductRow> & { id: string; slug: string; name: string; category_slug: string }): Promise<ProductRow> {
  const newRow: ProductRow = {
    id: product.id || `prod-${Date.now()}`,
    slug: product.slug,
    name: product.name,
    category_slug: product.category_slug,
    code: product.code || '',
    tagline: product.tagline || '',
    short_desc: product.short_desc || '',
    description: product.description || '',
    badge: product.badge || null,
    accent_color: product.accent_color || '#2B3A8F',
    image_url: product.image_url || '',
    pdf_url: product.pdf_url || null,
    specs: product.specs || {},
    features: product.features || [],
    applications: product.applications || [],
    curing_notes: product.curing_notes || '',
    created_at: new Date().toISOString(),
  };

  if (!isSupabaseConfigured) {
    const prods = getLocalProducts();
    prods.unshift(newRow);
    saveLocalProducts(prods);
    return newRow;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      // @ts-ignore
      .insert([product])
      .select()
      .maybeSingle();

    if (error || !data) {
      console.warn('Supabase createProduct failed, saving locally:', error);
      const prods = getLocalProducts();
      prods.unshift(newRow);
      saveLocalProducts(prods);
      return newRow;
    }
    return data as ProductRow;
  } catch (err) {
    console.warn('Supabase createProduct exception, saving locally:', err);
    const prods = getLocalProducts();
    prods.unshift(newRow);
    saveLocalProducts(prods);
    return newRow;
  }
}

export async function updateProduct(id: string, updates: Partial<ProductRow>): Promise<ProductRow> {
  if (!isSupabaseConfigured) {
    const prods = getLocalProducts();
    const index = prods.findIndex((p) => p.id === id || p.slug === id);
    if (index !== -1) {
      prods[index] = { ...prods[index], ...updates };
      saveLocalProducts(prods);
      return prods[index];
    }
    const updated = { id, ...updates } as ProductRow;
    prods.push(updated);
    saveLocalProducts(prods);
    return updated;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      // @ts-ignore
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (!error && data) {
      const prods = getLocalProducts();
      const index = prods.findIndex((p) => p.id === id || p.slug === id);
      if (index !== -1) {
        prods[index] = data as ProductRow;
        saveLocalProducts(prods);
      }
      return data as ProductRow;
    }

    // Try fallback by slug if id wasn't matched in Supabase
    const { data: dataBySlug, error: slugError } = await supabase
      .from('products')
      // @ts-ignore
      .update(updates)
      .eq('slug', id)
      .select()
      .maybeSingle();

    if (!slugError && dataBySlug) {
      const prods = getLocalProducts();
      const index = prods.findIndex((p) => p.id === id || p.slug === id);
      if (index !== -1) {
        prods[index] = dataBySlug as ProductRow;
        saveLocalProducts(prods);
      }
      return dataBySlug as ProductRow;
    }

    throw new Error(
      error?.message || slugError?.message || 'Failed to update product in the database.'
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update product in the database.';
    throw new Error(message);
  }
}

export async function deleteProduct(id: string): Promise<void> {
  const prods = getLocalProducts();
  const filtered = prods.filter((p) => p.id !== id && p.slug !== id);
  saveLocalProducts(filtered);

  if (!isSupabaseConfigured) {
    return;
  }

  try {
    await supabase.from('products').delete().eq('id', id);
    await supabase.from('products').delete().eq('slug', id);
  } catch (err) {
    console.warn('Supabase deleteProduct error:', err);
  }
}

// ============================================================
// CATEGORIES CRUD
// ============================================================

export async function getCategories(): Promise<CategoryRow[]> {
  if (!isSupabaseConfigured) {
    return productCategories.map(mapCategoryToRow);
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('category_number', { ascending: true });

    if (error || !data || data.length === 0) {
      return productCategories.map(mapCategoryToRow);
    }

    return data as CategoryRow[];
  } catch (err) {
    console.error('Error fetching categories from Supabase:', err);
    return productCategories.map(mapCategoryToRow);
  }
}

export async function getCategoryBySlug(slug: string): Promise<CategoryRow | null> {
  if (!isSupabaseConfigured) {
    const found = productCategories.find((c) => c.slug === slug);
    return found ? mapCategoryToRow(found) : null;
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) {
      const fallback = productCategories.find((c) => c.slug === slug);
      return fallback ? mapCategoryToRow(fallback) : null;
    }

    return data as CategoryRow;
  } catch (err) {
    console.error(`Error fetching category ${slug} from Supabase:`, err);
    const fallback = productCategories.find((c) => c.slug === slug);
    return fallback ? mapCategoryToRow(fallback) : null;
  }
}

// ============================================================
// RESOURCES / ARTICLES CRUD
// ============================================================

export async function getResources(): Promise<ResourceRow[]> {
  if (!isSupabaseConfigured) {
    return articlesData.map(mapArticleToRow);
  }

  try {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return articlesData.map(mapArticleToRow);
    }

    return data as ResourceRow[];
  } catch (err) {
    console.error('Error fetching resources from Supabase:', err);
    return articlesData.map(mapArticleToRow);
  }
}

export async function getResourceBySlug(slug: string): Promise<ResourceRow | null> {
  if (!isSupabaseConfigured) {
    const found = articlesData.find((a) => a.slug === slug);
    return found ? mapArticleToRow(found) : null;
  }

  try {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) {
      const fallback = articlesData.find((a) => a.slug === slug);
      return fallback ? mapArticleToRow(fallback) : null;
    }

    return data as ResourceRow;
  } catch (err) {
    console.error(`Error fetching resource ${slug} from Supabase:`, err);
    const fallback = articlesData.find((a) => a.slug === slug);
    return fallback ? mapArticleToRow(fallback) : null;
  }
}

export async function createResource(resource: Partial<ResourceRow> & { slug: string; title: string }): Promise<ResourceRow> {
  const { data, error } = await supabase
    .from('resources')
    // @ts-ignore
    .insert([resource])
    .select()
    .single();

  if (error) throw error;
  return data as ResourceRow;
}

export async function updateResource(id: string, updates: Partial<ResourceRow>): Promise<ResourceRow> {
  const { data, error } = await supabase
    .from('resources')
    // @ts-ignore
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as ResourceRow;
}

export async function deleteResource(id: string): Promise<void> {
  const { error } = await supabase
    .from('resources')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============================================================
// GALLERY IMAGES CRUD
// ============================================================

// Default initial gallery items for preview if DB is empty
const defaultGallery: GalleryImageRow[] = [
  {
    id: 'g1',
    image_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    caption: 'Fine mesh screen print on 100% combed cotton jersey',
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'g2',
    image_url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
    caption: 'Vibrant non-PVC Acrysol spot color print with zero hand-feel',
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'g3',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    caption: 'High-density 3D sculptural gel accent on athletic activewear',
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: 'g4',
    image_url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
    caption: 'Brilliant metallic gold flake paste on heavy fleece hoodie',
    sort_order: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: 'g5',
    image_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    caption: 'Precision thermal litho-transfer adhesive application',
    sort_order: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: 'g6',
    image_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80',
    caption: 'Artisan hand-pulled studio print using Craft Ink Opaque White',
    sort_order: 6,
    created_at: new Date().toISOString(),
  },
];

export async function getGalleryImages(): Promise<GalleryImageRow[]> {
  if (!isSupabaseConfigured) {
    return defaultGallery;
  }

  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return defaultGallery;
    }

    return data as GalleryImageRow[];
  } catch (err) {
    console.error('Error fetching gallery images from Supabase:', err);
    return defaultGallery;
  }
}

export async function createGalleryImage(image: { image_url: string; caption?: string; sort_order?: number }): Promise<GalleryImageRow> {
  const { data, error } = await supabase
    .from('gallery_images')
    // @ts-ignore
    .insert([image])
    .select()
    .single();

  if (error) throw error;
  return data as GalleryImageRow;
}

export async function updateGalleryImage(id: string, updates: Partial<GalleryImageRow>): Promise<GalleryImageRow> {
  const { data, error } = await supabase
    .from('gallery_images')
    // @ts-ignore
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as GalleryImageRow;
}

export async function updateGalleryOrder(items: { id: string; sort_order: number }[]): Promise<void> {
  for (const item of items) {
    await supabase
      .from('gallery_images')
      // @ts-ignore
      .update({ sort_order: item.sort_order })
      .eq('id', item.id);
  }
}

export async function deleteGalleryImage(id: string): Promise<void> {
  const { error } = await supabase
    .from('gallery_images')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============================================================
// CONTACT INFO CRUD (with Local Cache Fallback)
// ============================================================

const LOCAL_CONTACT_KEY = 'chemtech_contact_cache';

export async function getContactInfo(): Promise<ContactInfoRow> {
  const defaultContact: ContactInfoRow = {
    id: 'default',
    phone: CONTACT_INFO.phone,
    phone_support: CONTACT_INFO.phoneSupport,
    phone_sales: CONTACT_INFO.phoneSales,
    email: CONTACT_INFO.emailPrimary,
    email_sales: CONTACT_INFO.emailSales,
    address: CONTACT_INFO.address,
    whatsapp_number: CONTACT_INFO.whatsappNumber,
    map_embed_url: CONTACT_INFO.mapEmbedUrl,
    hours: CONTACT_INFO.hours,
    formspree_endpoint: CONTACT_INFO.formspreeEndpoint,
  };

  try {
    const cached = localStorage.getItem(LOCAL_CONTACT_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (
        parsed &&
        typeof parsed === 'object' &&
        !parsed.phone_support?.includes('63791') &&
        !parsed.email?.includes('contact@chemtechpolymers.com') &&
        !parsed.address?.includes('Industrial Area')
      ) {
        return { ...defaultContact, ...parsed };
      } else {
        localStorage.removeItem(LOCAL_CONTACT_KEY);
      }
    }
  } catch (e) {}

  if (!isSupabaseConfigured) {
    return defaultContact;
  }

  try {
    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return defaultContact;
    }

    return data as ContactInfoRow;
  } catch (err) {
    console.error('Error fetching contact info from Supabase:', err);
    return defaultContact;
  }
}

export async function updateContactInfo(updates: Partial<ContactInfoRow>): Promise<ContactInfoRow> {
  const current = await getContactInfo();
  const merged = { ...current, ...updates };
  try {
    localStorage.setItem(LOCAL_CONTACT_KEY, JSON.stringify(merged));
  } catch (e) {}

  if (!isSupabaseConfigured) {
    return merged;
  }

  try {
    const { data: existing } = await supabase
      .from('contact_info')
      .select('id')
      .limit(1)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from('contact_info')
        // @ts-ignore
        .update(updates)
        .eq('id', (existing as any).id)
        .select()
        .maybeSingle();

      if (!error && data) return data as ContactInfoRow;
    } else {
      const { data, error } = await supabase
        .from('contact_info')
        // @ts-ignore
        .insert([updates])
        .select()
        .maybeSingle();

      if (!error && data) return data as ContactInfoRow;
    }
    return merged;
  } catch (err) {
    console.warn('Supabase updateContactInfo error, using cached local updates:', err);
    return merged;
  }
}

// ============================================================
// STORAGE HELPERS (with Blob URL Fallback)
// ============================================================

function sanitizeStoragePath(filePath: string): string {
  return filePath.replace(/[^a-zA-Z0-9._/-]/g, '-');
}

export async function uploadFile(
  bucket: 'product-images' | 'product-pdfs' | 'gallery-images' | 'category-banners' | 'resource-images',
  filePath: string,
  file: File
): Promise<string> {
  const safePath = sanitizeStoragePath(filePath);

  if (!isSupabaseConfigured) {
    return URL.createObjectURL(file);
  }

  const { error: uploadError } = await supabase.storage.from(bucket).upload(safePath, file, {
    upsert: true,
    cacheControl: '3600',
    contentType: file.type || undefined,
  });

  if (uploadError) {
    throw new Error(uploadError.message || `Failed to upload file to ${bucket}.`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(safePath);
  if (!data?.publicUrl) {
    throw new Error('Upload succeeded but no public URL was returned.');
  }

  return data.publicUrl;
}

export async function deleteStorageFile(bucket: string, filePath: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    const { error } = await supabase.storage.from(bucket).remove([filePath]);
    if (error) console.error(`Failed to remove file ${filePath} from bucket ${bucket}:`, error);
  } catch (err) {
    console.warn(`Supabase deleteStorageFile error:`, err);
  }
}
