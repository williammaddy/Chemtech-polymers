import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PrimeHwhite from '../assets/Hwhite.jpg';
import { PdfViewerModal, ProductSpec } from './PdfViewerModal';
import {
  ArrowRight,
  MoveUpRight,
  ShieldCheck,
  Droplets,
  Layers,
  Sparkles,
  Zap,
  Gem,
  Flame,
  SunMedium,
  FileText,
  Palette
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ProductsProps {
  onSelectProductForInquiry?: (productName: string) => void;
}

export const productSpecsData: Record<string, ProductSpec> = {
  'prime-h-white': {
    name: 'Prime H White',
    category: 'Water Base Inks',
    code: 'CT-WB-01',
    description:
      'High Opaque White Ink formulated for exceptional coverage and brightness on dark and blended fabrics. Ideal for underbase applications and fine retail graphics, ensuring top colors pop with silky soft touch.',
    image: PrimeHwhite,
    pdfUrl: '/assets/pdfs/prime-h-white.pdf',
    specs: {
      meshCount: '43T to 77T (110 – 196 mesh/in)',
      cureTemp: '150°C – 160°C (300°F – 320°F) for 2.5 min',
      viscosity: 'High Thixotropic Creamy Paste (180,000 cPs)',
      washFastness: '4.5 / 5.0 (AATCC 61 2A @ 60°C)',
      chemistry: 'Water-Dispersible Acrylic Hybrid Emulsion',
      shelfLife: '12 Months (store tightly sealed @ 15°C–30°C)',
    },
    features: [
      'Maximum underbase opacity on dark cotton',
      'Rapid flash gelation under quartz heaters',
      'Silky feather-soft hand feel after curing',
      'Non-skinning open screen formulation',
    ],
    applications: ['100% Combed Cotton', 'Cotton/Polyester Blends', 'Fleece Garments', 'High-Speed Automatic Presses'],
    curingNotes: 'Ensure tunnel dryer has adequate forced-air exhaust to purge moisture before crosslinking.',
  },
  'cc-clear-base': {
    name: 'CC Clear Base',
    category: 'Water Base Inks',
    code: 'CT-WB-02',
    description:
      'A versatile clear carrier vehicle engineered to accept high pigment concentrations while preserving ultra-soft fabric drape. Ideal for tonal prints, multi-color CMYK simulations, and bright pastel reductions.',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1000&q=80',
    pdfUrl: '/assets/pdfs/cc-clear-base.pdf',
    specs: {
      meshCount: '62T to 120T (156 – 305 mesh/in)',
      cureTemp: '150°C – 155°C (300°F – 310°F) for 2 min',
      viscosity: 'Medium-Flow Thixotropic Paste (140,000 cPs)',
      washFastness: '4.5 / 5.0 (ISO 105-C06)',
      chemistry: 'Aqueous Polyurethane-Acrylic Dispersion',
      shelfLife: '12 Months (store in cool ambient room)',
    },
    features: [
      'High pigment dispersion holding capacity',
      'Zero hand-feel on light pastel garments',
      'Non-tacky surface after full heat cure',
      'Excellent screen stability during long runs',
    ],
    applications: ['Fashion T-Shirts', 'Baby Apparel (Class I)', 'Discharge Underbases', 'Tone-on-Tone Graphics'],
    curingNotes: 'Compatible with standard water-dispersible pigment concentrates up to 12% addition by weight.',
  },
  'non-pvc-acrysol': {
    name: 'Non-PVC Oil Base Inks (Acrysol)',
    category: 'Non-PVC Oil Base Inks',
    code: 'CT-ACR-100',
    description:
      'Next-generation PVC-free acrylic polymer system engineered to deliver plastisol printing speed and opacity without vinyl chloride polymers, phthalates, or toxic plasticizers. Meets strictest international athletic brand RSL guidelines.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    pdfUrl: '/assets/pdfs/non-pvc-acrysol.pdf',
    specs: {
      meshCount: '43T to 90T (110 – 230 mesh/in)',
      cureTemp: '135°C – 145°C (275°F – 295°F) for 2 min',
      viscosity: 'High-Shear Thinning Pseudoplastic (160,000 cPs)',
      washFastness: '5.0 / 5.0 (ISO 105-C06 commercial launders)',
      chemistry: 'Phthalate-Free & PVC-Free Acrylic Resin',
      shelfLife: '24 Months in original sealed drum',
    },
    features: [
      '100% Certified Free from PVC & Phthalates',
      'Rapid wet-on-wet automatic press flow',
      'Exceptional elongation & 250% stretch recovery',
      'Full compliance with ZDHC MRSL Level 3',
    ],
    applications: ['Athletic Performance Sportswear', 'Spandex / Lycra Blends', 'Export Brand Garments', 'Swimwear'],
    curingNotes: 'Stir vigorously for 2 minutes before use to lower apparent viscosity. Does not skin in screens.',
  },
  'plastisol-inks': {
    name: 'Phthalate-Free Plastisol Inks',
    category: 'Phthalate-Free Plastisol Inks',
    code: 'CT-PLS-200',
    description:
      'The industrial benchmark for high-volume textile printing. Combines heavy opacity, rapid platen flash times, and absolute screen stability with safe, non-phthalate plasticizers conforming to European and US consumer safety acts.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    pdfUrl: '/assets/pdfs/phthalate-free-plastisol.pdf',
    specs: {
      meshCount: '34T to 120T (86 – 305 mesh/in)',
      cureTemp: '160°C (320°F) complete core fusion for 60s',
      viscosity: 'High Viscosity Non-Drip Body (210,000 cPs)',
      washFastness: '4.5 / 5.0 (ASTM D3990 standard)',
      chemistry: 'Phthalate-Free Vinyl Copolymer System',
      shelfLife: 'Indefinite (store @ 18°C–28°C away from heat)',
    },
    features: [
      'Never dries or clogs mesh during press shutdowns',
      'Brilliant opacity on dark navy and black cotton',
      'Rapid 3-second gel flash under infrared panels',
      'High abrasion resistance and wash durability',
    ],
    applications: ['High-Volume Contract Printing', 'Hoodies & Fleecewear', 'Uniforms & Workwear', 'Band Merchandise'],
    curingNotes: 'Requires core temperature probe verification to confirm 160°C fusion across complete deposit depth.',
  },
  'foil-gel': {
    name: 'Foil Gel',
    category: 'Specialty Inks',
    code: 'CT-SP-FL',
    description:
      'High-tack clear specialty adhesive gel formulated to bond permanently with vacuum-metallized transfer foils. Provides crisp line edge retention and mirror-gloss reflection without adhesive haloing.',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    pdfUrl: '/assets/pdfs/foil-gel.pdf',
    specs: {
      meshCount: '34T to 43T (86 – 110 mesh/in)',
      cureTemp: '150°C (300°F) tunnel cure + 165°C heat press',
      viscosity: 'High Tack Gel System (190,000 cPs)',
      washFastness: '4.0 / 5.0 (Cold wash inside out recommended)',
      chemistry: 'Thermoplastic Polyurethane Emulsion',
      shelfLife: '12 Months in cool dry warehouse',
    },
    features: [
      'High shear-bonding strength with hot-stamp foil rolls',
      'Clean edge definition with zero adhesive bleeding',
      'Cold-peel release gives highest optical reflectivity',
      'Wash-durable without peeling or cracking',
    ],
    applications: ['Fashion Graphic T-Shirts', 'Luxury Retail Apparel', 'Evening Wear', 'Promotional Headwear'],
    curingNotes: 'Allow garment to cool 100% to room temperature before peeling foil carrier sheet.',
  },
  'glitter-gel': {
    name: 'Glitter Gel',
    category: 'Specialty Inks',
    code: 'CT-SP-GL',
    description:
      'Ultra-clear suspension gel formulated to carry large micro-flake polyester glitters through coarse mesh without particle fallout or settling during printing.',
    image: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=800&q=80',
    pdfUrl: '/assets/pdfs/glitter-gel.pdf',
    specs: {
      meshCount: '15T to 32T (38 – 80 mesh/in)',
      cureTemp: '155°C – 160°C (310°F – 320°F) for 90s',
      viscosity: 'Transparent High-Yield Gel (175,000 cPs)',
      washFastness: '4.0 / 5.0 (Domestic wash 40°C)',
      chemistry: 'Clear Acrylic Suspension Compound',
      shelfLife: '12 Months',
    },
    features: [
      'Locks hexagonal glitter flakes firmly in matrix',
      'High optical clarity with zero milky haze',
      'Soft flexible feel across large solid designs',
      'Available pre-mixed or as clear carrier base',
    ],
    applications: ['Holiday Fashion Garments', 'Dancewear & Costumes', 'Childrenswear Graphics', 'Festival Merch'],
    curingNotes: 'Use rounded edge squeegee to avoid snapping or folding large metallic glitter flakes.',
  },
  'hd-gel': {
    name: 'HD Gel (High Definition)',
    category: 'Specialty Inks',
    code: 'CT-SP-HD',
    description:
      'Formulated for 3D sculptural print profiles with vertical 90-degree sidewalls. When printed through thick capillary film stencils, it maintains razor-sharp typographic definition with crystal clarity or tintable shades.',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
    pdfUrl: '/assets/pdfs/hd-gel.pdf',
    specs: {
      meshCount: '32T to 43T (80 – 110 mesh/in)',
      cureTemp: '160°C (320°F) for 120s slow conveyor dwell',
      viscosity: 'Extra Heavy Structural Paste (260,000 cPs)',
      washFastness: '4.5 / 5.0 (High abrasion resistance)',
      chemistry: 'High-Density Non-Phthalate Plastisol / Acrysol',
      shelfLife: '18 Months',
    },
    features: [
      'Maintains 90° brick-like square edge profiles',
      'Stackable build-up up to 500+ microns thickness',
      'Glass-like gloss or matte textured finishes',
      'Does not slump or round off under tunnel heat',
    ],
    applications: ['Branded Silicone-Look Emblems', 'Streetwear Heavy Graphics', 'Athletic Jerseys', 'Cap Accents'],
    curingNotes: 'Requires high screen snap-off (4–5mm) to pull cleanly from capillary stencil reservoirs.',
  },
  'foam-gel': {
    name: 'Foam Gel (3D Puff)',
    category: 'Specialty Inks',
    code: 'CT-SP-FM',
    description:
      'Expanding tactile puff additive that rises uniformly during tunnel curing to create soft, velvet-like 3D embossed effects. Formulated with calibrated gas micro-balloons for consistent expansion height.',
    image: 'https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?auto=format&fit=crop&w=800&q=80',
    pdfUrl: '/assets/pdfs/foam-gel.pdf',
    specs: {
      meshCount: '34T to 62T (86 – 156 mesh/in)',
      cureTemp: '150°C – 155°C (300°F – 310°F) for 120s',
      viscosity: 'Smooth Expanding Compound (170,000 cPs)',
      washFastness: '4.0 / 5.0 (Laundering cycle 40°C)',
      chemistry: 'Thermally Expandable Micro-Sphere Dispersion',
      shelfLife: '9 Months (store cool below 25°C)',
    },
    features: [
      'Uniform 3D loft expansion without cratering',
      'Soft spongy tactile hand with high tensile rebound',
      'Can be blended into standard spot color inks',
      'Vintage suede or rounded relief textures',
    ],
    applications: ['Vintage Suede Graphics', 'Collegiate Athletic Apparel', 'Childrenswear', 'Lifestyle Streetwear'],
    curingNotes: 'Do not over-cure above 160°C as excessive temperature can burst expanded micro-spheres.',
  },
  'metallic-inks': {
    name: 'Metallic Inks',
    category: 'Specialty Inks',
    code: 'CT-SP-MT',
    description:
      'Formulated with non-tarnishing treated bronze and aluminum alloy leafing flakes. Delivers radiant gold, silver, bronze, and copper lustre with outstanding wash durability and smooth screen passage.',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
    pdfUrl: '/assets/pdfs/metallic-inks.pdf',
    specs: {
      meshCount: '43T to 77T (110 – 196 mesh/in)',
      cureTemp: '150°C – 160°C (300°F – 320°F) for 90s',
      viscosity: 'Liquid Lustre Suspension (150,000 cPs)',
      washFastness: '4.0 / 5.0 (Wash inside out)',
      chemistry: 'Coated Metallic Flake in Aqueous/Oil Carrier',
      shelfLife: '12 Months',
    },
    features: [
      'Non-oxidizing treated metallic pigments',
      'Reflective liquid metal visual finish',
      'Smooth squeegee glide with minimal mesh drag',
      'Available in Rich Gold, Pale Gold, Silver & Copper',
    ],
    applications: ['Fashion Embellishments', 'Retail Branding', 'Sporting Medallions', 'Luxury Packaging & Fabrics'],
    curingNotes: 'For maximum leafing sheen, avoid over-curing and protect surface from heavy wash friction.',
  },
  'litho-backup-white': {
    name: 'Litho Backup White',
    category: 'Heat Transfer Application',
    code: 'CT-HT-LBW',
    description:
      'Engineered specifically as the protective foundation white for hot-split and cold-peel heat transfers. Provides high thermal opacity, prevents dye sublimation bleed from synthetic fabrics, and bonds tenaciously to hot-melt adhesives.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80',
    pdfUrl: '/assets/pdfs/litho-backup-white.pdf',
    specs: {
      meshCount: '34T to 55T (86 – 140 mesh/in)',
      cureTemp: 'Semi-Gel @ 95°C – 105°C (200°F – 220°F) only',
      viscosity: 'High Coverage Opaque Base (220,000 cPs)',
      washFastness: '4.5 / 5.0 (When transferred @ 160°C)',
      chemistry: 'PVC-Free or Plastisol Transfer Compound',
      shelfLife: '18 Months',
    },
    features: [
      'Extreme opacity to block dark garment show-through',
      'Dimensionally stable on PET transfer carrier films',
      'Optimized surface affinity for adhesive powder/gels',
      'Resistant to discoloration during thermal press cycles',
    ],
    applications: ['Tagless Neck Care Labels', 'Athletic Heat Transfers', 'Polyester Sports Uniforms', 'Cap Transfers'],
    curingNotes: 'Do NOT fully cure on transfer sheet. Only semi-gel so adhesive bonds during garment pressing.',
  },
  'transfer-adhesive-gel': {
    name: 'Transfer Adhesive Gel',
    category: 'Heat Transfer Application',
    code: 'CT-HT-TAG',
    description:
      'High-performance screen printable hot-melt adhesive gel. Applied as the final backing screen on transfer films, eliminating messy powder dusting while delivering permanent wash-fast adhesion across cotton, polyester, and nylon fabrics.',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1000&q=80',
    pdfUrl: '/assets/pdfs/transfer-adhesive-gel.pdf',
    specs: {
      meshCount: '24T to 43T (60 – 110 mesh/in)',
      cureTemp: 'Dry @ 90°C – 100°C; Press @ 150°C–165°C for 12s',
      viscosity: 'Tacky Bonding Vehicle (180,000 cPs)',
      washFastness: '5.0 / 5.0 (Resistant to industrial washing)',
      chemistry: 'Thermoplastic Polyurethane-Copolyester Gel',
      shelfLife: '12 Months',
    },
    features: [
      'Four custom formulations: Liquid Gel, Clear, Lycra, Thermoline',
      'Clean printable screen edges—no messy powder scattering',
      'High tensile bond strength on water-repellent nylon',
      'Maintains elastic rebound without adhesive stiffening',
    ],
    applications: ['Industrial Workwear Badges', 'Lycra/Spandex Transfers', 'Direct-to-Film (DTF) Backing', 'Rainwear Transfers'],
    curingNotes: 'Set heat press at 4.5 bar pressure with 12–15 seconds dwell time for deep adhesive flow.',
  },
  'craft-fabric-base': {
    name: 'Craft Ink Fabric Textile Base',
    category: 'Craft Ink',
    code: 'CI-FTB-101',
    description:
      'A specialty water-dispersed textile printing vehicle engineered for table printers, artisan workshops, and design schools. Features a prolonged open-screen wet time that resists screen clogging during manual, slow-pace hand printing.',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
    pdfUrl: '/assets/pdfs/craft-ink-fabric-textile-base.pdf',
    specs: {
      meshCount: '43T to 90T (110 – 230 mesh/in)',
      cureTemp: 'Air-dry 48 hrs or Iron cure 140°C for 90s',
      viscosity: 'Smooth Creamy Flow (110,000 cPs)',
      washFastness: '4.0 / 5.0 (Machine wash warm @ 40°C)',
      chemistry: 'Self-Crosslinking Aqueous Polymer',
      shelfLife: '18 Months',
    },
    features: [
      'Extended 30-minute open screen time without drying in mesh',
      '100% Odorless and non-toxic formulation',
      'Cleans up effortlessly with ordinary tap water',
      'Accepts standard liquid craft pigments and gouaches',
    ],
    applications: ['Artisan Hand-Table Printing', 'Canvas Tote Bags & Aprons', 'Boutique Home Textiles', 'Design Studio Samples'],
    curingNotes: 'Can be heat-set using a household iron on cotton setting (no steam) with protective parchment paper.',
  },
  'craft-opaque-white': {
    name: 'Craft Ink Opaque White',
    category: 'Craft Ink',
    code: 'CI-OPW-202',
    description:
      'Heavy-pigment opaque white screen printing ink crafted specifically for hand-pulled studio prints on black, dark denim, raw linen, and canvas fabrics. High solid density delivers striking single-pull opacity without stiff plastic crust.',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1000&q=80',
    pdfUrl: '/assets/pdfs/craft-ink-opaque-white.pdf',
    specs: {
      meshCount: '34T to 55T (86 – 140 mesh/in)',
      cureTemp: 'Air-dry + Iron heat-set @ 145°C for 2 min',
      viscosity: 'Rich Buttery Body (160,000 cPs)',
      washFastness: '4.0 / 5.0 (Standard laundry cycle)',
      chemistry: 'Water-Based High-Solid Titanium Dioxide Base',
      shelfLife: '18 Months',
    },
    features: [
      'Bright single-stroke coverage on black cotton and jute',
      'Silky smooth hand feel without chalking or peeling',
      'Easy hand-squeegee pull with minimal arm fatigue',
      'Non-yellowing pure neutral white pigment',
    ],
    applications: ['Boutique Apparel', 'Dark Fabric Screen Art', 'Handmade Posters & Linens', 'Custom Merchandise'],
    curingNotes: 'Allow prints to air-dry completely for 2 hours before executing final iron heat-setting.',
  },
  'craft-shimmer-base': {
    name: 'Craft Ink Shimmer Base',
    category: 'Craft Ink',
    code: 'CI-SHM-303',
    description:
      'Translucent pearlized suspension base embedded with ultra-fine cosmetic-grade mica flakes. Imparts an elegant iridescent shimmer to cotton, silk, and artisan papers without feeling coarse or scratchy on skin.',
    image: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=1000&q=80',
    pdfUrl: '/assets/pdfs/craft-ink-shimmer-base.pdf',
    specs: {
      meshCount: '43T to 77T (110 – 196 mesh/in)',
      cureTemp: 'Air-dry + Iron cure @ 140°C for 90s',
      viscosity: 'Lustrous Flow Paste (125,000 cPs)',
      washFastness: '4.0 / 5.0 (Gentle cycle recommended)',
      chemistry: 'Aqueous Mica Pearl Dispersion',
      shelfLife: '12 Months',
    },
    features: [
      'Subtle metallic gleam that shifts with viewing angles',
      'Non-scratchy feather-soft hand against the body',
      'Mixable with craft dyes to create custom pearl colors',
      'Non-toxic and safe for workshop and classroom use',
    ],
    applications: ['Artisan Scarves & Silks', 'Greeting Cards & Stationery', 'Limited-Edition Fashion Prints', 'Home Goods'],
    curingNotes: 'Iron on reverse side of fabric or use parchment interleaving to preserve pearl lustre.',
  },
};

export const Products: React.FC<ProductsProps> = ({ onSelectProductForInquiry }) => {
  const [activeCategory, setActiveCategory] = useState<
    'all' | 'water' | 'non-pvc' | 'plastisol' | 'specialty' | 'heat-transfer' | 'craft-ink'
  >('all');
  const [selectedProductSpec, setSelectedProductSpec] = useState<ProductSpec | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const blocks = sectionRef.current?.querySelectorAll('.product-category-block');
      blocks?.forEach((block) => {
        const banner = block.querySelector('.category-mini-banner');
        const cards = block.querySelectorAll('.product-card-visual');

        if (banner) {
          gsap.from(banner, {
            opacity: 0,
            y: 28,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: banner,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          });
        }

        if (cards.length > 0) {
          gsap.from(cards, {
            opacity: 0,
            y: 35,
            stagger: 0.12,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: block,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [activeCategory]);

  const handleInquiry = (productName: string) => {
    if (onSelectProductForInquiry) {
      onSelectProductForInquiry(productName);
    }
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenSpec = (specKey: string) => {
    if (productSpecsData[specKey]) {
      setSelectedProductSpec(productSpecsData[specKey]);
    }
  };

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'water', label: 'Water Base Inks' },
    { id: 'non-pvc', label: 'Non-PVC Oil Base' },
    { id: 'plastisol', label: 'Phthalate-Free Plastisol' },
    { id: 'specialty', label: 'Specialty Gels' },
    { id: 'heat-transfer', label: 'Heat Transfer' },
    { id: 'craft-ink', label: 'Craft Ink' },
  ];

  return (
    <section
      id="products"
      ref={sectionRef}
      className="section"
      style={{ backgroundColor: 'var(--bg-page)', paddingTop: '96px', paddingBottom: '110px' }}
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="badge-pill">
            <span className="accent-dot orange" />
            <span>Curated Product Catalogue</span>
          </div>
          <h2 className="section-title">High-Performance Textile Screen Printing Inks</h2>
          <p className="section-subtitle">
            Engineered for vivid pigment dispersion, superior opacity, soft hand-feel, and enduring commercial
            wash-fastness. Click any product to inspect or download its Technical Data Sheet (TDS).
          </p>

          {/* Interactive Category Filter Pills */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              marginTop: '34px',
            }}
          >
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id as any)}
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.875rem',
                    fontWeight: isSelected ? 700 : 500,
                    padding: '9px 22px',
                    borderRadius: 'var(--radius-full)',
                    border: isSelected ? '1.5px solid var(--primary-color)' : '1px solid var(--border-subtle)',
                    backgroundColor: isSelected ? 'var(--primary-color)' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : 'var(--text-body)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    boxShadow: isSelected ? '0 4px 14px rgba(43, 58, 143, 0.24)' : 'var(--shadow-xs)',
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ==========================================================================
            1. CATEGORY: WATER BASE INKS
            ========================================================================== */}
        {(activeCategory === 'all' || activeCategory === 'water') && (
          <div id="category-water" className="product-category-block" style={{ marginBottom: '72px' }}>
            {/* Full-Width Category Mini-Banner with Ken Burns Motion */}
            <div className="category-mini-banner">
              <div
                className="category-mini-banner-bg"
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=80")',
                }}
              />
              <div className="category-mini-banner-overlay" />
              <div className="category-mini-banner-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span className="accent-dot orange" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-gold)' }}>
                    Category 01
                  </span>
                </div>
                <h3 style={{ fontSize: '1.75rem', color: '#FFFFFF', marginBottom: '6px' }}>
                  Water Base Inks
                </h3>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.82)', maxWidth: '620px' }}>
                  Ecologically conscious water-dispersible formulations engineered for zero-feel softness, maximum breathability, and deep pigment penetration.
                </p>
              </div>
            </div>

            {/* Asymmetric 2-Column Product Cards */}
            <div className="grid-2">
              {/* Product: Prime H White */}
              <div
                className="product-card-visual"
                style={{ borderTop: '4px solid var(--accent-orange)' }}
                onClick={() => handleOpenSpec('prime-h-white')}
              >
                <div className="product-img-frame hero-height">
                  <img
                    src={PrimeHwhite}
                    alt="Prime H White high opaque ink print on dark fabric"
                    loading="lazy"
                  />
                  <div className="card-wash-overlay wash-orange" />
                  <div className="product-img-badge" style={{ backgroundColor: 'rgba(243, 112, 33, 0.9)' }}>
                    <Droplets size={14} />
                    <span>High Opaque Underbase</span>
                  </div>

                  {/* PDF Spec Badge Overlay */}
                  <div className="product-pdf-badge">
                    <FileText size={13} />
                    <span>View Details (PDF)</span>
                  </div>
                </div>

                <div className="product-card-body">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-orange)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Underbase Standard
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Code: CT-WB-01</span>
                    </div>

                    <h4 style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginBottom: '10px' }}>
                      Prime H White
                    </h4>
                    <p style={{ color: 'var(--text-body)', fontSize: '0.925rem', lineHeight: 1.65, marginBottom: '20px' }}>
                      High Opaque White Ink formulated for exceptional coverage and brightness on a variety of fabrics.
                      Ideal for underbase applications and detailed designs, ensuring printed colors pop and stay vibrant.
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                      <span style={{ fontSize: '0.75rem', background: 'var(--bg-pastel-blue)', color: 'var(--text-body)', padding: '5px 12px', borderRadius: '4px', fontWeight: 600 }}>
                        Maximum Opacity
                      </span>
                      <span style={{ fontSize: '0.75rem', background: 'var(--bg-pastel-blue)', color: 'var(--text-body)', padding: '5px 12px', borderRadius: '4px', fontWeight: 600 }}>
                        Non-Clogging Flow
                      </span>
                      <span style={{ fontSize: '0.75rem', background: 'var(--bg-pastel-blue)', color: 'var(--text-body)', padding: '5px 12px', borderRadius: '4px', fontWeight: 600 }}>
                        Dark & Light Garments
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenSpec('prime-h-white');
                      }}
                      className="btn btn-outline btn-sm"
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      <FileText size={15} />
                      <span>View TDS (PDF)</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInquiry('Prime H White');
                      }}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      <span>Inquire</span>
                      <MoveUpRight size={15} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Product: CC Clear Base */}
              <div
                className="product-card-visual"
                style={{ borderTop: '4px solid var(--accent-orange)' }}
                onClick={() => handleOpenSpec('cc-clear-base')}
              >
                <div className="product-img-frame hero-height">
                  <img
                    src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1000&q=80"
                    alt="CC Clear Base transparent pigment blending"
                    loading="lazy"
                  />
                  <div className="card-wash-overlay wash-orange" />
                  <div className="product-img-badge" style={{ backgroundColor: 'rgba(43, 58, 143, 0.9)' }}>
                    <Layers size={14} />
                    <span>Color & Transparency Base</span>
                  </div>

                  {/* PDF Spec Badge Overlay */}
                  <div className="product-pdf-badge">
                    <FileText size={13} />
                    <span>View Details (PDF)</span>
                  </div>
                </div>

                <div className="product-card-body">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-orange)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Pigment Vehicle
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Code: CT-WB-02</span>
                    </div>

                    <h4 style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginBottom: '10px' }}>
                      CC Clear Base
                    </h4>
                    <p style={{ color: 'var(--text-body)', fontSize: '0.925rem', lineHeight: 1.65, marginBottom: '20px' }}>
                      A versatile Clear Color Base that enhances brilliance and depth. Great for mixing with pigments
                      and additives to create custom colors while keeping a soft hand-feel. Ideal where transparency is desired.
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                      <span style={{ fontSize: '0.75rem', background: 'var(--bg-pastel-blue)', color: 'var(--text-body)', padding: '5px 12px', borderRadius: '4px', fontWeight: 600 }}>
                        High Pigment Load
                      </span>
                      <span style={{ fontSize: '0.75rem', background: 'var(--bg-pastel-blue)', color: 'var(--text-body)', padding: '5px 12px', borderRadius: '4px', fontWeight: 600 }}>
                        Feather-Soft Feel
                      </span>
                      <span style={{ fontSize: '0.75rem', background: 'var(--bg-pastel-blue)', color: 'var(--text-body)', padding: '5px 12px', borderRadius: '4px', fontWeight: 600 }}>
                        Tone-on-Tone Clarity
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenSpec('cc-clear-base');
                      }}
                      className="btn btn-outline btn-sm"
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      <FileText size={15} />
                      <span>View TDS (PDF)</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInquiry('CC Clear Base');
                      }}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      <span>Inquire</span>
                      <MoveUpRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================================
            2. CATEGORY: NON-PVC OIL BASE INKS (PVC-FREE ACRYSOL INKS)
            ========================================================================== */}
        {(activeCategory === 'all' || activeCategory === 'non-pvc') && (
          <div id="category-non-pvc" className="product-category-block" style={{ marginBottom: '72px' }}>
            {/* Mini-Banner */}
            <div className="category-mini-banner">
              <div
                className="category-mini-banner-bg"
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1600&q=80")',
                }}
              />
              <div className="category-mini-banner-overlay" />
              <div className="category-mini-banner-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span className="accent-dot teal" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-teal)' }}>
                    Category 02
                  </span>
                </div>
                <h3 style={{ fontSize: '1.75rem', color: '#FFFFFF', marginBottom: '6px' }}>
                  Non-PVC Oil Base Inks (PVC-Free Acrysol)
                </h3>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.82)', maxWidth: '620px' }}>
                  Next-generation Acrysol polymer systems offering traditional plastisol performance without any PVC or toxic plasticizers.
                </p>
              </div>
            </div>

            {/* Asymmetric Hero Card */}
            <div
              className="product-card-visual"
              style={{
                borderTop: '4px solid var(--accent-teal)',
                display: 'grid',
                gridTemplateColumns: '1.15fr 0.85fr',
              }}
              id="non-pvc-asymmetric-card"
              onClick={() => handleOpenSpec('non-pvc-acrysol')}
            >
              <div className="product-img-frame" style={{ height: '100%', minHeight: '340px' }}>
                <img
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"
                  alt="Non-PVC oil base acrysol ink macro texture"
                  loading="lazy"
                />
                <div className="card-wash-overlay wash-teal" />
                <div className="product-img-badge" style={{ backgroundColor: 'rgba(0, 168, 150, 0.9)' }}>
                  <ShieldCheck size={14} />
                  <span>100% Free from PVC</span>
                </div>

                <div className="product-pdf-badge">
                  <FileText size={13} />
                  <span>View Details (PDF)</span>
                </div>
              </div>

              <div className="product-card-body" style={{ padding: '36px 32px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span className="accent-dot teal" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-teal)', textTransform: 'uppercase' }}>
                      Eco-Certified Industrial Series • Code: CT-ACR-100
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '12px' }}>
                    Non-PVC Oil Base Inks (PVC-Free Acrysol Inks)
                  </h4>
                  <p style={{ color: 'var(--text-body)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '20px' }}>
                    Rich pigmentation and smooth application, completely free from PVC. Versatile and durable, suited for a wide range of textile applications.
                    Engineered to glide through fine mesh counts while providing the stretch and tensile memory needed for performance activewear.
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
                    <span style={{ fontSize: '0.75rem', background: 'var(--bg-pastel-blue)', color: 'var(--text-body)', padding: '5px 12px', borderRadius: '4px', fontWeight: 600 }}>
                      ✓ 100% Free from PVC
                    </span>
                    <span style={{ fontSize: '0.75rem', background: 'var(--bg-pastel-blue)', color: 'var(--text-body)', padding: '5px 12px', borderRadius: '4px', fontWeight: 600 }}>
                      ✓ Superior Wet-on-Wet Flow
                    </span>
                    <span style={{ fontSize: '0.75rem', background: 'var(--bg-pastel-blue)', color: 'var(--text-body)', padding: '5px 12px', borderRadius: '4px', fontWeight: 600 }}>
                      ✓ High Elasticity & Stretch Memory
                    </span>
                    <span style={{ fontSize: '0.75rem', background: 'var(--bg-pastel-blue)', color: 'var(--text-body)', padding: '5px 12px', borderRadius: '4px', fontWeight: 600 }}>
                      ✓ Brand RSL Compliant
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenSpec('non-pvc-acrysol');
                    }}
                    className="btn btn-outline"
                  >
                    <FileText size={16} />
                    <span>View TDS (PDF)</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInquiry('Non-PVC Oil Base Inks (Acrysol)');
                    }}
                    className="btn btn-primary"
                  >
                    <span>Inquire About Acrysol</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================================
            3. CATEGORY: PHTHALATE-FREE PLASTISOL INKS
            ========================================================================== */}
        {(activeCategory === 'all' || activeCategory === 'plastisol') && (
          <div id="category-plastisol" className="product-category-block" style={{ marginBottom: '72px' }}>
            {/* Mini-Banner */}
            <div className="category-mini-banner">
              <div
                className="category-mini-banner-bg"
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1600&q=80")',
                }}
              />
              <div className="category-mini-banner-overlay" />
              <div className="category-mini-banner-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span className="accent-dot purple" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-purple)' }}>
                    Category 03
                  </span>
                </div>
                <h3 style={{ fontSize: '1.75rem', color: '#FFFFFF', marginBottom: '6px' }}>
                  Phthalate-Free Plastisol Inks
                </h3>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.82)', maxWidth: '620px' }}>
                  Industrial workhorse durability with heavy opacity, zero screen drying, and complete phthalate compliance.
                </p>
              </div>
            </div>

            {/* Asymmetric Hero Card */}
            <div
              className="product-card-visual"
              style={{
                borderTop: '4px solid var(--accent-purple)',
                display: 'grid',
                gridTemplateColumns: '0.85fr 1.15fr',
              }}
              id="plastisol-asymmetric-card"
              onClick={() => handleOpenSpec('plastisol-inks')}
            >
              <div className="product-card-body" style={{ padding: '36px 32px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span className="accent-dot purple" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-purple)', textTransform: 'uppercase' }}>
                      Heavy-Duty Print Reliability • Code: CT-PLS-200
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '12px' }}>
                    Phthalate-Free Plastisol Inks
                  </h4>
                  <p style={{ color: 'var(--text-body)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '20px' }}>
                    Combines traditional plastisol durability with a commitment to safety and environmental responsibility.
                    Excellent opacity and color vibrancy for long-lasting, high-quality prints that never dry on the screen during production halts.
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
                    <span style={{ fontSize: '0.75rem', background: 'var(--bg-pastel-blue)', color: 'var(--text-body)', padding: '5px 12px', borderRadius: '4px', fontWeight: 600 }}>
                      ✓ 100% Phthalate Compliant
                    </span>
                    <span style={{ fontSize: '0.75rem', background: 'var(--bg-pastel-blue)', color: 'var(--text-body)', padding: '5px 12px', borderRadius: '4px', fontWeight: 600 }}>
                      ✓ Rapid Gel Flash Times
                    </span>
                    <span style={{ fontSize: '0.75rem', background: 'var(--bg-pastel-blue)', color: 'var(--text-body)', padding: '5px 12px', borderRadius: '4px', fontWeight: 600 }}>
                      ✓ High Tensile Stretch Recovery
                    </span>
                    <span style={{ fontSize: '0.75rem', background: 'var(--bg-pastel-blue)', color: 'var(--text-body)', padding: '5px 12px', borderRadius: '4px', fontWeight: 600 }}>
                      ✓ Extended Shelf Life
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenSpec('plastisol-inks');
                    }}
                    className="btn btn-outline"
                  >
                    <FileText size={16} />
                    <span>View TDS (PDF)</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInquiry('Phthalate-Free Plastisol Inks');
                    }}
                    className="btn btn-primary"
                  >
                    <span>Inquire About Plastisol Range</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              <div className="product-img-frame" style={{ height: '100%', minHeight: '340px' }}>
                <img
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80"
                  alt="Automatic screen printing press with plastisol ink"
                  loading="lazy"
                />
                <div className="card-wash-overlay wash-purple" />
                <div className="product-img-badge" style={{ backgroundColor: 'rgba(146, 39, 143, 0.9)' }}>
                  <Zap size={14} />
                  <span>High Opacity & Durability</span>
                </div>

                <div className="product-pdf-badge">
                  <FileText size={13} />
                  <span>View Details (PDF)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================================
            4. SUB-SECTION: SPECIALTY INKS (GRID OF 5 TACTILE IMAGE-LED CARDS)
            ========================================================================== */}
        {(activeCategory === 'all' || activeCategory === 'specialty') && (
          <div id="category-specialty" className="product-category-block" style={{ marginBottom: '72px' }}>
            {/* Mini-Banner */}
            <div className="category-mini-banner">
              <div
                className="category-mini-banner-bg"
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=1600&q=80")',
                }}
              />
              <div className="category-mini-banner-overlay" />
              <div className="category-mini-banner-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span className="accent-dot red" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-red)' }}>
                    Category 04
                  </span>
                </div>
                <h3 style={{ fontSize: '1.75rem', color: '#FFFFFF', marginBottom: '6px' }}>
                  Specialty Inks & Tactile Gels
                </h3>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.82)', maxWidth: '620px' }}>
                  Premium sensory finishes engineered for luxury fashion, retail apparel, and eye-catching promotional prints.
                </p>
              </div>
            </div>

            {/* 5-Item Asymmetric Tactile Card Grid */}
            <div className="grid-5">
              {/* 1. Foil Gel */}
              <div
                className="product-card-visual"
                style={{ borderTop: '4px solid var(--accent-gold)' }}
                onClick={() => handleOpenSpec('foil-gel')}
              >
                <div className="product-img-frame compact-height">
                  <img
                    src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80"
                    alt="Metallic gold foil print close-up"
                    loading="lazy"
                  />
                  <div className="card-wash-overlay wash-gold" />
                  <div className="product-img-badge" style={{ backgroundColor: 'rgba(251, 176, 59, 0.95)', color: '#1A2352' }}>
                    <Gem size={13} />
                    <span>Luxurious Finish</span>
                  </div>
                  <div className="product-pdf-badge">
                    <FileText size={12} />
                    <span>TDS (PDF)</span>
                  </div>
                </div>
                <div className="product-card-body" style={{ padding: '20px 20px 24px' }}>
                  <div>
                    <h4 style={{ fontSize: '1.18rem', color: 'var(--text-main)', marginBottom: '8px' }}>Foil Gel</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-body)', lineHeight: 1.55, marginBottom: '16px' }}>
                      Enables metallic foil effects with excellent adhesion for a luxurious finish.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenSpec('foil-gel');
                    }}
                    className="btn btn-outline btn-sm"
                    style={{ width: '100%', fontSize: '0.8rem', padding: '8px 12px', justifyContent: 'center' }}
                  >
                    <FileText size={14} />
                    <span>View Spec Sheet</span>
                  </button>
                </div>
              </div>

              {/* 2. Glitter Gel */}
              <div
                className="product-card-visual"
                style={{ borderTop: '4px solid var(--accent-orange)' }}
                onClick={() => handleOpenSpec('glitter-gel')}
              >
                <div className="product-img-frame compact-height">
                  <img
                    src="https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=800&q=80"
                    alt="Glitter ink sparkle texture macro"
                    loading="lazy"
                  />
                  <div className="card-wash-overlay wash-orange" />
                  <div className="product-img-badge" style={{ backgroundColor: 'rgba(243, 112, 33, 0.9)' }}>
                    <Sparkles size={13} />
                    <span>Multi-Dimension</span>
                  </div>
                  <div className="product-pdf-badge">
                    <FileText size={12} />
                    <span>TDS (PDF)</span>
                  </div>
                </div>
                <div className="product-card-body" style={{ padding: '20px 20px 24px' }}>
                  <div>
                    <h4 style={{ fontSize: '1.18rem', color: 'var(--text-main)', marginBottom: '8px' }}>Glitter Gel</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-body)', lineHeight: 1.55, marginBottom: '16px' }}>
                      Adds sparkle and dimension; ideal for fashion and promotional items.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenSpec('glitter-gel');
                    }}
                    className="btn btn-outline btn-sm"
                    style={{ width: '100%', fontSize: '0.8rem', padding: '8px 12px', justifyContent: 'center' }}
                  >
                    <FileText size={14} />
                    <span>View Spec Sheet</span>
                  </button>
                </div>
              </div>

              {/* 3. HD Gel */}
              <div
                className="product-card-visual"
                style={{ borderTop: '4px solid var(--primary-color)' }}
                onClick={() => handleOpenSpec('hd-gel')}
              >
                <div className="product-img-frame compact-height">
                  <img
                    src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80"
                    alt="High definition razor sharp print details"
                    loading="lazy"
                  />
                  <div className="card-wash-overlay wash-purple" />
                  <div className="product-img-badge" style={{ backgroundColor: 'rgba(43, 58, 143, 0.9)' }}>
                    <Layers size={13} />
                    <span>Sharp Definition</span>
                  </div>
                  <div className="product-pdf-badge">
                    <FileText size={12} />
                    <span>TDS (PDF)</span>
                  </div>
                </div>
                <div className="product-card-body" style={{ padding: '20px 20px 24px' }}>
                  <div>
                    <h4 style={{ fontSize: '1.18rem', color: 'var(--text-main)', marginBottom: '8px' }}>HD Gel</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-body)', lineHeight: 1.55, marginBottom: '16px' }}>
                      High Definition Gel for fine details and sharp, crisp prints with enhanced color depth.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenSpec('hd-gel');
                    }}
                    className="btn btn-outline btn-sm"
                    style={{ width: '100%', fontSize: '0.8rem', padding: '8px 12px', justifyContent: 'center' }}
                  >
                    <FileText size={14} />
                    <span>View Spec Sheet</span>
                  </button>
                </div>
              </div>

              {/* 4. Foam Gel */}
              <div
                className="product-card-visual"
                style={{ borderTop: '4px solid var(--accent-red)' }}
                onClick={() => handleOpenSpec('foam-gel')}
              >
                <div className="product-img-frame compact-height">
                  <img
                    src="https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?auto=format&fit=crop&w=800&q=80"
                    alt="Puff 3D raised foam tactile print"
                    loading="lazy"
                  />
                  <div className="card-wash-overlay wash-red" />
                  <div className="product-img-badge" style={{ backgroundColor: 'rgba(237, 28, 36, 0.9)' }}>
                    <Flame size={13} />
                    <span>3D Raised Puff</span>
                  </div>
                  <div className="product-pdf-badge">
                    <FileText size={12} />
                    <span>TDS (PDF)</span>
                  </div>
                </div>
                <div className="product-card-body" style={{ padding: '20px 20px 24px' }}>
                  <div>
                    <h4 style={{ fontSize: '1.18rem', color: 'var(--text-main)', marginBottom: '8px' }}>Foam Gel</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-body)', lineHeight: 1.55, marginBottom: '16px' }}>
                      Expands during curing to create a soft, raised, textured finish.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenSpec('foam-gel');
                    }}
                    className="btn btn-outline btn-sm"
                    style={{ width: '100%', fontSize: '0.8rem', padding: '8px 12px', justifyContent: 'center' }}
                  >
                    <FileText size={14} />
                    <span>View Spec Sheet</span>
                  </button>
                </div>
              </div>

              {/* 5. Metallic Inks */}
              <div
                className="product-card-visual"
                style={{ borderTop: '4px solid var(--accent-teal)' }}
                onClick={() => handleOpenSpec('metallic-inks')}
              >
                <div className="product-img-frame compact-height">
                  <img
                    src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80"
                    alt="Metallic shimmer ink brilliance"
                    loading="lazy"
                  />
                  <div className="card-wash-overlay wash-teal" />
                  <div className="product-img-badge" style={{ backgroundColor: 'rgba(0, 168, 150, 0.9)' }}>
                    <SunMedium size={13} />
                    <span>Eye-Catching Shine</span>
                  </div>
                  <div className="product-pdf-badge">
                    <FileText size={12} />
                    <span>TDS (PDF)</span>
                  </div>
                </div>
                <div className="product-card-body" style={{ padding: '20px 20px 24px' }}>
                  <div>
                    <h4 style={{ fontSize: '1.18rem', color: 'var(--text-main)', marginBottom: '8px' }}>Metallic Inks</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-body)', lineHeight: 1.55, marginBottom: '16px' }}>
                      Available in water-based and solvent-based formulations for brilliant, eye-catching shine.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenSpec('metallic-inks');
                    }}
                    className="btn btn-outline btn-sm"
                    style={{ width: '100%', fontSize: '0.8rem', padding: '8px 12px', justifyContent: 'center' }}
                  >
                    <FileText size={14} />
                    <span>View Spec Sheet</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================================
            5. SUB-SECTION: HEAT TRANSFER APPLICATION
            ========================================================================== */}
        {(activeCategory === 'all' || activeCategory === 'heat-transfer') && (
          <div id="category-heat-transfer" className="product-category-block" style={{ marginBottom: '72px' }}>
            {/* Mini-Banner */}
            <div className="category-mini-banner">
              <div
                className="category-mini-banner-bg"
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1600&q=80")',
                }}
              />
              <div className="category-mini-banner-overlay" />
              <div className="category-mini-banner-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span className="accent-dot gold" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-gold)' }}>
                    Category 05
                  </span>
                </div>
                <h3 style={{ fontSize: '1.75rem', color: '#FFFFFF', marginBottom: '6px' }}>
                  Heat Transfer Application
                </h3>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.82)', maxWidth: '620px' }}>
                  Engineered backing whites and high-tack adhesive bonding gels designed for crisp, permanent heat transfer embellishments.
                </p>
              </div>
            </div>

            {/* Asymmetric 2-Column Product Cards */}
            <div className="grid-2">
              {/* Product: Litho Backup White */}
              <div
                className="product-card-visual"
                style={{ borderTop: '4px solid var(--accent-gold)' }}
                onClick={() => handleOpenSpec('litho-backup-white')}
              >
                <div className="product-img-frame hero-height">
                  <img
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80"
                    alt="Litho Backup White high thermal stability print backing"
                    loading="lazy"
                  />
                  <div className="card-wash-overlay wash-gold" />
                  <div className="product-img-badge" style={{ backgroundColor: 'rgba(43, 58, 143, 0.9)' }}>
                    <Droplets size={14} />
                    <span>Heat Transfer System</span>
                  </div>
                  <div className="product-pdf-badge">
                    <FileText size={13} />
                    <span>View Details (PDF)</span>
                  </div>
                </div>

                <div className="product-card-body">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Backing Foundation
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Code: CT-HT-LBW</span>
                    </div>

                    <h4 style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginBottom: '10px' }}>
                      Litho Backup White
                    </h4>
                    <p style={{ color: 'var(--text-body)', fontSize: '0.925rem', lineHeight: 1.65, marginBottom: '20px' }}>
                      Formulated for heat transfer applications with exceptional opacity and coverage; creates a solid white base
                      for vibrant printed colors and excellent fabric adhesion. Available in phthalate-free and PVC-free systems.
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                      <span style={{ fontSize: '0.75rem', background: 'var(--bg-pastel-blue)', color: 'var(--text-body)', padding: '5px 12px', borderRadius: '4px', fontWeight: 600 }}>
                        Phthalate-Free & PVC-Free
                      </span>
                      <span style={{ fontSize: '0.75rem', background: 'var(--bg-pastel-blue)', color: 'var(--text-body)', padding: '5px 12px', borderRadius: '4px', fontWeight: 600 }}>
                        Solid White Foundation
                      </span>
                      <span style={{ fontSize: '0.75rem', background: 'var(--bg-pastel-blue)', color: 'var(--text-body)', padding: '5px 12px', borderRadius: '4px', fontWeight: 600 }}>
                        High Thermal Adhesion
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenSpec('litho-backup-white');
                      }}
                      className="btn btn-outline btn-sm"
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      <FileText size={15} />
                      <span>View TDS (PDF)</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInquiry('Litho Backup White');
                      }}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      <span>Inquire</span>
                      <MoveUpRight size={15} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Product: Transfer Adhesive Gel */}
              <div
                className="product-card-visual"
                style={{ borderTop: '4px solid var(--accent-gold)' }}
                onClick={() => handleOpenSpec('transfer-adhesive-gel')}
              >
                <div className="product-img-frame hero-height">
                  <img
                    src="https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1000&q=80"
                    alt="Transfer adhesive gel bonding layer"
                    loading="lazy"
                  />
                  <div className="card-wash-overlay wash-gold" />
                  <div className="product-img-badge" style={{ backgroundColor: 'rgba(251, 176, 59, 0.95)', color: '#1A2352' }}>
                    <Layers size={14} />
                    <span>4 Formulations</span>
                  </div>
                  <div className="product-pdf-badge">
                    <FileText size={13} />
                    <span>View Details (PDF)</span>
                  </div>
                </div>

                <div className="product-card-body">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        High-Bond Adhesive
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Code: CT-HT-TAG</span>
                    </div>

                    <h4 style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginBottom: '10px' }}>
                      Transfer Adhesive Gel
                    </h4>
                    <p style={{ color: 'var(--text-body)', fontSize: '0.925rem', lineHeight: 1.65, marginBottom: '16px' }}>
                      Ensures strong, reliable adhesion for heat transfer applications, with a user-friendly formulation for crisp, vibrant, durable results.
                    </p>

                    <div style={{ marginBottom: '22px' }}>
                      <div style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                        Available Product Codes:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        <span style={{ fontSize: '0.75rem', background: 'var(--primary-light)', color: 'var(--primary-color)', padding: '4px 10px', borderRadius: '4px', fontWeight: 700 }}>
                          Liquid Gel
                        </span>
                        <span style={{ fontSize: '0.75rem', background: 'var(--primary-light)', color: 'var(--primary-color)', padding: '4px 10px', borderRadius: '4px', fontWeight: 700 }}>
                          Transfer Clear
                        </span>
                        <span style={{ fontSize: '0.75rem', background: 'var(--primary-light)', color: 'var(--primary-color)', padding: '4px 10px', borderRadius: '4px', fontWeight: 700 }}>
                          Lycra Gel
                        </span>
                        <span style={{ fontSize: '0.75rem', background: 'var(--primary-light)', color: 'var(--primary-color)', padding: '4px 10px', borderRadius: '4px', fontWeight: 700 }}>
                          Thermoline Adhesive Gel
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenSpec('transfer-adhesive-gel');
                      }}
                      className="btn btn-outline btn-sm"
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      <FileText size={15} />
                      <span>View TDS (PDF)</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInquiry('Transfer Adhesive Gel');
                      }}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      <span>Inquire</span>
                      <MoveUpRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================================
            6. NEW CATEGORY: CRAFT INK
            ========================================================================== */}
        {(activeCategory === 'all' || activeCategory === 'craft-ink') && (
          <div id="category-craft-ink" className="product-category-block">
            {/* Mini-Banner */}
            <div className="category-mini-banner">
              <div
                className="category-mini-banner-bg"
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=80")',
                }}
              />
              <div className="category-mini-banner-overlay" />
              <div className="category-mini-banner-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span className="accent-dot orange" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-orange)' }}>
                    Category 06
                  </span>
                </div>
                <h3 style={{ fontSize: '1.75rem', color: '#FFFFFF', marginBottom: '6px' }}>
                  Craft Ink Series
                </h3>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.82)', maxWidth: '620px' }}>
                  Artisanal, studio, and boutique formulations with slow-drying screen stability, zero odor, and simple tap-water cleanup.
                </p>
              </div>
            </div>

            {/* 3-Column Craft Ink Card Grid */}
            <div className="grid-3">
              {/* 1. Craft Ink Fabric Textile Base */}
              <div
                className="product-card-visual"
                style={{ borderTop: '4px solid var(--accent-orange)' }}
                onClick={() => handleOpenSpec('craft-fabric-base')}
              >
                <div className="product-img-frame compact-height">
                  <img
                    src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80"
                    alt="Craft Ink Fabric Textile Base manual print"
                    loading="lazy"
                  />
                  <div className="card-wash-overlay wash-orange" />
                  <div className="product-img-badge" style={{ backgroundColor: 'rgba(243, 112, 33, 0.9)' }}>
                    <Palette size={13} />
                    <span>Table Printing Base</span>
                  </div>
                  <div className="product-pdf-badge">
                    <FileText size={12} />
                    <span>TDS (PDF)</span>
                  </div>
                </div>
                <div className="product-card-body" style={{ padding: '24px 22px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-orange)', textTransform: 'uppercase' }}>
                        Slow-Dry Matrix
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CI-FTB-101</span>
                    </div>

                    <h4 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '8px' }}>
                      Craft Ink Fabric Textile Base
                    </h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '16px' }}>
                      Formulated for slow manual hand printing without screen clogging. Mixes effortlessly with pigments for vibrant cotton and linen textiles.
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                      <span style={{ fontSize: '0.72rem', background: 'var(--bg-pastel-blue)', color: 'var(--text-body)', padding: '4px 10px', borderRadius: '4px', fontWeight: 600 }}>
                        Water Washable
                      </span>
                      <span style={{ fontSize: '0.72rem', background: 'var(--bg-pastel-blue)', color: 'var(--text-body)', padding: '4px 10px', borderRadius: '4px', fontWeight: 600 }}>
                        30m Open Screen
                      </span>
                      <span style={{ fontSize: '0.72rem', background: 'var(--bg-pastel-blue)', color: 'var(--text-body)', padding: '4px 10px', borderRadius: '4px', fontWeight: 600 }}>
                        Non-Toxic
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenSpec('craft-fabric-base');
                      }}
                      className="btn btn-outline btn-sm"
                      style={{ flex: 1, fontSize: '0.8rem', padding: '8px 10px', justifyContent: 'center' }}
                    >
                      <FileText size={14} />
                      <span>View TDS</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInquiry('Craft Ink Fabric Textile Base');
                      }}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1, fontSize: '0.8rem', padding: '8px 10px', justifyContent: 'center' }}
                    >
                      <span>Inquire</span>
                      <MoveUpRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. Craft Ink Opaque White */}
              <div
                className="product-card-visual"
                style={{ borderTop: '4px solid var(--primary-color)' }}
                onClick={() => handleOpenSpec('craft-opaque-white')}
              >
                <div className="product-img-frame compact-height">
                  <img
                    src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1000&q=80"
                    alt="Craft Ink Opaque White printed on dark cotton tote"
                    loading="lazy"
                  />
                  <div className="card-wash-overlay wash-purple" />
                  <div className="product-img-badge" style={{ backgroundColor: 'rgba(43, 58, 143, 0.9)' }}>
                    <Droplets size={13} />
                    <span>Dark Fabric Coverage</span>
                  </div>
                  <div className="product-pdf-badge">
                    <FileText size={12} />
                    <span>TDS (PDF)</span>
                  </div>
                </div>
                <div className="product-card-body" style={{ padding: '24px 22px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-color)', textTransform: 'uppercase' }}>
                        Pure Titanium Base
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CI-OPW-202</span>
                    </div>

                    <h4 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '8px' }}>
                      Craft Ink Opaque White
                    </h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '16px' }}>
                      Solid single-pull white opacity for artisan tote bags, black cotton apparel, and heavyweight denim without plastisol stiffness.
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                      <span style={{ fontSize: '0.72rem', background: 'var(--bg-pastel-blue)', color: 'var(--text-body)', padding: '4px 10px', borderRadius: '4px', fontWeight: 600 }}>
                        High Opacity
                      </span>
                      <span style={{ fontSize: '0.72rem', background: 'var(--bg-pastel-blue)', color: 'var(--text-body)', padding: '4px 10px', borderRadius: '4px', fontWeight: 600 }}>
                        Iron Heat-Set
                      </span>
                      <span style={{ fontSize: '0.72rem', background: 'var(--bg-pastel-blue)', color: 'var(--text-body)', padding: '4px 10px', borderRadius: '4px', fontWeight: 600 }}>
                        Soft Touch
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenSpec('craft-opaque-white');
                      }}
                      className="btn btn-outline btn-sm"
                      style={{ flex: 1, fontSize: '0.8rem', padding: '8px 10px', justifyContent: 'center' }}
                    >
                      <FileText size={14} />
                      <span>View TDS</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInquiry('Craft Ink Opaque White');
                      }}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1, fontSize: '0.8rem', padding: '8px 10px', justifyContent: 'center' }}
                    >
                      <span>Inquire</span>
                      <MoveUpRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. Craft Ink Shimmer Base */}
              <div
                className="product-card-visual"
                style={{ borderTop: '4px solid var(--accent-gold)' }}
                onClick={() => handleOpenSpec('craft-shimmer-base')}
              >
                <div className="product-img-frame compact-height">
                  <img
                    src="https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=1000&q=80"
                    alt="Craft Ink Shimmer Base pearl lustre texture"
                    loading="lazy"
                  />
                  <div className="card-wash-overlay wash-gold" />
                  <div className="product-img-badge" style={{ backgroundColor: 'rgba(251, 176, 59, 0.95)', color: '#1A2352' }}>
                    <Sparkles size={13} />
                    <span>Pearl Shimmer</span>
                  </div>
                  <div className="product-pdf-badge">
                    <FileText size={12} />
                    <span>TDS (PDF)</span>
                  </div>
                </div>
                <div className="product-card-body" style={{ padding: '24px 22px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase' }}>
                        Artisan Pearl Base
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CI-SHM-303</span>
                    </div>

                    <h4 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '8px' }}>
                      Craft Ink Shimmer Base
                    </h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '16px' }}>
                      Translucent pearl and mica suspension for delicate, shimmering prints on silk, organic cotton, and handmade paper products.
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                      <span style={{ fontSize: '0.72rem', background: 'var(--bg-pastel-blue)', color: 'var(--text-body)', padding: '4px 10px', borderRadius: '4px', fontWeight: 600 }}>
                        Lustrous Mica
                      </span>
                      <span style={{ fontSize: '0.72rem', background: 'var(--bg-pastel-blue)', color: 'var(--text-body)', padding: '4px 10px', borderRadius: '4px', fontWeight: 600 }}>
                        Feather Touch
                      </span>
                      <span style={{ fontSize: '0.72rem', background: 'var(--bg-pastel-blue)', color: 'var(--text-body)', padding: '4px 10px', borderRadius: '4px', fontWeight: 600 }}>
                        Workshop Safe
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenSpec('craft-shimmer-base');
                      }}
                      className="btn btn-outline btn-sm"
                      style={{ flex: 1, fontSize: '0.8rem', padding: '8px 10px', justifyContent: 'center' }}
                    >
                      <FileText size={14} />
                      <span>View TDS</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInquiry('Craft Ink Shimmer Base');
                      }}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1, fontSize: '0.8rem', padding: '8px 10px', justifyContent: 'center' }}
                    >
                      <span>Inquire</span>
                      <MoveUpRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TDS In-Page PDF Viewer Modal */}
      <PdfViewerModal
        product={selectedProductSpec}
        onClose={() => setSelectedProductSpec(null)}
        onInquire={handleInquiry}
      />

      <style>{`
        @media (max-width: 900px) {
          #non-pvc-asymmetric-card, #plastisol-asymmetric-card {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
