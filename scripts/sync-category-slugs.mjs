import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://cfearless485_db_user:cgtxpFX0jQtFZb1j@cluster0.btaeqbx.mongodb.net/?retryWrites=true&w=majority";
const dbName = "chemtech_db";

const standardCategories = [
  {
    id: "water-base-inks",
    slug: "water-base-inks",
    name: "Water Base Inks",
    short_name: "Water Base",
    category_number: "Category 01",
    headline: "Eco-Conscious Soft-Touch Chemistry",
    description: "Ecologically conscious water-dispersible formulations engineered for zero-feel softness, maximum breathability, and deep pigment penetration on luxury fashion cotton.",
    banner_image_url: "/assets/water based ink texture macro-BKh2Zgn4.jpeg",
    icon_name: "Droplets",
    accent_color: "var(--color-secondary-green)",
    created_at: new Date().toISOString()
  },
  {
    id: "non-pvc-acrysol",
    slug: "non-pvc-acrysol",
    name: "Non-PVC Oil Base Inks (Acrysol)",
    short_name: "Non-PVC Acrysol",
    category_number: "Category 02",
    headline: "Zero PVC Performance for High-Speed Automation",
    description: "Next-generation Acrysol acrylic polymer systems offering traditional plastisol opacity, runnability, and speed without any vinyl chloride polymers or toxic plasticizers.",
    banner_image_url: "/assets/colorful pigment ink swirl--F2hLh4O.jpeg",
    icon_name: "ShieldCheck",
    accent_color: "var(--color-accent-orange)",
    created_at: new Date().toISOString()
  },
  {
    id: "plastisol-inks",
    slug: "plastisol-inks",
    name: "Phthalate-Free Plastisol Inks",
    short_name: "Plastisol Inks",
    category_number: "Category 03",
    headline: "Industrial Heavy-Duty Print Workhorse",
    description: "Industrial workhorse durability with heavy opacity, zero screen drying during press halts, rapid platen flash times, and complete international phthalate compliance.",
    banner_image_url: "/assets/plastisol ink paste texture-BC5vwKLf.jpg",
    icon_name: "Zap",
    accent_color: "var(--color-accent-red)",
    created_at: new Date().toISOString()
  },
  {
    id: "specialty-inks",
    slug: "specialty-inks",
    name: "Specialty Inks & Tactile Gels",
    short_name: "Specialty Gels",
    category_number: "Category 04",
    headline: "Multi-Dimensional Luxury Fashion Embellishments",
    description: "Premium sensory finishes engineered for luxury fashion, retail apparel, and eye-catching promotional prints including Foil, Glitter, HD 3D relief, Foam, and Metallic leafing.",
    banner_image_url: "/assets/glitter metallic ink macro-CTM4eUzm.jpg",
    icon_name: "Sparkles",
    accent_color: "var(--color-accent-purple)",
    created_at: new Date().toISOString()
  },
  {
    id: "heat-transfer",
    slug: "heat-transfer",
    name: "Heat Transfer Application",
    short_name: "Heat Transfer",
    category_number: "Category 05",
    headline: "Engineered Foundations & Thermal Adhesives",
    description: "Engineered backing whites and high-tack adhesive bonding gels designed for crisp, permanent tagless neck labels and multi-color heat transfer embellishments.",
    banner_image_url: "/assets/heat press textile machine-DOKliBsz.jpg",
    icon_name: "Layers",
    accent_color: "var(--color-accent-teal)",
    created_at: new Date().toISOString()
  },
  {
    id: "craft-ink",
    slug: "craft-ink",
    name: "Craft Inks",
    short_name: "Craft Ink",
    category_number: "Category 06",
    headline: "Specialty Studio & Hand Printing Range",
    description: "Formulations engineered for artisanal screen printing studios, craft decorators, sampling departments, and hobbyists requiring air-dry capabilities.",
    banner_image_url: "/assets/craft ink colorful supplies-DqywN_UU.webp",
    icon_name: "Palette",
    accent_color: "var(--color-accent-gold)",
    created_at: new Date().toISOString()
  }
];

async function sync() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas!");
    const db = client.db(dbName);

    // 1. Replace categories collection with standardized slugs
    const catCol = db.collection('categories');
    await catCol.deleteMany({});
    await catCol.insertMany(standardCategories);
    console.log("Updated categories with standardized website slugs.");

    // 2. Update existing products' category_slug to match standard website slugs
    const prodCol = db.collection('products');
    
    // Update non-pvc
    await prodCol.updateMany(
      { category_slug: { $in: ['non-pvc-inks', 'non-pvc-acrysol'] } },
      { $set: { category_slug: 'non-pvc-acrysol' } }
    );
    // Update specialty
    await prodCol.updateMany(
      { category_slug: { $in: ['speciality-inks', 'specialty-inks'] } },
      { $set: { category_slug: 'specialty-inks' } }
    );
    // Update heat transfer
    await prodCol.updateMany(
      { category_slug: { $in: ['heat-transfer-solutions', 'heat-transfer'] } },
      { $set: { category_slug: 'heat-transfer' } }
    );
    // Update craft ink
    await prodCol.updateMany(
      { category_slug: { $in: ['craft-inks', 'craft-ink'] } },
      { $set: { category_slug: 'craft-ink' } }
    );

    console.log("Updated all products' category_slug values to match website routes.");
    
    const count = await prodCol.countDocuments();
    console.log(`Verified ${count} products in MongoDB.`);
  } catch (err) {
    console.error("Sync error:", err);
  } finally {
    await client.close();
  }
}

sync();
