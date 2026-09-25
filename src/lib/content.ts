export const CATEGORY_SLUG_ALIASES: Record<string, string[]> = {
  'non-pvc-inks': ['non-pvc-inks', 'non-pvc-acrysol'],
  'non-pvc-acrysol': ['non-pvc-inks', 'non-pvc-acrysol'],
  'speciality-inks': ['speciality-inks', 'specialty-inks', 'specialty'],
  'specialty-inks': ['speciality-inks', 'specialty-inks', 'specialty'],
  'heat-transfer-solutions': ['heat-transfer-solutions', 'heat-transfer'],
  'heat-transfer': ['heat-transfer-solutions', 'heat-transfer'],
  'craft-inks': ['craft-inks', 'craft-ink'],
  'craft-ink': ['craft-inks', 'craft-ink'],
};

export function categorySlugCandidates(slug?: string | null): string[] {
  if (!slug) return [];
  const key = slug.toLowerCase();
  return CATEGORY_SLUG_ALIASES[key] || [key];
}

export function matchCategorySlug(prodCat?: string | null, catSlug?: string | null): boolean {
  if (!prodCat || !catSlug) return false;
  const productSlugs = categorySlugCandidates(prodCat);
  const targetSlugs = categorySlugCandidates(catSlug);
  return productSlugs.some((slug) => targetSlugs.includes(slug));
}

export function getProductPdfUrl(product: any): string {
  const pdf = product?.pdfUrl || product?.pdf_url || '';
  if (pdf && !String(pdf).startsWith('blob:')) return pdf;
  if (product?.slug) return `/assets/pdfs/${product.slug}.pdf`;
  return '';
}

export function presentProduct(p: any) {
  if (!p) return p;
  const image = p.image_url || p.image || '';
  const pdf = p.pdf_url || p.pdfUrl || '';
  const categorySlug = p.category_slug || p.categorySlug || '';
  return {
    ...p,
    id: p.id || p.slug,
    image,
    image_url: image,
    pdfUrl: pdf,
    pdf_url: pdf,
    categorySlug,
    category_slug: categorySlug,
    shortDesc: p.short_desc || p.shortDesc || '',
    short_desc: p.short_desc || p.shortDesc || '',
    longDesc: p.description || p.longDesc || '',
    description: p.description || p.longDesc || '',
    curingNotes: p.curing_notes || p.curingNotes || '',
    curing_notes: p.curing_notes || p.curingNotes || '',
    accentColor: p.accent_color || p.accentColor || '',
    accent_color: p.accent_color || p.accentColor || '',
    features: Array.isArray(p.features) ? p.features : [],
    applications: Array.isArray(p.applications) ? p.applications : [],
    specs: p.specs || {},
  };
}

export function presentCategory(c: any) {
  if (!c) return c;
  return {
    ...c,
    id: c.id || c.slug,
    bannerImage: c.banner_image_url || c.bannerImage || '',
    banner_image_url: c.banner_image_url || c.bannerImage || '',
    shortName: c.short_name || c.shortName || '',
    short_name: c.short_name || c.shortName || '',
    categoryNumber: c.category_number || c.categoryNumber || '',
    category_number: c.category_number || c.categoryNumber || '',
    iconName: c.icon_name || c.iconName || '',
    icon_name: c.icon_name || c.iconName || '',
    accentColor: c.accent_color || c.accentColor || '',
    accent_color: c.accent_color || c.accentColor || '',
  };
}

export function presentResource(r: any) {
  if (!r) return r;
  return {
    ...r,
    id: r.id || r.slug,
    summary: r.teaser || r.summary || '',
    teaser: r.teaser || r.summary || '',
    overview: r.body || r.overview || '',
    body: r.body || r.overview || '',
    image: r.image_url || r.image || '',
    image_url: r.image_url || r.image || '',
    badgeColor: r.badge_color || r.badgeColor || '#0284C7',
    badge_color: r.badge_color || r.badgeColor || '#0284C7',
    readTime: r.read_time || r.readTime || '5 min read',
    read_time: r.read_time || r.readTime || '5 min read',
    publishDate: r.publish_date || r.publishDate || '',
    publish_date: r.publish_date || r.publishDate || '',
    takeaways: Array.isArray(r.takeaways) ? r.takeaways : [],
    sections: Array.isArray(r.sections) ? r.sections : [],
  };
}

export function presentContact(c: any, fallback: any = {}) {
  const merged = { ...fallback, ...(c || {}) };
  return {
    ...merged,
    phone: merged.phone || '',
    phoneSupport: merged.phone_support || merged.phoneSupport || '',
    phone_support: merged.phone_support || merged.phoneSupport || '',
    phoneSales: merged.phone_sales || merged.phoneSales || '',
    phone_sales: merged.phone_sales || merged.phoneSales || '',
    email: merged.email || merged.emailPrimary || '',
    emailPrimary: merged.email || merged.emailPrimary || '',
    emailSales: merged.email_sales || merged.emailSales || '',
    email_sales: merged.email_sales || merged.emailSales || '',
    whatsappNumber: merged.whatsapp_number || merged.whatsappNumber || '',
    whatsapp_number: merged.whatsapp_number || merged.whatsappNumber || '',
    mapEmbedUrl: merged.map_embed_url || merged.mapEmbedUrl || '',
    map_embed_url: merged.map_embed_url || merged.mapEmbedUrl || '',
    formspreeEndpoint: merged.formspree_endpoint || merged.formspreeEndpoint || '',
    formspree_endpoint: merged.formspree_endpoint || merged.formspreeEndpoint || '',
    hours: merged.hours || '',
    address: merged.address || '',
  };
}
