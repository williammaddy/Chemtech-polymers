import PrimeHwhite from '../assets/Hwhite.jpg';
import CCBaseImg from '../assets/CC.jpg';

// Category Banner Images matching exact disk extensions (.jpeg, .jpg, .webp)
import waterBaseBanner from './categories/water based ink texture macro.jpeg';
import nonPvcBanner from './categories/colorful pigment ink swirl.jpeg';
import plastisolBanner from './categories/plastisol ink paste texture.jpg';
import specialtyBanner from './categories/glitter metallic ink macro.jpg';
import heatTransferBanner from './categories/heat press textile machine.jpg';
import craftInkBanner from './categories/craft ink colorful supplies.webp';

export interface Product {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  categoryName: string;
  code: string;
  tagline: string;
  shortDesc: string;
  longDesc: string;
  image: string;
  badge: string;
  accentColor: string;
  pdfUrl: string; // Placeholder path: client will supply actual PDF files
  specs: {
    meshCount: string;
    cureTemp: string;
    viscosity: string;
    washFastness: string;
    chemistry: string;
    shelfLife: string;
    durometer?: string;
  };
  features: string[];
  applications: string[];
  curingNotes?: string;
}

export interface ProductCategory {
  slug: string;
  name: string;
  shortName: string;
  categoryNumber: string;
  headline: string;
  description: string;
  bannerImage: string;
  iconName: string;
  accentColor: string;
  productCount: number;
}

export const productCategories: ProductCategory[] = [
  {
    slug: 'water-base-inks',
    name: 'Water Base Inks',
    shortName: 'Water Base',
    categoryNumber: 'Category 01',
    headline: 'Eco-Conscious Soft-Touch Chemistry',
    description:
      'Ecologically conscious water-dispersible formulations engineered for zero-feel softness, maximum breathability, and deep pigment penetration on luxury fashion cotton.',
    bannerImage: waterBaseBanner,
    iconName: 'Droplets',
    accentColor: 'var(--color-secondary-green)',
    productCount: 2,
  },
  {
    slug: 'non-pvc-acrysol',
    name: 'Non-PVC Oil Base Inks (Acrysol)',
    shortName: 'Non-PVC Acrysol',
    categoryNumber: 'Category 02',
    headline: 'Zero PVC Performance for High-Speed Automation',
    description:
      'Next-generation Acrysol acrylic polymer systems offering traditional plastisol opacity, runnability, and speed without any vinyl chloride polymers or toxic plasticizers.',
    bannerImage: nonPvcBanner,
    iconName: 'ShieldCheck',
    accentColor: 'var(--color-accent-orange)',
    productCount: 1,
  },
  {
    slug: 'plastisol-inks',
    name: 'Phthalate-Free Plastisol Inks',
    shortName: 'Plastisol Inks',
    categoryNumber: 'Category 03',
    headline: 'Industrial Heavy-Duty Print Workhorse',
    description:
      'Industrial workhorse durability with heavy opacity, zero screen drying during press halts, rapid platen flash times, and complete international phthalate compliance.',
    bannerImage: plastisolBanner,
    iconName: 'Zap',
    accentColor: 'var(--color-accent-red)',
    productCount: 1,
  },
  {
    slug: 'specialty-inks',
    name: 'Specialty Inks & Tactile Gels',
    shortName: 'Specialty Gels',
    categoryNumber: 'Category 04',
    headline: 'Multi-Dimensional Luxury Fashion Embellishments',
    description:
      'Premium sensory finishes engineered for luxury fashion, retail apparel, and eye-catching promotional prints including Foil, Glitter, HD 3D relief, Foam, and Metallic leafing.',
    bannerImage: specialtyBanner,
    iconName: 'Sparkles',
    accentColor: 'var(--color-accent-purple)',
    productCount: 5,
  },
  {
    slug: 'heat-transfer',
    name: 'Heat Transfer Application',
    shortName: 'Heat Transfer',
    categoryNumber: 'Category 05',
    headline: 'Engineered Foundations & Thermal Adhesives',
    description:
      'Engineered backing whites and high-tack adhesive bonding gels designed for crisp, permanent tagless neck labels and multi-color heat transfer embellishments.',
    bannerImage: heatTransferBanner,
    iconName: 'Layers',
    accentColor: 'var(--color-accent-teal)',
    productCount: 2,
  },
  {
    slug: 'craft-ink',
    name: 'Craft Ink Series',
    shortName: 'Craft Ink',
    categoryNumber: 'Category 06',
    headline: 'Artisanal Studio & Table Printing Solutions',
    description:
      'Artisanal, studio, and boutique formulations with slow-drying screen stability for manual hand pulls, zero odor, non-toxic certification, and simple tap-water cleanup.',
    bannerImage: craftInkBanner,
    iconName: 'Palette',
    accentColor: 'var(--color-accent-mustard)',
    productCount: 3,
  },
];

