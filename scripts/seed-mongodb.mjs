import { MongoClient } from 'mongodb';
import fs from 'node:fs';

const uri = process.env.MONGODB_URI || "mongodb+srv://cfearless485_db_user:cgtxpFX0jQtFZb1j@cluster0.btaeqbx.mongodb.net/?retryWrites=true&w=majority";
const dbName = process.env.MONGODB_DB_NAME || "chemtech_db";

// Initial seed data based on productsData.ts and contactInfo.ts
const initialCategories = [
  {
    id: "water-base-inks",
    slug: "water-base-inks",
    name: "Water Base Inks",
    short_name: "Water Base",
    category_number: "01",
    headline: "Eco-Friendly Soft-Hand Inks",
    description: "Premium eco-friendly water-based textile printing pastes delivering ultra-soft hand feel, breathability, and high-opacity prints across cotton and blended knits.",
    banner_image_url: "/assets/water based ink texture macro-BKh2Zgn4.jpeg",
    icon_name: "Droplets",
    accent_color: "#00A896",
    created_at: new Date().toISOString()
  },
  {
    id: "non-pvc-inks",
    slug: "non-pvc-inks",
    name: "Non-PVC Inks",
    short_name: "Non-PVC",
    category_number: "02",
    headline: "Compliant High-Performance Systems",
    description: "Advanced phthalate-free, PVC-free formulations engineered to meet the strictest global brand restricted substance lists (RSL) and sustainability guidelines.",
    banner_image_url: "/assets/colorful pigment ink swirl--F2hLh4O.jpeg",
    icon_name: "ShieldCheck",
    accent_color: "#1FA97A",
    created_at: new Date().toISOString()
  },
  {
    id: "plastisol-inks",
    slug: "plastisol-inks",
    name: "Plastisol Inks",
    short_name: "Plastisol",
    category_number: "03",
    headline: "High-Opacity Industrial Standard",
    description: "Workhorse textile plastisol inks offering exceptional wet-on-wet printability, brilliant color payoff, fast flashing, and zero screen dry-in.",
    banner_image_url: "/assets/plastisol ink paste texture-BC5vwKLf.jpg",
    icon_name: "Layers",
    accent_color: "#2B3A8F",
    created_at: new Date().toISOString()
  },
  {
    id: "speciality-inks",
    slug: "speciality-inks",
    name: "Speciality Inks",
    short_name: "Speciality",
    category_number: "04",
    headline: "High-Density, Metallic & Tactile Effects",
    description: "Architectural tactile gels, brilliant metallic flakes, 3D puff additives, and photo-luminescent compounds for premium fashion embellishments.",
    banner_image_url: "/assets/glitter metallic ink macro-CTM4eUzm.jpg",
    icon_name: "Sparkles",
    accent_color: "#E85D04",
    created_at: new Date().toISOString()
  },
  {
    id: "heat-transfer-solutions",
    slug: "heat-transfer-solutions",
    name: "Heat Transfer Solutions",
    short_name: "Heat Transfer",
    category_number: "05",
    headline: "Precision Litho & Direct Transfer Systems",
    description: "Industrial heat transfer inks, release papers, and hot-melt thermoplastic adhesives engineered for sharp vector transfers and rugged wash durability.",
    banner_image_url: "/assets/heat press textile machine-DOKliBsz.jpg",
    icon_name: "Flame",
    accent_color: "#DC2626",
    created_at: new Date().toISOString()
  },
  {
    id: "craft-inks",
    slug: "craft-inks",
    name: "Craft Inks",
    short_name: "Craft",
    category_number: "06",
    headline: "Specialty DIY & Table Print Formulations",
    description: "Versatile studio and manual table print formulations designed for boutique printing studios, hand-block printing, and artisanal cotton apparel decoration.",
    banner_image_url: "/assets/craft ink colorful supplies-DqywN_UU.webp",
    icon_name: "Palette",
    accent_color: "#8B5CF6",
    created_at: new Date().toISOString()
  }
];

