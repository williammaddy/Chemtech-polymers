import type { Database, ProductRow, CategoryRow, ResourceRow, GalleryImageRow, ContactInfoRow } from '../types/database';
import { productsData, productCategories, Product } from '../data/productsData';
import { articlesData } from '../data/articlesData';
import { CONTACT_INFO } from '../config/contactInfo';

// MongoDB Atlas is the active database
export const isDatabaseConnected = true;
export const isSupabaseConfigured = true;

// Mock supabase client to satisfy any legacy direct references without errors
export const supabase = {
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null }),
  }),
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
      remove: () => Promise.resolve({ data: null, error: null }),
    }),
  },
  auth: {
    getSession: () => Promise.resolve({ data: { session: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: () => Promise.resolve({ data: {}, error: null }),
    signOut: () => Promise.resolve({ error: null }),
  },
} as any;

// Helper to call MongoDB Atlas backend API with error safety
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  const isMutation = Boolean(options?.method && options.method.toUpperCase() !== 'GET');
  try {
    const res = await fetch(`/api${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      ...options,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err: any) {
    console.warn(`API call /api${endpoint} failed:`, err);
    if (isMutation) {
      throw err;
    }
    return null;
  }
}

// Convert file to Base64 for MongoDB storage
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

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
// PRODUCTS CRUD (Powered by MongoDB Atlas with Local Cache Fallback)
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
  const fromApi = await apiFetch<ProductRow[]>('/products');
  if (fromApi && Array.isArray(fromApi) && fromApi.length > 0) {
    saveLocalProducts(fromApi);
    return fromApi;
  }
  return getLocalProducts();
}

export async function getProductBySlug(slug: string): Promise<ProductRow | null> {
  const fromApi = await apiFetch<ProductRow>(`/products/${slug}`);
  if (fromApi) return fromApi;
  const local = getLocalProducts();
  return local.find((p) => p.slug === slug || p.id === slug) || null;
}

export async function createProduct(product: Partial<ProductRow> & { id: string; slug: string; name: string; category_slug: string }): Promise<ProductRow> {
  const cleanSlug = product.slug || product.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const newRow: ProductRow = {
    id: product.id || `prod-${Date.now()}`,
    slug: cleanSlug,
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

  const fromApi = await apiFetch<ProductRow>('/products', {
    method: 'POST',
    body: JSON.stringify(newRow),
  });

  const prods = getLocalProducts();
  const saved = fromApi || newRow;
  prods.unshift(saved);
  saveLocalProducts(prods);
  return saved;
}

export async function updateProduct(id: string, updates: Partial<ProductRow>): Promise<ProductRow> {
  const fromApi = await apiFetch<ProductRow>(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });

  const prods = getLocalProducts();
  const index = prods.findIndex((p) => p.id === id || p.slug === id);
  const updatedItem = fromApi || (index !== -1 ? { ...prods[index], ...updates } : ({ id, ...updates } as ProductRow));

  if (index !== -1) {
    prods[index] = updatedItem;
  } else {
    prods.push(updatedItem);
  }
  saveLocalProducts(prods);
  return updatedItem;
}

export async function deleteProduct(id: string): Promise<void> {
  await apiFetch(`/products/${id}`, { method: 'DELETE' });
  const prods = getLocalProducts().filter((p) => p.id !== id && p.slug !== id);
  saveLocalProducts(prods);
}

// ============================================================
// CATEGORIES CRUD
// ============================================================

export async function getCategories(): Promise<CategoryRow[]> {
  const fromApi = await apiFetch<CategoryRow[]>('/categories');
  if (fromApi && Array.isArray(fromApi) && fromApi.length > 0) {
    return fromApi;
  }
  return productCategories.map(mapCategoryToRow);
}

export async function getCategoryBySlug(slug: string): Promise<CategoryRow | null> {
  const fromApi = await apiFetch<CategoryRow>(`/categories/${slug}`);
  if (fromApi) return fromApi;
  const fallback = productCategories.find((c) => c.slug === slug);
  return fallback ? mapCategoryToRow(fallback) : null;
}

export async function updateCategory(id: string, updates: Partial<CategoryRow>): Promise<CategoryRow> {
  const fromApi = await apiFetch<CategoryRow>(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  return fromApi || ({ id, ...updates } as CategoryRow);
}

// ============================================================
// RESOURCES / ARTICLES CRUD
// ============================================================

export async function getResources(): Promise<ResourceRow[]> {
  const fromApi = await apiFetch<ResourceRow[]>('/resources');
  if (fromApi && Array.isArray(fromApi) && fromApi.length > 0) {
    return fromApi;
  }
  return articlesData.map(mapArticleToRow);
}

export async function getResourceBySlug(slug: string): Promise<ResourceRow | null> {
  const fromApi = await apiFetch<ResourceRow>(`/resources/${slug}`);
  if (fromApi) return fromApi;
  const found = articlesData.find((a) => a.slug === slug);
  return found ? mapArticleToRow(found) : null;
}

export async function createResource(resource: Partial<ResourceRow>): Promise<ResourceRow> {
  const fromApi = await apiFetch<ResourceRow>('/resources', {
    method: 'POST',
    body: JSON.stringify(resource),
  });
  return fromApi || ({ id: `res-${Date.now()}`, ...resource } as ResourceRow);
}

export async function updateResource(id: string, updates: Partial<ResourceRow>): Promise<ResourceRow> {
  const fromApi = await apiFetch<ResourceRow>(`/resources/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  return fromApi || ({ id, ...updates } as ResourceRow);
}

export async function deleteResource(id: string): Promise<void> {
  await apiFetch(`/resources/${id}`, { method: 'DELETE' });
}

// ============================================================
// GALLERY IMAGES CRUD
// ============================================================

const defaultGallery: GalleryImageRow[] = [];

export async function getGalleryImages(): Promise<GalleryImageRow[]> {
  const fromApi = await apiFetch<GalleryImageRow[]>('/gallery');
  if (fromApi && Array.isArray(fromApi)) {
    return fromApi;
  }
  return defaultGallery;
}

export async function createGalleryImage(image: { image_url: string; caption?: string; sort_order?: number }): Promise<GalleryImageRow> {
  const fromApi = await apiFetch<GalleryImageRow>('/gallery', {
    method: 'POST',
    body: JSON.stringify(image),
  });
  return fromApi || ({ id: `gal-${Date.now()}`, ...image, sort_order: image.sort_order || 0 } as GalleryImageRow);
}

export async function updateGalleryImage(id: string, updates: Partial<GalleryImageRow>): Promise<GalleryImageRow> {
  const fromApi = await apiFetch<GalleryImageRow>('/gallery', {
    method: 'PUT',
    body: JSON.stringify({ id, ...updates }),
  });
  return fromApi || ({ id, ...updates } as GalleryImageRow);
}

export async function updateGalleryOrder(items: { id: string; sort_order: number }[]): Promise<void> {
  await apiFetch('/gallery', {
    method: 'PUT',
    body: JSON.stringify({ items }),
  });
}

export async function deleteGalleryImage(id: string): Promise<void> {
  await apiFetch(`/gallery/${id}`, { method: 'DELETE' });
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

  const fromApi = await apiFetch<ContactInfoRow>('/contact');
  if (fromApi) {
    try {
      localStorage.setItem(LOCAL_CONTACT_KEY, JSON.stringify(fromApi));
    } catch (e) {}
    return { ...defaultContact, ...fromApi };
  }

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

  return defaultContact;
}

export async function updateContactInfo(updates: Partial<ContactInfoRow>): Promise<ContactInfoRow> {
  const fromApi = await apiFetch<ContactInfoRow>('/contact', {
    method: 'PUT',
    body: JSON.stringify(updates),
  });

  const merged = { ...updates, ...(fromApi || {}) };
  try {
    localStorage.setItem(LOCAL_CONTACT_KEY, JSON.stringify(merged));
  } catch (e) {}
  return merged as ContactInfoRow;
}

// ============================================================
// STORAGE HELPERS (MongoDB Atlas Files Collection + Blob Fallback)
// ============================================================

export async function uploadFile(
  bucket: 'product-images' | 'product-pdfs' | 'gallery-images' | 'category-banners' | 'resource-images' | string,
  filePath: string,
  file: File
): Promise<string> {
  try {
    const base64Data = await fileToBase64(file);
    const filename = filePath || file.name;
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename,
        contentType: file.type || (filename.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream'),
        base64Data,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.url) return data.url;
    }
  } catch (err) {
    console.warn('API upload to MongoDB failed, falling back to object URL:', err);
  }
  return URL.createObjectURL(file);
}

export async function deleteStorageFile(bucket: string, filePath: string): Promise<void> {
  try {
    const fileId = filePath.replace('/api/files/', '');
    await fetch(`/api/files/${fileId}`, { method: 'DELETE' });
  } catch (err) {
    console.warn('Delete file error:', err);
  }
}