export const productsData: Product[] = [
  // -------------------------------------------------------------
  // Category 01: Water Base Inks
  // -------------------------------------------------------------
  {
    id: 'prime-h-white',
    slug: 'prime-h-white',
    name: 'Prime H White',
    categorySlug: 'water-base-inks',
    categoryName: 'Water Base Inks',
    code: 'CT-WB-01',
    tagline: 'High-Opacity Underbase & Highlight White',
    shortDesc:
      'High Opaque White Ink formulated for exceptional coverage and brightness on dark and blended fabrics. Ideal for underbase applications and fine retail graphics.',
    longDesc:
      'Prime H White represents Chemtech Polymers’ premier water-based formulation for industrial screen printing. Engineered with ultra-fine, micronized titanium dioxide crystals suspended in a high-solid acrylic emulsion, it achieves single-stroke opacity on deep dyed black cotton without creating a rubbery or chalky barrier. It flashes rapidly under quartz and infrared heat panels, allowing fast wet-on-dry multi-color indexing on automatic presses.',
    image: PrimeHwhite,
    badge: 'High Opaque Underbase',
    accentColor: 'var(--accent-orange)',
    pdfUrl: '/assets/pdfs/prime-h-white.pdf', // [PLACEHOLDER]: Client to provide prime-h-white.pdf
    specs: {
      meshCount: '43T to 77T (110 – 196 mesh/in)',
      cureTemp: '150°C – 160°C (300°F – 320°F) for 2.5 min',
      viscosity: 'High Thixotropic Creamy Paste (180,000 cPs)',
      washFastness: '4.5 / 5.0 (AATCC 61 2A @ 60°C)',
      chemistry: 'Water-Dispersible Acrylic Hybrid Emulsion',
      shelfLife: '12 Months (store tightly sealed @ 15°C–30°C)',
      durometer: '65 / 90 / 65 Triple Durometer',
    },
    features: [
      'Maximum underbase opacity on dark cotton & blends',
      'Rapid flash gelation under quartz heaters (3 to 4 seconds)',
      'Silky feather-soft hand feel after complete conveyor curing',
      'Non-skinning open screen formulation reduces press halts',
      'Fully compliant with ZDHC MRSL Level 3 standards',
    ],
    applications: [
      '100% Combed Cotton',
      'Cotton / Polyester Blends',
      'Fleece Hoodies & Sweatshirts',
      'High-Speed Automatic Screen Presses',
    ],
    curingNotes:
      'Ensure the conveyor dryer has adequate forced-air exhaust velocity to strip water vapor before the core resin reaches 150°C cross-linking threshold.',
  },
  {
    id: 'cc-clear-base',
    slug: 'cc-clear-base',
    name: 'CC Clear Base',
    categorySlug: 'water-base-inks',
    categoryName: 'Water Base Inks',
    code: 'CT-WB-02',
    tagline: 'Pigment Dispersion Vehicle & Soft Hand Base',
    shortDesc:
      'A versatile clear carrier vehicle engineered to accept high pigment concentrations while preserving ultra-soft fabric drape and breathability.',
    longDesc:
      'CC Clear Base is an aqueous polyurethane-acrylic binder matrix optimized for pigment concentrate loading up to 12% by weight. When printed onto light garments or over cured underbases, it exhibits complete transparency, bringing forth intense color depth without adding any perceptible hand-feel. Excellent film flexibility prevents surface cracking across athletic and fashion jersey fabrics.',
    image: CCBaseImg,
    badge: 'Color & Transparency Base',
    accentColor: 'var(--accent-orange)',
    pdfUrl: '/assets/pdfs/cc-clear-base.pdf', // [PLACEHOLDER]: Client to provide cc-clear-base.pdf
    specs: {
      meshCount: '62T to 120T (156 – 305 mesh/in)',
      cureTemp: '150°C – 155°C (300°F – 310°F) for 2 min',
      viscosity: 'Medium-Flow Thixotropic Paste (140,000 cPs)',
      washFastness: '4.5 / 5.0 (ISO 105-C06)',
      chemistry: 'Aqueous Polyurethane-Acrylic Dispersion',
      shelfLife: '12 Months (store in cool ambient room)',
      durometer: '70 Single or 65/90/65 Triple',
    },
    features: [
      'High pigment dispersion holding capacity (up to 12%)',
      'Zero hand-feel on light pastel and white garments',
      'Non-tacky surface finish after full heat cure',
      'Exceptional screen stability during long continuous production runs',
      'OEKO-TEX Standard 100 Class I (Baby Wear Safe) certified',
    ],
    applications: [
      'Fashion T-Shirts',
      'Baby & Toddler Apparel',
      'Simulated Process CMYK Printing',
      'Tone-on-Tone Subtle Branding',
    ],
    curingNotes:
      'Compatible with all standard water-dispersible pigment concentrates. Allow test prints to rest 24 hours prior to commercial wash testing.',
  },

  // -------------------------------------------------------------
  // Category 02: Non-PVC Oil Base Inks (Acrysol)
  // -------------------------------------------------------------
  {
    id: 'non-pvc-acrysol',
    slug: 'non-pvc-acrysol',
    name: 'Non-PVC Oil Base Inks (Acrysol)',
    categorySlug: 'non-pvc-acrysol',
    categoryName: 'Non-PVC Oil Base Inks (Acrysol)',
    code: 'CT-ACR-100',
    tagline: 'Eco-Certified Industrial Series with High Elasticity',
    shortDesc:
      'Next-generation PVC-free acrylic polymer system delivering traditional plastisol speed and opacity without vinyl chloride polymers, phthalates, or toxic plasticizers.',
    longDesc:
      'Engineered specifically to satisfy tier-1 multinational athletic brand Restricted Substance Lists (RSL), Chemtech Acrysol eliminates 100% of PVC and ortho-phthalates. It mimics plastisol ink mechanics: it will not dry or skin in the screen mesh during shift breaks, yet glides effortlessly through fine meshes with pseudoplastic shear-thinning flow. Yields up to 250% elongation with rapid tensile recovery on spandex activewear.',
    image:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    badge: '100% Free from PVC',
    accentColor: 'var(--accent-teal)',
    pdfUrl: '/assets/pdfs/non-pvc-acrysol.pdf', // [PLACEHOLDER]: Client to provide non-pvc-acrysol.pdf
    specs: {
      meshCount: '43T to 90T (110 – 230 mesh/in)',
      cureTemp: '135°C – 145°C (275°F – 295°F) for 2 min',
      viscosity: 'High-Shear Thinning Pseudoplastic (160,000 cPs)',
      washFastness: '5.0 / 5.0 (ISO 105-C06 commercial launders)',
      chemistry: 'Phthalate-Free & PVC-Free Acrylic Resin',
      shelfLife: '24 Months in original sealed container',
      durometer: '70 Single or 65/90/65 Triple Durometer',
    },
    features: [
      '100% Certified Free from PVC, Phthalates & Heavy Metals',
      'Rapid wet-on-wet automatic press flow with minimal platen tack',
      'Exceptional elongation & 250% stretch recovery on 4-way spandex',
      'Full compliance with ZDHC MRSL Level 3 and Nike/Adidas RSL standards',
      'Energy-saving lower curing temperature window (135°C)',
    ],
    applications: [
      'Athletic Performance Sportswear',
      'Spandex / Lycra Compression Apparel',
      'Export Garment Production Lines',
      'Swimwear & Outerwear',
    ],
    curingNotes:
      'Mechanically stir ink for 2 minutes before charging screens to activate shear-thinning thixotropy. Avoid over-curing above 155°C to protect synthetic fabrics.',
  },

  // -------------------------------------------------------------
  // Category 03: Phthalate-Free Plastisol Inks
  // -------------------------------------------------------------
  {
    id: 'plastisol-inks',
    slug: 'plastisol-inks',
    name: 'Phthalate-Free Plastisol Inks',
    categorySlug: 'plastisol-inks',
    categoryName: 'Phthalate-Free Plastisol Inks',
    code: 'CT-PLS-200',
    tagline: 'Heavy-Duty Print Reliability & Maximum Opacity',
    shortDesc:
      'The industrial benchmark for high-volume contract printing. Combines heavy opacity, rapid platen flash times, and absolute screen stability with non-phthalate plasticizers.',
    longDesc:
      'Chemtech Phthalate-Free Plastisol is formulated with premium dispersion-grade vinyl copolymers and bio-based ester plasticizers. Designed for 24/7 high-speed automatic presses, the ink stays indefinitely open in the screen without skinning or viscosity drift. Delivers brilliant light reflectance on dark fabrics, high tensile stretch recovery, and superior resistance to abrasion and industrial laundering.',
    image:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    badge: 'High Opacity & Durability',
    accentColor: 'var(--accent-purple)',
    pdfUrl: '/assets/pdfs/phthalate-free-plastisol.pdf', // [PLACEHOLDER]: Client to provide phthalate-free-plastisol.pdf
    specs: {
      meshCount: '34T to 120T (86 – 305 mesh/in)',
      cureTemp: '160°C (320°F) complete core fusion for 60s',
      viscosity: 'High Viscosity Non-Drip Body (210,000 cPs)',
      washFastness: '4.5 / 5.0 (ASTM D3990 standard)',
      chemistry: 'Phthalate-Free Vinyl Copolymer System',
      shelfLife: 'Indefinite (store @ 18°C–28°C away from heat)',
      durometer: '65 / 90 / 65 Triple Durometer',
    },
    features: [
      'Never dries or clogs mesh during press shutdowns or shift changes',
      'Brilliant opacity on dark navy and pitch black cotton',
      'Rapid 3-second gel flash under infrared heating elements',
      'Conforms to European Toy Safety Standard EN 71-3 and CPSIA',
      'High resistance to wash fibrillation and micro-fissuring',
    ],
    applications: [
      'High-Volume Contract Printing',
      'Heavyweight Hoodies & Fleecewear',
      'Industrial Uniforms & Workwear',
      'Music & Band Merchandise',
    ],
    curingNotes:
      'Requires a calibrated donut probe to confirm that the entire ink film core has reached 160°C fusion. Do not judge cure by surface temperature alone.',
  },

  // -------------------------------------------------------------
  // Category 04: Specialty Inks & Tactile Gels
  // -------------------------------------------------------------
  {
    id: 'foil-gel',
    slug: 'foil-gel',
    name: 'Foil Gel',
    categorySlug: 'specialty-inks',
    categoryName: 'Specialty Inks & Tactile Gels',
    code: 'CT-SP-FL',
    tagline: 'High-Tack Thermal Adhesive for Mirrored Foil Finishes',
    shortDesc:
      'High-tack clear specialty adhesive gel formulated to bond permanently with vacuum-metallized transfer foils with razor-sharp edge retention.',
    longDesc:
      'Chemtech Foil Gel is engineered to form an unbreakable bond with hot-stamp metallized polyester films. Printed through coarse mesh counts, it lays down a smooth, uniform wet deposit that cures into an aggressive thermal adhesive. Prevents foil flaking, perimeter haloing, or post-wash peeling, providing luxury fashion garments with high-luster mirrored finishes.',
    image:
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    badge: 'Luxurious Finish',
    accentColor: 'var(--accent-gold)',
    pdfUrl: '/assets/pdfs/foil-gel.pdf', // [PLACEHOLDER]: Client to provide foil-gel.pdf
    specs: {
      meshCount: '34T to 43T (86 – 110 mesh/in)',
      cureTemp: '150°C (300°F) tunnel cure + 165°C heat press',
      viscosity: 'High Tack Gel System (190,000 cPs)',
      washFastness: '4.0 / 5.0 (Cold wash inside out recommended)',
      chemistry: 'Thermoplastic Polyurethane Emulsion',
      shelfLife: '12 Months in cool dry warehouse',
      durometer: '70 Single Durometer',
    },
    features: [
      'Maximum shear bonding strength with hot-stamp foil rolls',
      'Clean edge definition with zero adhesive bleeding or haloing',
      'Cold-peel release gives highest optical mirror reflectivity',
      'Wash-durable without peeling or cracking',
    ],
    applications: [
      'Fashion Graphic T-Shirts',
      'Luxury Retail Apparel',
      'Evening Wear & Clubwear',
      'Promotional Headwear Accents',
    ],
    curingNotes:
      'Apply heat press at 165°C, 5-6 bar pressure for 12-15s. Crucial: Allow garment to cool completely to room temperature before peeling foil sheet (Cold Peel).',
  },
  {
    id: 'glitter-gel',
    slug: 'glitter-gel',
    name: 'Glitter Gel',
    categorySlug: 'specialty-inks',
    categoryName: 'Specialty Inks & Tactile Gels',
    code: 'CT-SP-GL',
    tagline: 'Crystal-Clear Hexagonal Flake Suspension Gel',
    shortDesc:
      'Ultra-clear suspension gel formulated to carry large micro-flake polyester glitters through coarse mesh without particle fallout or settling.',
    longDesc:
      'Formulated with high optical clarity, Chemtech Glitter Gel encapsulates metallic and holographic polyester flakes without milky discoloration. The polymer binder secures each flake within the deposit matrix, preventing prickly surface textures or fallout in the laundry while maximizing multi-angle sparkle reflection.',
    image:
      'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=800&q=80',
    badge: 'Multi-Dimension',
    accentColor: 'var(--accent-orange)',
    pdfUrl: '/assets/pdfs/glitter-gel.pdf', // [PLACEHOLDER]: Client to provide glitter-gel.pdf
    specs: {
      meshCount: '15T to 32T (38 – 80 mesh/in)',
      cureTemp: '155°C – 160°C (310°F – 320°F) for 90s',
      viscosity: 'Transparent High-Yield Gel (175,000 cPs)',
      washFastness: '4.0 / 5.0 (Domestic wash 40°C)',
      chemistry: 'Clear Acrylic Suspension Compound',
      shelfLife: '12 Months',
      durometer: '65 Single Durometer (Rounded Edge)',
    },
    features: [
      'Firmly locks hexagonal glitter flakes in matrix without fallout',
      'Crystal-clear optical transparency with zero yellowing or haze',
      'Flexible soft feel even across large solid graphic fills',
      'Available pre-mixed or as clear base for custom flake blending',
    ],
    applications: [
      'Holiday Fashion Collections',
      'Dancewear & Performance Costumes',
      'Childrenswear Embellishments',
      'Music Festival Graphic Tees',
    ],
    curingNotes:
      'Use a rounded edge 65 durometer squeegee to avoid snapping flakes. Ensure mesh opening is at least 30% larger than particle flake size.',
  },
  {
    id: 'hd-gel',
    slug: 'hd-gel',
    name: 'HD Gel (High Definition)',
    categorySlug: 'specialty-inks',
    categoryName: 'Specialty Inks & Tactile Gels',
    code: 'CT-SP-HD',
    tagline: '3D Sculptural Stencil Gel with 90° Razor Edges',
    shortDesc:
      'Formulated for 3D sculptural print profiles with vertical 90-degree sidewalls. Delivers razor-sharp typographic definition with crystal clarity.',
    longDesc:
      'Chemtech HD Gel is an extra-heavy structural paste designed to be pushed through thick capillary film stencils (200–400 microns). It retains its crisp, vertical 90-degree square edges throughout tunnel heat exposure without slumping, rounding, or sagging. Can be printed glossy clear as a silicone-look accent, or tinted with pigments for bold rubberized lettering.',
    image:
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
    badge: 'Sharp Definition',
    accentColor: 'var(--primary-color)',
    pdfUrl: '/assets/pdfs/hd-gel.pdf', // [PLACEHOLDER]: Client to provide hd-gel.pdf
    specs: {
      meshCount: '32T to 43T (80 – 110 mesh/in)',
      cureTemp: '160°C (320°F) for 120s slow conveyor dwell',
      viscosity: 'Extra Heavy Structural Paste (260,000 cPs)',
      washFastness: '4.5 / 5.0 (High abrasion resistance)',
      chemistry: 'High-Density Non-Phthalate Polymer',
      shelfLife: '18 Months',
      durometer: '75 / 95 / 75 Triple Durometer Flat Blade',
    },
    features: [
      'Maintains 90° brick-like square edge profiles without slumping',
      'Stackable build-up from 200 to 500+ microns deposit height',
      'Glass-like gloss or textured matte tactile finishes',
      'High resistance to tensile stress and repeated laundering',
    ],
    applications: [
      'Silicone-Look High Density Emblems',
      'Streetwear Heavy Graphic Typography',
      'Athletic Jersey Chest Graphics',
      'Cap & Footwear Upper Accents',
    ],
    curingNotes:
      'Maintain 4.0mm to 5.5mm screen snap-off to prevent vacuum pulling when the screen lifts. Requires slow tunnel dwell to fuse deep deposits.',
  },
  {
    id: 'foam-gel',
    slug: 'foam-gel',
    name: 'Foam Gel (3D Puff)',
    categorySlug: 'specialty-inks',
    categoryName: 'Specialty Inks & Tactile Gels',
    code: 'CT-SP-FM',
    tagline: 'Thermally Expanding Micro-Sphere Puff Compound',
    shortDesc:
      'Expanding tactile puff additive that rises uniformly during tunnel curing to create soft, velvet-like 3D embossed finishes.',
    longDesc:
      'Formulated with calibrated gas-filled micro-spheres, Chemtech Foam Gel expands by up to 300% upon reaching 150°C. Creates luxurious embossed finishes with a spongy, suede-like touch. Engineered to expand uniformly across both fine lines and solid blocks without pitting, pinholing, or premature deflation.',
    image:
      'https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?auto=format&fit=crop&w=800&q=80',
    badge: '3D Raised Puff',
    accentColor: 'var(--accent-red)',
    pdfUrl: '/assets/pdfs/foam-gel.pdf', // [PLACEHOLDER]: Client to provide foam-gel.pdf
    specs: {
      meshCount: '34T to 62T (86 – 156 mesh/in)',
      cureTemp: '150°C – 155°C (300°F – 310°F) for 120s',
      viscosity: 'Smooth Expanding Compound (170,000 cPs)',
      washFastness: '4.0 / 5.0 (Laundering cycle 40°C)',
      chemistry: 'Thermally Expandable Micro-Sphere Dispersion',
      shelfLife: '9 Months (store cool below 25°C)',
      durometer: '65 / 90 / 65 Triple Durometer',
    },
    features: [
      'Uniform 3D loft expansion without surface cratering',
      'Soft spongy tactile hand with high tensile elasticity',
      'Easily blendable into standard spot shades (10% to 20% addition)',
      'Delivers vintage collegiate suede effects',
    ],
    applications: [
      'Vintage Suede Collegiate Logos',
      'Childrenswear Puffy Characters',
      'Lifestyle & Streetwear Graphics',
      'Braille Tactile Markings',
    ],
    curingNotes:
      'Strictly control conveyor dryer temperatures between 150°C and 155°C. Overheating collapses micro-spheres, causing deflated, wrinkled prints.',
  },
  {
    id: 'metallic-inks',
    slug: 'metallic-inks',
    name: 'Metallic Inks',
    categorySlug: 'specialty-inks',
    categoryName: 'Specialty Inks & Tactile Gels',
    code: 'CT-SP-MT',
    tagline: 'Non-Tarnishing Leafing Metallic Pigment Series',
    shortDesc:
      'Formulated with non-tarnishing bronze and aluminum leafing flakes. Delivers radiant gold, silver, bronze, and copper lustre with outstanding wash durability.',
    image:
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
    longDesc:
      'Chemtech Metallic Inks utilize surface-passivated alloy flakes that resist oxidation, dulling, and tarnishing under high dryer heat and repeated wash cycles. Available in Rich Gold, Pale Gold, Radiant Silver, and Antique Copper, these inks glide effortlessly through meshes up to 77T without clogging.',
    badge: 'Eye-Catching Shine',
    accentColor: 'var(--accent-teal)',
    pdfUrl: '/assets/pdfs/metallic-inks.pdf', // [PLACEHOLDER]: Client to provide metallic-inks.pdf
    specs: {
      meshCount: '43T to 77T (110 – 196 mesh/in)',
      cureTemp: '150°C – 160°C (300°F – 320°F) for 90s',
      viscosity: 'Liquid Lustre Suspension (150,000 cPs)',
      washFastness: '4.0 / 5.0 (Wash inside out)',
      chemistry: 'Coated Metallic Flake in Polymeric Carrier',
      shelfLife: '12 Months',
      durometer: '70 Single Durometer',
    },
    features: [
      'Non-oxidizing treated metallic pigments resist tarnishing',
      'Reflective liquid metal visual finish with high specular sheen',
      'Smooth squeegee glide with minimal mesh resistance',
      'Available in water-base and non-PVC oil-base formulations',
    ],
    applications: [
      'Fashion Retail Apparel',
      'Anniversary & Commemorative Merch',
      'Sporting Medallions & Crests',
      'Luxury Packaging & Labels',
    ],
    curingNotes:
      'For maximum leafing sheen, avoid over-curing and recommend washing garments inside out with gentle detergent.',
  },

  // -------------------------------------------------------------
  // Category 05: Heat Transfer Application
  // -------------------------------------------------------------
  {
    id: 'litho-backup-white',
    slug: 'litho-backup-white',
    name: 'Litho Backup White',
    categorySlug: 'heat-transfer',
    categoryName: 'Heat Transfer Application',
    code: 'CT-HT-LBW',
    tagline: 'Thermal Stability Foundation for Transfer Carrier Films',
    shortDesc:
      'Engineered specifically as the protective foundation white for heat transfers. Provides high thermal opacity and prevents dye migration.',
    longDesc:
      'Litho Backup White serves as the solid white reflective foundation for reverse-printed heat transfers on PET films and release papers. It seals printed detail colors, prevents substrate dye migration on dyed synthetics, and provides an ideal bonding surface for hot-melt adhesive powders and gels.',
    image:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80',
    badge: 'Heat Transfer System',
    accentColor: 'var(--accent-gold)',
    pdfUrl: '/assets/pdfs/litho-backup-white.pdf', // [PLACEHOLDER]: Client to provide litho-backup-white.pdf
    specs: {
      meshCount: '34T to 55T (86 – 140 mesh/in)',
      cureTemp: 'Semi-Gel @ 95°C – 105°C (200°F – 220°F) only',
      viscosity: 'High Coverage Opaque Base (220,000 cPs)',
      washFastness: '4.5 / 5.0 (When transferred @ 160°C)',
      chemistry: 'PVC-Free or Plastisol Transfer Compound',
      shelfLife: '18 Months',
      durometer: '70 Single Durometer',
    },
    features: [
      'Extreme opacity blocks dark garment dye show-through',
      'Dimensionally stable on PET release films under flash lamps',
      'Optimized surface affinity for adhesive bonding layers',
      'Available in both phthalate-free and 100% PVC-free systems',
    ],
    applications: [
      'Tagless Neck Care Labels',
      'Multi-Color Athletic Heat Transfers',
      'Polyester Performance Jerseys',
      'Cap & Bag Transfer Patches',
    ],
    curingNotes:
      'Do NOT fully cure transfer sheets on the press belt. Sheets must only semi-gel at 95°C–105°C so the ink fully bonds during final heat press transfer onto the garment.',
  },
  {
    id: 'transfer-adhesive-gel',
    slug: 'transfer-adhesive-gel',
    name: 'Transfer Adhesive Gel',
    categorySlug: 'heat-transfer',
    categoryName: 'Heat Transfer Application',
    code: 'CT-HT-TAG',
    tagline: 'High-Bond Hot-Melt Adhesive in 4 Specialized Formulations',
    shortDesc:
      'High-performance screen printable hot-melt adhesive gel. Eliminates messy powder dusting while delivering permanent wash-fast adhesion.',
    longDesc:
      'Chemtech Transfer Adhesive Gel is a printable polyurethane-copolyester bonding vehicle available in four distinct grades: Liquid Gel (standard cotton), Transfer Clear (translucent fabrics), Lycra Gel (high-stretch spandex), and Thermoline Adhesive Gel (industrial wash workwear). Applies cleanly through screens with sharp edges and zero powder scatter.',
    image:
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1000&q=80',
    badge: '4 Formulations',
    accentColor: 'var(--accent-gold)',
    pdfUrl: '/assets/pdfs/transfer-adhesive-gel.pdf', // [PLACEHOLDER]: Client to provide transfer-adhesive-gel.pdf
    specs: {
      meshCount: '24T to 43T (60 – 110 mesh/in)',
      cureTemp: 'Dry @ 90°C – 100°C; Press @ 150°C–165°C for 12s',
      viscosity: 'Tacky Bonding Vehicle (180,000 cPs)',
      washFastness: '5.0 / 5.0 (Resistant to industrial washing)',
      chemistry: 'Thermoplastic Polyurethane-Copolyester Gel',
      shelfLife: '12 Months',
      durometer: '65 / 90 / 65 Triple Durometer',
    },
    features: [
      'Four formulation options: Liquid Gel, Clear, Lycra, Thermoline',
      'Clean printable edges without messy powder scatter or dust contamination',
      'Outstanding bond strength on treated nylon, polyester, and elastane',
      'Maintains soft flexible elastic recovery without adhesive boardiness',
    ],
    applications: [
      'Industrial Workwear Emblems',
      'Lycra / Spandex Activewear Transfers',
      'Direct-to-Film (DTF) Backing Layers',
      'Waterproof Rainwear Decorating',
    ],
    curingNotes:
      'Dry transfer sheets at 90°C–100°C. Calibrate final heat press to 4.5 bar pressure with 12–15 seconds dwell time for complete adhesive melt penetration.',
  },

  // -------------------------------------------------------------
  // Category 06: Craft Ink Series
  // -------------------------------------------------------------
  {
    id: 'craft-fabric-base',
    slug: 'craft-fabric-base',
    name: 'Craft Ink Fabric Textile Base',
    categorySlug: 'craft-ink',
    categoryName: 'Craft Ink Series',
    code: 'CI-FTB-101',
    tagline: 'Slow-Drying Studio & Artisan Table Printing Base',
    shortDesc:
      'Specialty water-dispersed textile printing vehicle with extended 30-minute open screen time, designed for artisan workshops and design studios.',
    longDesc:
      'Craft Ink Fabric Textile Base solves the primary challenge of manual hand-table screen printing: premature ink drying in the mesh openings. Formulated with humectant moisture retainers, it stays fluid in screens for up to 30 minutes without misting or clogging. Cleans up with tap water and cures easily with a standard household dry iron.',
    image:
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
    badge: 'Table Printing Base',
    accentColor: 'var(--accent-orange)',
    pdfUrl: '/assets/pdfs/craft-ink-fabric-textile-base.pdf', // [PLACEHOLDER]: Client to provide craft-fabric-base.pdf
    specs: {
      meshCount: '43T to 90T (110 – 230 mesh/in)',
      cureTemp: 'Air-dry 48 hrs or Iron cure 140°C for 90s',
      viscosity: 'Smooth Creamy Flow (110,000 cPs)',
      washFastness: '4.0 / 5.0 (Machine wash warm @ 40°C)',
      chemistry: 'Self-Crosslinking Aqueous Polymer',
      shelfLife: '18 Months',
      durometer: '65 Single Durometer Hand Squeegee',
    },
    features: [
      'Extended 30-minute open screen time without drying in mesh',
      '100% Odorless and non-toxic formulation safe for classroom studios',
      'Cleans up effortlessly with ordinary tap water without solvents',
      'Accepts standard craft pigments, liquid dyes, and gouaches',
    ],
    applications: [
      'Artisan Hand-Table Printing',
      'Canvas Tote Bags & Aprons',
      'Boutique Home Linens & Cushions',
      'Design Studio Prototyping',
    ],
    curingNotes:
      'Can be heat-set using a household iron set to cotton (no steam) with parchment paper over the print for 90–120 seconds.',
  },
  {
    id: 'craft-opaque-white',
    slug: 'craft-opaque-white',
    name: 'Craft Ink Opaque White',
    categorySlug: 'craft-ink',
    categoryName: 'Craft Ink Series',
    code: 'CI-OPW-202',
    tagline: 'Single-Pull Opacity on Dark Fabrics & Canvas',
    shortDesc:
      'Heavy-pigment opaque white screen printing ink crafted for hand-pulled studio prints on black, dark denim, raw linen, and canvas totes.',
    longDesc:
      'Designed for boutique apparel makers and manual screen printing studios, Craft Ink Opaque White delivers striking single-stroke coverage on dark fabrics. Yields a smooth, flexible matte white finish that never feels plastic or rigid, and holds fine typographic edges without bleed.',
    image:
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1000&q=80',
    badge: 'Dark Fabric Coverage',
    accentColor: 'var(--primary-color)',
    pdfUrl: '/assets/pdfs/craft-ink-opaque-white.pdf', // [PLACEHOLDER]: Client to provide craft-opaque-white.pdf
    specs: {
      meshCount: '34T to 55T (86 – 140 mesh/in)',
      cureTemp: 'Air-dry + Iron heat-set @ 145°C for 2 min',
      viscosity: 'Rich Buttery Body (160,000 cPs)',
      washFastness: '4.0 / 5.0 (Standard laundry cycle)',
      chemistry: 'Water-Based High-Solid Titanium Dioxide Base',
      shelfLife: '18 Months',
      durometer: '65 or 70 Single Durometer',
    },
    features: [
      'Bright single-stroke coverage on black cotton, burlap, and jute',
      'Silky smooth hand feel without chalking or cracking',
      'Smooth squeegee pull reduces arm fatigue during manual runs',
      'Non-yellowing pure neutral white formulation',
    ],
    applications: [
      'Boutique Fashion Apparel',
      'Dark Fabric Screen Art & Posters',
      'Heavyweight Canvas Tote Bags',
      'Handmade Textiles & Crafts',
    ],
    curingNotes:
      'Allow prints to air-dry completely for 2 hours before executing final iron heat-setting or conveyor drying.',
  },
  {
    id: 'craft-shimmer-base',
    slug: 'craft-shimmer-base',
    name: 'Craft Ink Shimmer Base',
    categorySlug: 'craft-ink',
    categoryName: 'Craft Ink Series',
    code: 'CI-SHM-303',
    tagline: 'Translucent Mica & Pearl Carrier for Iridescent Luster',
    shortDesc:
      'Translucent pearlized suspension base embedded with ultra-fine cosmetic-grade mica flakes. Imparts an elegant iridescent shimmer to apparel.',
    longDesc:
      'Craft Ink Shimmer Base adds subtle opalescence and pearl gleam to textiles, stationery, and art prints. Suspended with micro-fine mineral mica, it produces an eye-catching luster that shifts with lighting angles while feeling silky and non-abrasive against skin.',
    image:
      'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=1000&q=80',
    badge: 'Pearl Shimmer',
    accentColor: 'var(--accent-gold)',
    pdfUrl: '/assets/pdfs/craft-ink-shimmer-base.pdf', // [PLACEHOLDER]: Client to provide craft-shimmer-base.pdf
    specs: {
      meshCount: '43T to 77T (110 – 196 mesh/in)',
      cureTemp: 'Air-dry + Iron cure @ 140°C for 90s',
      viscosity: 'Lustrous Flow Paste (125,000 cPs)',
      washFastness: '4.0 / 5.0 (Gentle cycle recommended)',
      chemistry: 'Aqueous Mica Pearl Dispersion',
      shelfLife: '12 Months',
      durometer: '65 Single Durometer',
    },
    features: [
      'Subtle metallic gleam that shifts with viewing angles',
      'Non-scratchy feather-soft hand against the body',
      'Mixable with craft dyes to create custom pearl shades',
      'Non-toxic and safe for workshop, school, and artisan use',
    ],
    applications: [
      'Artisan Scarves & Silks',
      'Greeting Cards & Fine Stationery',
      'Limited-Edition Boutique Fashion',
      'Decorative Home Furnishings',
    ],
    curingNotes:
      'Iron on reverse side of fabric or use parchment interleaving to preserve pearl lustre.',
  },
];

// Helper lookup functions
export const getCategoryBySlug = (slug: string): ProductCategory | undefined => {
  return productCategories.find((cat) => cat.slug === slug);
};

export const getProductsByCategory = (categorySlug: string): Product[] => {
  return productsData.filter((p) => p.categorySlug === categorySlug);
};

export const getProductBySlug = (productSlug: string): Product | undefined => {
  return productsData.find((p) => p.slug === productSlug);
};

export const getRelatedProducts = (productSlug: string, limit = 3): Product[] => {
  const current = getProductBySlug(productSlug);
  if (!current) return [];
  return productsData
    .filter((p) => p.categorySlug === current.categorySlug && p.slug !== productSlug)
    .slice(0, limit);
};