const initialProducts = [
  {
    id: "ct-wb-01",
    slug: "prime-h-white",
    name: "Prime H White",
    category_slug: "water-base-inks",
    code: "CT-WB-01",
    tagline: "High-Opacity Underbase & Highlight White",
    short_desc: "Superior opacity water-based white paste offering rapid flashing, creamy wet edge, and excellent stretch across dark cotton knits.",
    description: "Prime H White is Chemtech Polymers' flagship water-based white formulation engineered specifically for automatic and manual carousel printing on 100% cotton and high-blend cotton textiles.",
    image_url: "/assets/PrimeH-gmb3xsY_.png",
    pdf_url: "/assets/pdfs/prime-h-white.pdf",
    specs: {
      meshCount: "43T to 77T (110 - 196 mesh/in)",
      cureTemp: "150°C - 160°C for 2 - 3 minutes",
      viscosity: "28,000 - 34,000 cPs (Brookfield RV)",
      washFastness: "ISO 105-C06 (40°C & 60°C Level 4-5)",
      chemistry: "Water-Dispersible Acrylic Hybrid",
      shelfLife: "12 months in sealed container @ 25°C"
    },
    features: [
      "High opacity with creamy squeegee glide",
      "Soft hand feel without cracking on stretch",
      "Rapid flash dry properties for high-speed carousels",
      "Compliant with OEKO-TEX Standard 100"
    ],
    applications: [
      "Dark cotton apparel and high-density knits",
      "High-speed multi-head automatic carousels",
      "Underbase printing beneath discharge or reactive dyes"
    ],
    curing_notes: "Ensure full moisture evaporation before cross-linking polymer temperature is reached.",
    badge: "Eco Formulation",
    accent_color: "#00A896",
    created_at: new Date().toISOString()
  },
  {
    id: "ct-wb-02",
    slug: "clear-base-wb",
    name: "CC Base (Clear Coat)",
    category_slug: "water-base-inks",
    code: "CT-WB-02",
    tagline: "Vibrant Color Suspension & Stretch Extender",
    short_desc: "Ultra-transparent water-based binder paste formulated for maximum pigment dispersion, deep color brilliance, and exceptional wash fastness.",
    description: "CC Base is designed to suspend concentrated textile pigment dispersions at high loadings without losing paste rheology or increasing screen dry-in.",
    image_url: "/assets/CC-b2Di85KP.png",
    pdf_url: "/assets/pdfs/clear-base-wb.pdf",
    specs: {
      meshCount: "60T to 90T (150 - 230 mesh/in)",
      cureTemp: "150°C - 160°C for 2.5 minutes",
      viscosity: "22,000 - 26,000 cPs",
      washFastness: "ISO 105-C06 Level 4",
      chemistry: "Pure Acrylic Emulsion",
      shelfLife: "12 months @ 25°C"
    },
    features: [
      "Exceptional color transparency and luster",
      "Retains tensile elongation on dynamic fabrics",
      "Low odor, non-yellowing film"
    ],
    applications: [
      "White and light pastel fabrics",
      "Color matching for tonal and photographic prints",
      "Mixing with metallic and pearlescent concentrates"
    ],
    curing_notes: "Requires forced air drying for optimal polymerization.",
    badge: "High Stretch",
    accent_color: "#00A896",
    created_at: new Date().toISOString()
  },
  {
    id: "ct-np-01",
    slug: "non-pvc-opaque-white",
    name: "Non-PVC Opaque White",
    category_slug: "non-pvc-inks",
    code: "CT-NP-01",
    tagline: "Brand-Compliant Sustainable Opaque White",
    short_desc: "Zero-PVC, zero-phthalate direct-print white with plastisol-like handling and velvet soft finish.",
    description: "Formulated to satisfy the stringent compliance requirements of international apparel brands (ZDHC MRSL Level 3, Nike RSL, Adidas A-01).",
    image_url: "/assets/NONPVC-DgYg1ws6.png",
    pdf_url: "/assets/pdfs/non-pvc-opaque-white.pdf",
    specs: {
      meshCount: "43T to 68T",
      cureTemp: "160°C for 3 minutes",
      viscosity: "30,000 cPs",
      washFastness: "Grade 4.5",
      chemistry: "Polyurethane-Acrylic Hybrid",
      shelfLife: "9 months"
    },
    features: [
      "100% PVC, Phthalate, and APEO Free",
      "Supple hand with high elastic recovery",
      "Non-tacky surface after curing"
    ],
    applications: [
      "Athletic apparel and activewear",
      "Eco-certified export garment programs"
    ],
    curing_notes: "Crucial to achieve core garment temperature of 160°C.",
    badge: "ZDHC Level 3",
    accent_color: "#1FA97A",
    created_at: new Date().toISOString()
  },
  {
    id: "ct-pl-01",
    slug: "phthalate-free-plastisol",
    name: "Phthalate-Free Plastisol Paste",
    category_slug: "plastisol-inks",
    code: "CT-PL-01",
    tagline: "Industrial Workhorse High-Opacity Paste",
    short_desc: "Creamy, ready-for-use plastisol paste delivering sharp vector definition and high speed carousel reliability.",
    description: "Chemtech's Phthalate-Free Plastisol series features cutting-edge non-toxic plasticizers offering high gel strength, exceptional opacity on 100% polyester and cotton blends.",
    image_url: "/assets/Phthalate-BSY0w99F.jpeg",
    pdf_url: "/assets/pdfs/phthalate-free-plastisol.pdf",
    specs: {
      meshCount: "34T to 120T",
      cureTemp: "160°C for 60 seconds",
      viscosity: "45,000 cPs",
      washFastness: "Grade 5.0",
      chemistry: "Non-ortho-phthalate PVC polymer",
      shelfLife: "24 months"
    },
    features: [
      "Zero screen dry-in during long production shifts",
      "Bleed-resistant chemistry on poly-blends",
      "Silky matte finish with intense pigment load"
    ],
    applications: [
      "High-volume commercial screen printing",
      "Simulated process color printing"
    ],
    curing_notes: "Flashes in 3-5 seconds under quartz heaters.",
    badge: "Workhorse",
    accent_color: "#2B3A8F",
    created_at: new Date().toISOString()
  },
  {
    id: "ct-sp-01",
    slug: "foil-gel-adhesive",
    name: "Foil Gel Adhesive",
    category_slug: "speciality-inks",
    code: "CT-SP-01",
    tagline: "High-Tack Metallic Foil Transfer Binder",
    short_desc: "Specially formulated plastisol adhesive gel engineered to bond hot stamping foils to textile substrates with crisp edge definition.",
    description: "Foil Gel Adhesive prints smoothly through coarse meshes and maintains an aggressive tack upon partial flash, locking metallic foils securely onto knit surfaces.",
    image_url: "/assets/FoilGel-CsqjHm2c.jpeg",
    pdf_url: "/assets/pdfs/foil-gel-adhesive.pdf",
    specs: {
      meshCount: "34T to 48T",
      cureTemp: "160°C transfer heat press",
      viscosity: "38,000 cPs",
      washFastness: "Grade 4.0",
      chemistry: "Cross-linking Thermoset Adhesive",
      shelfLife: "12 months"
    },
    features: [
      "Ultra-sharp edge retention",
      "High peel adhesion strength",
      "Resistant to foil flaking during domestic laundry"
    ],
    applications: [
      "Metallic gold, silver, and holographic foil accents",
      "Fashion apparel and streetwear branding"
    ],
    curing_notes: "Heat press transfer at 165°C, 5 bar pressure for 12 seconds; peel cold.",
    badge: "Specialty",
    accent_color: "#E85D04",
    created_at: new Date().toISOString()
  },
  {
    id: "ct-sp-02",
    slug: "glitter-gel-base",
    name: "Glitter Gel Base",
    category_slug: "speciality-inks",
    code: "CT-SP-02",
    tagline: "High-Clarity Flake Suspension Medium",
    short_desc: "Ultra-clear carrier gel formulated to hold heavy concentrations of polyester glitter flakes without settle-out or clouding.",
    description: "An optical-clarity suspension gel with thixotropic rheology that allows high loadings of hexagonal glitter flakes up to 0.008 and 0.015 gauge.",
    image_url: "/assets/Glitter-DB2F7LQE.png",
    pdf_url: "/assets/pdfs/glitter-gel-base.pdf",
    specs: {
      meshCount: "24T to 34T",
      cureTemp: "160°C for 90 seconds",
      viscosity: "32,000 cPs",
      washFastness: "Grade 4.0",
      chemistry: "Optically Clear Plastisol Gel",
      shelfLife: "18 months"
    },
    features: [
      "Maximizes prism reflection of glitter flakes",
      "Prevents flake shedding during laundering",
      "Smooth squeegee deposit through coarse mesh"
    ],
    applications: [
      "Festival apparel, festive wear, and childrenswear accents"
    ],
    curing_notes: "Standard infrared or forced-air conveyor cure.",
    badge: "Sparkle",
    accent_color: "#E85D04",
    created_at: new Date().toISOString()
  },
  {
    id: "ct-sp-03",
    slug: "high-density-3d-gel",
    name: "HD Gel (High Density)",
    category_slug: "speciality-inks",
    code: "CT-SP-03",
    tagline: "Sharp-Cornered 3D Architectural Print Base",
    short_desc: "High-viscosity transparent gel designed to build sharp, 90-degree tactile relief and dimensional rubberized emblems.",
    description: "Chemtech HD Gel builds straight, razor-sharp sidewalls with capillary films (200-400 microns) without slump or rounding at the edges.",
    image_url: "/assets/HDGel-D922rrUd.png",
    pdf_url: "/assets/pdfs/high-density-3d-gel.pdf",
    specs: {
      meshCount: "34T to 43T with thick capillary film",
      cureTemp: "160°C for 2.5 minutes",
      viscosity: "65,000 cPs",
      washFastness: "Grade 4.5",
      chemistry: "High-Modulus Polymeric Gel",
      shelfLife: "12 months"
    },
    features: [
      "Exceptional edge retention and vertical walls",
      "Glass-like gloss or matte finish depending on topcoat",
      "High tensile durability that withstands stretching"
    ],
    applications: [
      "Architectural 3D badges, logos, and athletic jersey lettering"
    ],
    curing_notes: "Thick deposits require extended dwell time inside tunnel dryer.",
    badge: "3D Effect",
    accent_color: "#E85D04",
    created_at: new Date().toISOString()
  },
  {
    id: "ct-sp-04",
    slug: "foam-puff-gel",
    name: "Foam / Puff Gel",
    category_slug: "speciality-inks",
    code: "CT-SP-04",
    tagline: "Dimensional Suede & Puff Expandable Ink",
    short_desc: "Microcellular expanding ink paste creating elevated, rounded suede and pillow-soft 3D tactile prints.",
    description: "Contains thermally activated microspheres that expand uniformly upon curing, creating a smooth, velvety textured surface with high loft.",
    image_url: "/assets/FoamGel-fVIyHKuJ.jpeg",
    pdf_url: "/assets/pdfs/foam-puff-gel.pdf",
    specs: {
      meshCount: "34T to 48T",
      cureTemp: "155°C - 165°C for 90 seconds",
      viscosity: "35,000 cPs",
      washFastness: "Grade 4.0",
      chemistry: "Expandable Microsphere Plastisol",
      shelfLife: "9 months"
    },
    features: [
      "Consistent 300% to 500% volumetric expansion",
      "Warm, velvety suede hand texture",
      "Tintable with standard plastisol color concentrates"
    ],
    applications: [
      "Vintage apparel, fleece hoodies, and lifestyle brand graphics"
    ],
    curing_notes: "Overheating will cause microcells to collapse.",
    badge: "Puff Texture",
    accent_color: "#E85D04",
    created_at: new Date().toISOString()
  },
  {
    id: "ct-sp-05",
    slug: "metallic-silver-gold",
    name: "Metallic Silver & Gold Inks",
    category_slug: "speciality-inks",
    code: "CT-SP-05",
    tagline: "Liquid Metal Luster & Reflective Pigments",
    short_desc: "Pre-compounded metallic plastisol pastes formulated with micro-milled bronze and aluminum flakes for high luster.",
    description: "Engineered with anti-tarnish inhibitors and ultra-fine metallic pigments that resist oxidation and maintain bright mirror-like brilliance across washes.",
    image_url: "/assets/Mettalic-CSPxHyU2.png",
    pdf_url: "/assets/pdfs/metallic-silver-gold.pdf",
    specs: {
      meshCount: "43T to 68T",
      cureTemp: "160°C for 90 seconds",
      viscosity: "36,000 cPs",
      washFastness: "Grade 4.0",
      chemistry: "Passivated Metal Flake Suspension",
      shelfLife: "12 months"
    },
    features: [
      "Mirror-like reflectivity without foil stamping",
      "Non-tarnishing formulation",
      "Ready to print directly out of the container"
    ],
    applications: [
      "Luxury apparel, outerwear emblems, and fashion accents"
    ],
    curing_notes: "Avoid direct friction wash tests for first 24 hours.",
    badge: "Metallic",
    accent_color: "#E85D04",
    created_at: new Date().toISOString()
  },
  {
    id: "ct-ht-01",
    slug: "litho-transfer-white",
    name: "Litho Transfer White",
    category_slug: "heat-transfer-solutions",
    code: "CT-HT-01",
    tagline: "High-Elongation Transfer Backing White",
    short_desc: "Formulated for screen printing transfer backings onto PET release film with maximum adhesive powder acceptance.",
    description: "Litho Transfer White serves as the solid opaque backing layer for offset and digital transfer prints.",
    image_url: "/assets/Litho-xgj7Xh4m.png",
    pdf_url: "/assets/pdfs/litho-transfer-white.pdf",
    specs: {
      meshCount: "34T to 48T",
      cureTemp: "Partial gel @ 110°C; heat press 160°C",
      viscosity: "34,000 cPs",
      washFastness: "Grade 4.5",
      chemistry: "Thermoplastic Polyamide-Compatible Plastisol",
      shelfLife: "18 months"
    },
    features: [
      "Superior powder pickup for hot-melt granules",
      "Clean peel from matte and gloss PET release films",
      "High flexibility and wash resistance on elastane blends"
    ],
    applications: [
      "Tagless neck labels, athletic transfers, and full-color offset transfers"
    ],
    curing_notes: "Only partially gel the print before applying transfer adhesive powder.",
    badge: "Heat Transfer",
    accent_color: "#DC2626",
    created_at: new Date().toISOString()
  },
  {
    id: "ct-ht-02",
    slug: "direct-transfer-clear",
    name: "Direct Transfer Clear Gel",
    category_slug: "heat-transfer-solutions",
    code: "CT-HT-02",
    tagline: "Adhesive Carrier for Transfer Emblems",
    short_desc: "Transparent protective seal and adhesive binder for direct screen-printed transfers.",
    description: "Acts as a protective topcoat and adhesive vehicle for glitter, flock, and multi-color transfer motifs.",
    image_url: "/assets/transfer-Dh2IzKYL.png",
    pdf_url: "/assets/pdfs/direct-transfer-clear.pdf",
    specs: {
      meshCount: "34T to 55T",
      cureTemp: "Partial gel @ 105°C; press 155°C",
      viscosity: "28,000 cPs",
      washFastness: "Grade 4.5",
      chemistry: "High-Clarity Plastisol Transfer Medium",
      shelfLife: "18 months"
    },
    features: [
      "Crystal clear finish after transfer",
      "Prevents color bleeding between layers",
      "Compatible with both hot-peel and cold-peel transfer films"
    ],
    applications: [
      "Flock transfers, metallic transfer motifs, and neck print labels"
    ],
    curing_notes: "Ensure uniform powder adhesion before running through dryer.",
    badge: "Transfer Clear",
    accent_color: "#DC2626",
    created_at: new Date().toISOString()
  },
  {
    id: "ct-cr-01",
    slug: "craft-table-paste-opaque",
    name: "Craft Table Print Paste Opaque",
    category_slug: "craft-inks",
    code: "CT-CR-01",
    tagline: "Air-Drying High-Opacity Artisanal Ink",
    short_desc: "Slow-drying water-based formulation engineered for manual long-table and wooden block printing without screen clogging.",
    description: "Craft Table Print Paste features extended open screen time tailored for artisan workshops and studio printers.",
    image_url: "/assets/Craft1-B8-aCwdu.png",
    pdf_url: "/assets/pdfs/craft-table-paste-opaque.pdf",
    specs: {
      meshCount: "34T to 77T (also wooden hand blocks)",
      cureTemp: "Air-dry 48 hours or light iron cure (130°C)",
      viscosity: "24,000 cPs",
      washFastness: "Grade 4.0",
      chemistry: "Self-Crosslinking Water Acrylic",
      shelfLife: "12 months"
    },
    features: [
      "Extra-long screen open time (up to 45 minutes on table)",
      "Cures at room temperature with booster or light heat press",
      "Zero toxic solvents, completely safe for studio environments"
    ],
    applications: [
      "Artisanal cotton fabric printing, hand-block printing, and canvas bags"
    ],
    curing_notes: "Room temperature cure reaches full wash fastness after 72 hours.",
    badge: "Studio Grade",
    accent_color: "#8B5CF6",
    created_at: new Date().toISOString()
  },
  {
    id: "ct-cr-02",
    slug: "craft-transparent-medium",
    name: "Craft Transparent Medium",
    category_slug: "craft-inks",
    code: "CT-CR-02",
    tagline: "Custom Dye & Pigment Blending Vehicle",
    short_desc: "Smooth blending medium for water-based craft pigments and artistic fabric dyeing on light fabrics.",
    description: "Designed for small-batch color mixing in artisanal workshops, offering soft fiber penetration on raw cotton and linen.",
    image_url: "/assets/Craft2-CJ0eww3j.png",
    pdf_url: "/assets/pdfs/craft-transparent-medium.pdf",
    specs: {
      meshCount: "43T to 90T",
      cureTemp: "Air dry / iron press",
      viscosity: "18,000 cPs",
      washFastness: "Grade 4.0",
      chemistry: "Modified Natural Gum & Acrylic",
      shelfLife: "12 months"
    },
    features: [
      "High color clarity and transparency",
      "Deep fiber penetration for permanent wash life",
      "Washable equipment with plain warm water"
    ],
    applications: [
      "Linen decor, cotton scarves, and boutique home textiles"
    ],
    curing_notes: "Iron back of fabric for 3 minutes to lock colors.",
    badge: "Artisan",
    accent_color: "#8B5CF6",
    created_at: new Date().toISOString()
  },
  {
    id: "ct-cr-03",
    slug: "craft-binder-extra-soft",
    name: "Craft Binder Extra Soft",
    category_slug: "craft-inks",
    code: "CT-CR-03",
    tagline: "Natural Fiber Softening & Fixation Agent",
    short_desc: "Ultra-pliable binder additive that eliminates ink stiffening on organic cotton and bamboo textiles.",
    description: "Formulated with bio-compatible softening agents that maintain natural drape on lightweight muslins and silks.",
    image_url: "/assets/Craft3-H6rWVEvQ.jpeg",
    pdf_url: "/assets/pdfs/craft-binder-extra-soft.pdf",
    specs: {
      meshCount: "All meshes",
      cureTemp: "140°C - 150°C",
      viscosity: "15,000 cPs",
      washFastness: "Grade 4.5",
      chemistry: "Polyurethane Soft Binder",
      shelfLife: "12 months"
    },
    features: [
      "Imparts zero hand feel on organic fabrics",
      "Enhances dry and wet rub fastness",
      "Odorless and bio-degradable components"
    ],
    applications: [
      "Infant wear, organic cotton garments, and high-end fashion scarves"
    ],
    curing_notes: "Fully cured when fabric surface temperature reaches 145°C.",
    badge: "Eco Soft",
    accent_color: "#8B5CF6",
    created_at: new Date().toISOString()
  }
];

const initialResources = [
  {
    id: "mastering-water-base-curing",
    slug: "mastering-water-base-curing",
    title: "Mastering Water-Based Ink Curing: Time, Temperature & Airflow",
    subtitle: "A Complete Technical Guide for Industrial Carousel Decorators",
    category: "Curing & Fixation",
    teaser: "Why conveyor dryer CFM and dwell time dictate wash fastness more than tunnel heat settings.",
    body: "Achieving consistent ISO 105-C06 Level 4/5 wash fastness with water-based textile inks requires understanding the two distinct thermodynamic phases: water evaporation and polymeric cross-linking.",
    image_url: "/assets/water based ink texture macro-BKh2Zgn4.jpeg",
    author: "Chemtech Application Engineering Lab",
    publish_date: "September 2026",
    read_time: "7 min read",
    badge_color: "#00A896",
    created_at: new Date().toISOString()
  },
  {
    id: "zdhc-mrsl-level-3-compliance",
    slug: "zdhc-mrsl-level-3-compliance",
    title: "Navigating ZDHC MRSL Level 3 & Brand Restricted Substance Lists",
    subtitle: "Ensuring Zero Toxic Discharges and International Export Acceptance",
    category: "Regulatory & Compliance",
    teaser: "How Chemtech formulations eliminate alkylphenol ethoxylates (APEO), PVC, and phthalates from the print floor.",
    body: "As major global retail brands push their supply chains toward Zero Discharge of Hazardous Chemicals (ZDHC), textile screen printers face rigorous chemical auditing.",
    image_url: "/assets/colorful pigment ink swirl--F2hLh4O.jpeg",
    author: "Regulatory & Quality Assurance Division",
    publish_date: "September 2026",
    read_time: "5 min read",
    badge_color: "#1FA97A",
    created_at: new Date().toISOString()
  },
  {
    id: "high-density-3d-printing-troubleshooting",
    slug: "high-density-3d-printing-troubleshooting",
    title: "Troubleshooting High-Density 3D Screen Printing: Tackling Slump & Pinholes",
    subtitle: "Stencil Preparation, Squeegee Durometer, and Flash Techniques",
    category: "Technical Troubleshooting",
    teaser: "Practical step-by-step solutions for creating sharp 90-degree dimensional corners with HD Gel.",
    body: "High-density screen printing demands meticulous control over emulsion thickness (EOM), squeegee hardness, and flash gelation states.",
    image_url: "/assets/HDGel-D922rrUd.png",
    author: "Technical Formulation Team",
    publish_date: "September 2026",
    read_time: "6 min read",
    badge_color: "#E85D04",
    created_at: new Date().toISOString()
  }
];

const initialContactInfo = {
  id: "default",
  phone: "+91 93635 19955 / +91 82208 04830",
  phone_support: "+91 93635 19955",
  phone_sales: "+91 82208 04830",
  email: "business.chemtech@gmail.com",
  email_sales: "business.chemtech@gmail.com",
  address: "",
  whatsapp_number: "918248212154",
  map_embed_url: "",
  hours: "Monday – Saturday: 9:00 AM – 6:30 PM IST",
  formspree_endpoint: "https://formspree.io/f/mvkojeyd",
  updated_at: new Date().toISOString()
};

const initialAdminUser = {
  id: "admin-chemtech-01",
  email: "business.chemtech@gmail.com",
  role: "Administrator",
  // Standard demo password DemoPass123!
  password: "DemoPass123!",
  created_at: new Date().toISOString()
};

async function seed() {
  const client = new MongoClient(uri);

  try {
    console.log("Connecting to MongoDB Atlas...");
    await client.connect();
    console.log("Connected successfully to MongoDB Atlas!");

    const db = client.db(dbName);

    // 1. Categories
    const categoriesCol = db.collection('categories');
    const existingCats = await categoriesCol.countDocuments();
    if (existingCats === 0) {
      console.log("Seeding categories...");
      await categoriesCol.insertMany(initialCategories);
      console.log(`Seeded ${initialCategories.length} categories.`);
    } else {
      console.log(`Categories collection already has ${existingCats} documents.`);
    }

    // 2. Products
    const productsCol = db.collection('products');
    const existingProds = await productsCol.countDocuments();
    if (existingProds === 0) {
      console.log("Seeding products...");
      await productsCol.insertMany(initialProducts);
      console.log(`Seeded ${initialProducts.length} products.`);
    } else {
      console.log(`Products collection already has ${existingProds} documents.`);
    }

    // 3. Resources
    const resourcesCol = db.collection('resources');
    const existingRes = await resourcesCol.countDocuments();
    if (existingRes === 0) {
      console.log("Seeding resources...");
      await resourcesCol.insertMany(initialResources);
      console.log(`Seeded ${initialResources.length} resources.`);
    } else {
      console.log(`Resources collection already has ${existingRes} documents.`);
    }

    // 4. Contact Info
    const contactCol = db.collection('contact_info');
    const existingContact = await contactCol.countDocuments();
    if (existingContact === 0) {
      console.log("Seeding contact info...");
      await contactCol.insertOne(initialContactInfo);
      console.log("Seeded contact info.");
    } else {
      // Ensure the updated email and contacts are reflected
      await contactCol.updateOne(
        { id: "default" },
        { $set: initialContactInfo },
        { upsert: true }
      );
      console.log("Updated contact info in database.");
    }

    // 5. Admin Users
    const adminCol = db.collection('admin_users');
    await adminCol.updateOne(
      { email: initialAdminUser.email },
      { $set: initialAdminUser },
      { upsert: true }
    );
    // Also support admin@chemtechpolymers.com alias for seamless login
    await adminCol.updateOne(
      { email: "admin@chemtechpolymers.com" },
      { $set: { ...initialAdminUser, id: "admin-chemtech-02", email: "admin@chemtechpolymers.com" } },
      { upsert: true }
    );
    console.log("Seeded admin users.");

    console.log("\nMongoDB Atlas database successfully seeded with all initial data!");
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();
