import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  BookOpen,
  Clock,
  ArrowRight,
  X,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Droplets,
  Layers,
  ShieldCheck,
  Zap,
  Sparkles,
  ChevronRight,
  FileCheck2
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Guide {
  id: string;
  category: string;
  badgeColor: string;
  icon: React.ComponentType<{ size?: number; color?: string; className?: string }>;
  readTime: string;
  title: string;
  subtitle: string;
  summary: string;
  takeaways: string[];
  fullArticle: {
    overview: string;
    sections: {
      heading: string;
      content: string;
      checklist?: string[];
      table?: {
        headers: string[];
        rows: string[][];
      };
      advisory?: string;
    }[];
    proTip: string;
    standardRef: string;
  };
}

const guidesData: Guide[] = [
  {
    id: 'guide-water-base-curing',
    category: 'Curing & Drying',
    badgeColor: 'var(--accent-orange)',
    icon: Flame,
    readTime: '5 min read',
    title: 'Water Base Curing & Temperature Guidelines',
    subtitle: 'Conveyor dryer parameters, moisture evaporation phases, and wash-test verification protocols',
    summary:
      'Unlike plastisol inks that simply fuse with heat, water-based formulations require a two-stage curing dynamic: complete moisture evaporation followed by cross-linking of the polymer binder. Achieving full commercial wash-fastness depends on maintaining optimal dwell times and chamber airflow.',
    takeaways: [
      'Maintain continuous chamber temperature of 150°C – 160°C (300°F – 320°F)',
      'Requires minimum 2.5 to 3.0 minutes dwell time under forced-air velocity',
      'Infrared radiant heat alone is insufficient without high CFMs of exhaust airflow',
      'Execute AATCC-61 2A wash testing only after a minimum 24-hour post-cure stabilization',
    ],
    fullArticle: {
      overview:
        'Water-based screen printing inks are ecologically superior and deliver unmatched feather-soft hand feel on luxury garments. However, curing water-based chemistry demands strict discipline compared to plastisol. Plastisol is 100% solid and fuses immediately upon reaching 160°C, whereas water-based inks contain 40% to 55% water vehicle by volume. This water must be fully vaporized before the core resin cross-links with the cellulose fibers.',
      sections: [
        {
          heading: '1. The Two-Stage Thermal Phase Dynamics',
          content:
            'Stage 1 (Evaporation Phase): As the garment enters the tunnel dryer, high-velocity hot air must strip the boundary moisture layer. If chamber humidity is trapped due to poor exhaust CFM, water vapor re-condenses onto the ink film, stalling evaporation.\n\nStage 2 (Polymerization Phase): Once dry to the touch, the acrylic or polyurethane resin reaches its cross-linking temperature (typically 150°C – 160°C). Chemical bonds form permanently between the ink matrix and garment fibers.',
          checklist: [
            'Calibrate belt speed so the printed garment spends at least 150 seconds in the heated tunnel.',
            'Confirm dryer exhaust damper is open 20–30% to purge moisture-laden air continuously.',
            'Never stack freshly cured shirts immediately hot off the belt to prevent ghosting or moisture reabsorption.',
          ],
        },
        {
          heading: '2. Curing Profile Matrix by Fabric Substrate',
          content:
            'Different textile fibers absorb differing volumes of water vehicle. 100% heavy combed cotton holds significant latent moisture that cools the ink surface during early tunnel transit.',
          table: {
            headers: ['Substrate Type', 'Target Core Temp', 'Minimum Dwell Time', 'Forced Air CFM', 'Recommended Additive'],
            rows: [
              ['100% Combed Ring-Spun Cotton', '155°C – 160°C', '160 – 180 seconds', 'High (1200+ CFM)', 'None (Standard Base)'],
              ['Polyester / Cotton 50/50 Blends', '145°C – 150°C', '180 – 210 seconds', 'High (1200+ CFM)', '1.5% Low-Temp Crosslinker'],
              ['100% Rayon / Viscose', '140°C – 145°C', '200 seconds', 'Moderate (900 CFM)', '2% Chemtech Fixer Agent'],
              ['100% Synthetic Polyester (Dark)', '135°C – 140°C', '210 seconds', 'High (1400 CFM)', 'Bleed-Block Carbon Underbase'],
            ],
          },
          advisory:
            'CRITICAL: Always use a calibrated thermal probe (e.g. donut probe) attached directly to the ink surface. Tunnel display thermometers read ambient chamber air, which is frequently 15°C to 25°C hotter than the actual ink film.',
        },
        {
          heading: '3. Wash-Testing Protocol & Quality Assurance',
          content:
            'Never release production lots based solely on a thumb-stretch test. Allow test garments to rest undisturbed for 24 hours to complete residual cross-linking. Conduct 5 consecutive commercial wash cycles at 60°C with harsh detergent. Inspect under standard D65 illuminant light booths for fibrillative erosion or edge peeling.',
        },
      ],
      proTip:
        'Pro Technician Tip: When printing long runs in dry climates, add 2% to 3% Chemtech Retarder Gel into the flood bar reservoir to prevent mesh drying without lengthening tunnel dwell time.',
      standardRef: 'ASTM D3990 / AATCC Method 61-2A (Colorfastness to Laundering)',
    },
  },
  {
    id: 'guide-plastisol-troubleshooting',
    category: 'Troubleshooting',
    badgeColor: 'var(--accent-purple)',
    icon: Zap,
    readTime: '6 min read',
    title: 'Plastisol Print Troubleshooting & Best Practices',
    subtitle: 'Resolving ink cracking, fiber fibrillation, under-curing, and squeegee durometer selection',
    summary:
      'Plastisol is the industrial workhorse of high-volume garment production. Yet, over 80% of factory customer complaints stem from two easily avoidable errors: mistaken under-curing diagnosed as ink breakdown, and fiber fibrillation misidentified as fading.',
    takeaways: [
      'Differentiate between wash fibrillation (fabric fibers lifting) vs ink cracking (under-cure)',
      'Triple-durometer squeegees (65/90/65) maximize ink shearing without driving ink into the weave',
      'Flash curing should only gel the surface (90°C – 105°C) without initiating full fusion',
      'Verify 160°C (320°F) core fusion throughout the entire ink deposit depth',
    ],
    fullArticle: {
      overview:
        'Modern phthalate-free plastisol inks offer immense stability on the press, never drying in the screen during production halts or shift changes. However, industrial screen printers often face quality rejects after the garment is washed by the end consumer. Mastering squeegee hydraulics, flash gelation, and fusion verification ensures zero garment returns.',
      sections: [
        {
          heading: '1. Cracking vs. Fibrillation: Accurate Diagnosis',
          content:
            'Under-Curing (Cracking): When a print cracks upon gentle manual stretching, the plastisol PVC/acrylic resin failed to reach its fusion threshold of 160°C completely through the ink film. The top skin may be fused while the ink base against the fabric is still semi-solid.\n\nFibrillation (Apparent Fading): When a print looks muted after washing but shows no cracking, fabric cotton fibers have broken through the ink layer. The ink did not break down; rather, the underlying shirt fibers stood upright upon wet agitation.',
          checklist: [
            'Perform a stretch test: pull printed fabric laterally 50%. If micro-fissures appear, increase dryer dwell by 15 seconds.',
            'To eliminate fibrillation on 100% cotton: use an iron-press flattening screen on head 2, or apply a smooth underbase clear.',
            'Ensure mesh tension is maintained above 25 N/cm for clean snap-off and sharp surface ink shearing.',
          ],
        },
        {
          heading: '2. Squeegee Durometer & Angle Engineering',
          content:
            'A soft squeegee (60 durometer) bends under pressure, forcing excess ink into the knit fibers rather than laying a clean film on the garment surface. For high-speed automatic presses, a 65/90/65 triple durometer squeegee provides rigid blade support with flexible edge contact.',
          table: {
            headers: ['Durometer Profile', 'Recommended Print Head', 'Angle', 'Target Application'],
            rows: [
              ['65 / 90 / 65 Triple', 'Underbase White & High Opacity', '15° from vertical', 'Smooth ink deposit on coarse fleece & ring-spun'],
              ['70 Single Durometer', 'Spot Colors & Blends', '10° – 15°', 'Standard athletic & retail jersey prints'],
              ['80 Single Durometer', 'Fine Halftones & CMYK (4-Color)', '5° – 10°', 'Razor-sharp dot retention on 280–355 mesh'],
              ['75 / 95 / 75 Triple', 'High Density & 3D Stencils', 'Vertical (0° – 5°)', 'Maximum hydrostatic pressure through thick capillary films'],
            ],
          },
        },
        {
          heading: '3. Flash Cure Optimization',
          content:
            'Flashing must ONLY gel the ink surface so the subsequent color can print wet-on-dry without picking. Over-flashing cures the underbase completely, causing subsequent ink layers to peel away due to lack of inter-coat adhesion.',
        },
      ],
      proTip:
        'Pro Technician Tip: Check flash platen heat buildup. As platens warm up during an 8-hour shift, drop flash timer settings by 0.5 to 1.0 seconds to prevent scorching and inter-coat delamination.',
      standardRef: 'ISO 105-C06 (Colour fastness to domestic and commercial laundering)',
    },
  },
  {
    id: 'guide-non-pvc-acrysol',
    category: 'Performance Fabrics',
    badgeColor: 'var(--accent-teal)',
    icon: ShieldCheck,
    readTime: '5 min read',
    title: 'Non-PVC Acrysol: Maximizing Stretch & Hand-Feel',
    subtitle: 'Ink rheology management, dye migration blocking on poly-spandex, and ultra-soft hand feel',
    summary:
      'Engineered for premium sportswear and brand compliance, Non-PVC Acrysol systems eliminate toxic phthalates and vinyl chlorides while matching plastisol opacity. Discover how to control ink rheology for flawless elasticity on high-stretch activewear.',
    takeaways: [
      'Stir Acrysol vigorously before printing to activate shear-thinning thixotropic viscosity',
      'Print on 100% polyester activewear using a low-bleed barrier underbase at 130°C',
      'Acrysol offers superior elastic memory and prevents cracking on 4-way stretch spandex',
      'Provides true zero-hand feel when printed through high mesh counts (80T – 120T / cm)',
    ],
    fullArticle: {
      overview:
        'Major international athletic and fashion brands have placed strict Restricted Substance Lists (RSL) prohibiting polyvinyl chloride (PVC) formulations. Chemtech Acrysol represents the cutting edge of acrylic-based synthetic dispersions, delivering the wet-on-wet production speed of plastisol with zero PVC or phthalate content and exceptional tensile recovery.',
      sections: [
        {
          heading: '1. Thixotropic Rheology & Stirring Protocol',
          content:
            'Acrysol is highly thixotropic. Out of the drum, it appears stiff and gelatinous. Do NOT immediately add solvent or water thinners. High-shear mechanical mixing for 2 to 3 minutes lowers the apparent viscosity by up to 40%, transforming the paste into a creamy, fast-flowing consistency ready for fine mesh.',
          checklist: [
            'Mechanically stir the ink for at least 180 seconds before pouring onto the screen.',
            'If viscosity adjustment is required, add Chemtech Acrysol Thinner at no more than 1% to 2% by weight.',
            'Keep ink reservoirs covered during extended breaks to prevent volatile carrier evaporation.',
          ],
        },
        {
          heading: '2. Sublimation & Dye Migration Blocking on Polyester',
          content:
            'Disperse dyes used in sublimated athletic wear volatilize when exposed to heat above 135°C, bleeding into top white inks and turning them dingy pink or grey. Acrysol must be paired with an active barrier underbase.',
          table: {
            headers: ['Step', 'Application Screen', 'Mesh Count', 'Cure / Flash Temp', 'Function'],
            rows: [
              ['Head 1', 'Low-Bleed Carbon Black / Grey Base', '43T (110 mesh)', 'Flash @ 100°C for 3s', 'Binds volatilized disperse gas molecules'],
              ['Head 2', 'Acrysol High Opaque Barrier White', '62T (156 mesh)', 'Flash @ 105°C for 3s', 'Provides radiant opacity and neutral light bounce'],
              ['Head 3-6', 'Acrysol Spot Pantone Shades', '77T – 90T mesh', 'Wet-on-Wet or Flash', 'Delivers vibrant shade fidelity with elastic memory'],
              ['Final Oven', 'Conveyor Tunnel', 'All Fabrics', '135°C – 140°C for 150s', 'Low-temperature full cure preventing dye release'],
            ],
          },
        },
      ],
      proTip:
        'Pro Technician Tip: On 4-way stretch leggings (85% Nylon / 15% Spandex), test elongation using a tensile gauge. Fully cured Acrysol can achieve 250% elongation with 98% snapback recovery.',
      standardRef: 'ZDHC MRSL Level 3 / OEKO-TEX Standard 100 Class I (Baby Wear Safe)',
    },
  },
  {
    id: 'guide-specialty-gels',
    category: 'Specialty Effects',
    badgeColor: 'var(--accent-gold)',
    icon: Sparkles,
    readTime: '6 min read',
    title: 'Specialty Gels: Step-by-Step for Foil, Glitter, HD & Foam Prints',
    subtitle: 'Mesh selection, peel temperatures, puff expansion ratios, and high-density capillary stencils',
    summary:
      'Specialty embellishments command highest retail markups for fashion apparel. From mirrored metallic foil transfers and shimmering chunky glitters to razor-sharp 3D high-density relief and tactile foam, precision execution separates master printers from novices.',
    takeaways: [
      'Foil Gel: Use cold-peel technique at 165°C / 6 bar pressure for maximum gloss retention',
      'Glitter Gel: Select monofilament mesh with opening 30% larger than particle flake size',
      'HD (High Density) Gel: Build 200–400 micron stencils using capillary film for 90° razor edges',
      'Foam Gel: Control oven temperature precisely—every 5°C alters 3D puff volume expansion',
    ],
    fullArticle: {
      overview:
        'Tactile and high-gloss embellishments turn basic graphic tees into premium designer merchandise. However, specialty inks are unforgiving of loose screen tension, incorrect squeegee durometers, or inaccurate heat press timing. Follow these exact formulations and mechanical parameters.',
      sections: [
        {
          heading: '1. Foil Gel Application & Transfer Press Protocol',
          content:
            'Chemtech Foil Gel is formulated to bond tenaciously with vacuum-metallized PET foils without perimeter flaking or washing degradation.',
          checklist: [
            'Screen Prep: Print through a 34T to 43T (86–110 mesh) screen with medium flood pressure.',
            'Print Deposit: Ensure an even 60–80 micron wet deposit. Flash cure until tack-free.',
            'Tunnel Cure: Run garment through dryer at 150°C to ensure 100% gel cross-linking.',
            'Heat Pressing: Apply foil roll at 165°C (330°F), heavy pressure (5–6 bar), for 12–15 seconds.',
            'Peel Method: Allow the garment to cool COMPLETELY to ambient room temperature before peeling (Cold Peel). Rapid hot peeling will pull glue and cloud the mirror finish.',
          ],
        },
        {
          heading: '2. High-Density (HD) 3D Relief Gel Stencil Engineering',
          content:
            'Achieving square, sharp 90-degree brick edges requires thick capillary film rather than liquid emulsion coats.',
          table: {
            headers: ['Parameter', 'Specification', 'Reason / Diagnostic Impact'],
            rows: [
              ['Stencil Type', '200 to 400 micron Capillary Film', 'Liquid emulsion sags in mesh openings, rounding edges'],
              ['Mesh Count', '32T to 43T Monofilament Polyester', 'Allows high solid volume passage with zero clogging'],
              ['Squeegee', '75 / 95 / 75 Triple Durometer Flat Blade', 'Prevents blade bending into deep stencil reservoirs'],
              ['Off-Contact', '4.0 mm – 5.5 mm', 'High snap-off prevents vacuum pulling when screen lifts'],
            ],
          },
        },
        {
          heading: '3. Foam Gel (Puff) Expansion Mechanics',
          content:
            'Chemtech Foam Gel contains encapsulated gas micro-spheres that expand when heat-activated. Over-curing collapses the micro-spheres, producing a deflated, wrinkled finish. Under-curing results in low loft that washes out. Maintain tunnel temperature strictly between 150°C and 155°C for 120 seconds.',
        },
      ],
      proTip:
        'Pro Technician Tip: When printing 0.008” or 0.015” hex glitter flakes, use a square-edged 65 durometer squeegee with gentle stroke pressure. Pushing too hard bends the flakes horizontally, muting light reflection.',
      standardRef: 'AATCC Test Method 88B (Smoothness of seams and fabric prints after laundering)',
    },
  },
  {
    id: 'guide-heat-transfer-application',
    category: 'Heat Transfer',
    badgeColor: 'var(--primary-color)',
    icon: Layers,
    readTime: '5 min read',
    title: 'Heat Transfer Application: Backing White & Adhesive Layering',
    subtitle: 'Reverse-print sequencing, gel drying parameters, and permanent fabric heat bonding',
    summary:
      'Custom litho-transfers and plastisol transfers provide neck-label comfort, razor fine typography, and on-demand garment decorating. Success requires reverse printing sequences, precise gelation, and balanced adhesive powder or liquid coating.',
    takeaways: [
      'Strict reverse print order: Colors first, followed by Litho Backup White, then Adhesive Gel',
      'Gel drying must not exceed 105°C—fully curing transfer sheets on the carrier ruins garment adhesion',
      'Choose adhesive formulation based on substrate: Lycra Gel for spandex, Liquid Gel for cotton',
      'Calibrate transfer press pressure to 4-5 kg/cm² to ensure melt flow into fabric interstices',
    ],
    fullArticle: {
      overview:
        'Screen printed transfers allow apparel manufacturers to decorate unconstructed panels, cap visors, and sportswear with zero garment wastage. However, unlike direct printing, heat transfers require reverse thinking: the first color printed onto the release paper or PET film becomes the topmost layer on the finished shirt.',
      sections: [
        {
          heading: '1. The Reverse Print Layer Sequence',
          content:
            '1. Clear Carrier Release Film: Dimensionally stable matte or gloss polyester film.\n2. Detail Colors / Artwork: Spot shades and four-color process details printed in reverse orientation.\n3. Litho Backup White: Heavy-opacity white that seals the colors, blocks dark shirt color bleed, and provides a uniform bonding surface.\n4. Hot-Melt Adhesive Layer: Either screen-printed Transfer Adhesive Gel or dusted polyamide / polyurethane hot-melt powder.',
          checklist: [
            'Maintain air-conditioned clean-room conditions (22°C / 50% RH) to avoid PET carrier film distortion.',
            'Each color layer must be flashed to just tack-free (80°C – 95°C) to allow inter-coat fusion.',
            'Never bake transfer sheets at direct-curing temperatures (160°C). Sheets must only reach 95°C – 105°C to preserve heat-activated adhesives for final garment application.',
          ],
        },
        {
          heading: '2. Heat Press Transfer Parameters',
          content:
            'Transfer presses must be checked with thermal paper across all four platen quadrants to eliminate cold spots.',
          table: {
            headers: ['Fabric Composition', 'Heat Press Temp', 'Dwell Time', 'Pressure', 'Release Method'],
            rows: [
              ['100% Combed Cotton', '160°C – 165°C', '12 – 14 seconds', 'Medium-High (4.5 bar)', 'Warm or Cold Peel'],
              ['Polyester / Nylon Activewear', '135°C – 140°C', '15 seconds', 'Medium (3.5 bar)', 'Strictly Cold Peel'],
              ['Spandex / Elastane Blends', '140°C – 145°C', '14 seconds', 'High (5 bar)', 'Cold Peel (Lycra Base)'],
              ['Polypropylene / Non-Woven Bags', '120°C – 125°C', '10 seconds', 'Low (2.5 bar)', 'Cold Peel'],
            ],
          },
        },
      ],
      proTip:
        'Pro Technician Tip: When storing printed transfer sheets before garment application, slip parchment interleaving sheets between prints and store flat below 28°C away from direct sunlight.',
      standardRef: 'DIN EN ISO 6330 (Domestic washing and drying procedures for textile testing)',
    },
  },
  {
    id: 'guide-chemical-safety-compliance',
    category: 'Compliance & Safety',
    badgeColor: 'var(--accent-teal)',
    icon: Droplets,
    readTime: '7 min read',
    title: 'Chemical Safety & Environmental Compliance in Screen Printing',
    subtitle: 'Wastewater filtration, phthalate-free handling, and global Brand RSL / OEKO-TEX alignment',
    summary:
      'Global textile buyers demand absolute supply chain transparency. From ZDHC Level 3 MRSL verification and OEKO-TEX Eco-Passport standards to responsible screen washout wastewater treatment, learn how modern print houses operate cleanly and pass international audits.',
    takeaways: [
      'Maintain certified 0% phthalate segregation protocols in mixing kitchens',
      'Implement multi-stage settling and carbon filtration for screen washout drains',
      'Ensure strict adherence to Zero Discharge of Hazardous Chemicals (ZDHC) standards',
      'Maintain full batch traceability and Safety Data Sheets (SDS) for all chemical lots',
    ],
    fullArticle: {
      overview:
        'Environmental compliance is no longer a corporate public relations slogan—it is a mandatory commercial prerequisite for Tier-1 garment vendors serving brands such as Nike, Adidas, Inditex, and H&M. Chemtech Polymers manufactures exclusively in alignment with global eco-toxicological standards, eliminating harmful endocrine disruptors and persistent bioaccumulative toxins.',
      sections: [
        {
          heading: '1. Restricted Substance List (RSL) Parameter Limits',
          content:
            'All Chemtech formulations undergo gas chromatography-mass spectrometry (GC-MS) verification to guarantee sub-part-per-million purity.',
          table: {
            headers: ['Restricted Chemical Class', 'Historical Risk', 'Chemtech Standard', 'Audit Threshold Limit'],
            rows: [
              ['Ortho-Phthalates (DEHP, DBP, BBP)', 'Hormone disruptors in traditional plastisols', 'ND (< 10 ppm)', 'Max 50 ppm permitted'],
              ['Alkylphenol Ethoxylates (APEO/NPEO)', 'Toxic to aquatic organisms via wastewater', 'ND (< 5 ppm)', 'Max 20 ppm permitted'],
              ['Heavy Metals (Lead, Cadmium, Mercury)', 'Toxic residues in cheap pigments', 'ND (< 1 ppm)', 'Max 10 ppm combined'],
              ['Organotin Compounds', 'Heat stabilizers in low-grade plastics', 'ND (< 0.1 ppm)', 'Max 0.5 ppm permitted'],
              ['Formaldehyde & Formaldehyde Donors', 'Skin irritant in cheap fixation agents', 'ND (< 16 ppm)', 'Zero for Infant Wear'],
            ],
          },
        },
        {
          heading: '2. Print House Washout Wastewater Filtration',
          content:
            'Screens stripped with chemical reclaimers and degreasers should never flow untreated into municipal sewage drains.',
          checklist: [
            'Install a 3-chamber settling tank directly beneath screen reclaim washout booths.',
            'Utilize non-hazardous, biodegradable, citrus-based screen degreasers and emulsion strippers.',
            'Dewater solids using flocking agents and discard dried residue via licensed industrial waste contractors.',
            'Store Safety Data Sheets (SDS) in clearly labeled physical binders near every ink mixing station.',
          ],
        },
      ],
      proTip:
        'Pro Compliance Tip: Always conduct quarterly cross-contamination audits. Never use metal spatulas or mixing paddles interchangeably between non-compliant plastisol remnants and certified Acrysol / Water-based inks.',
      standardRef: 'ZDHC MRSL Version 3.1 / OEKO-TEX Standard 100 Class I & II',
    },
  },
];

export const ApplicationGuides: React.FC = () => {
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll('.guide-card');
      if (cards && cards.length > 0) {
        gsap.from(cards, {
          opacity: 0,
          y: 35,
          stagger: 0.12,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Modal ESC listener and body scroll lock
  useEffect(() => {
    if (!selectedGuide) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedGuide(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedGuide]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <section
      id="resources"
      ref={sectionRef}
      className="section"
      style={{
        backgroundColor: '#F8FAFC',
        paddingTop: '96px',
        paddingBottom: '110px',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="badge-pill">
            <span className="accent-dot blue" />
            <span>Technical Knowledge & Best Practices</span>
          </div>
          <h2 className="section-title">Ink Application & Process Guides</h2>
          <p className="section-subtitle">
            Authoritative technical literature, temperature profiles, and troubleshooting protocols researched by
            Chemtech Polymers application chemists for industrial screen printing facilities.
          </p>
        </div>

        {/* 6 Guides Grid */}
        <div className="guides-grid">
          {guidesData.map((guide) => {
            const IconComponent = guide.icon;
            return (
              <div key={guide.id} className="guide-card">
                <div className="guide-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div className="guide-category-badge" style={{ backgroundColor: `${guide.badgeColor}18`, color: guide.badgeColor }}>
                      <IconComponent size={14} color={guide.badgeColor} />
                      <span>{guide.category}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <Clock size={13} />
                      <span>{guide.readTime}</span>
                    </div>
                  </div>

                  <h3 className="guide-card-title">{guide.title}</h3>
                  <p className="guide-card-subtitle">{guide.subtitle}</p>
                </div>

                <div className="guide-card-body">
                  <p className="guide-card-summary">{guide.summary}</p>

                  <div className="guide-takeaways-preview">
                    <div className="guide-takeaways-label">Key Takeaways Preview:</div>
                    <ul className="guide-takeaways-list">
                      {guide.takeaways.slice(0, 3).map((item, idx) => (
                        <li key={idx}>
                          <CheckCircle2 size={13} color="var(--primary-color)" className="takeaway-bullet-icon" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="guide-card-footer">
                  <button
                    type="button"
                    onClick={() => setSelectedGuide(guide)}
                    className="btn btn-outline btn-sm guide-read-btn"
                  >
                    <span>Read Technical Guide</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Technical Support Callout Strip */}
        <div className="guides-support-callout">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="support-icon-ring">
              <BookOpen size={24} color="var(--primary-color)" />
            </div>
            <div>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)', margin: '0 0 4px' }}>
                Need Custom Factory Formulations or On-Site Line Audits?
              </h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-body)' }}>
                Our application engineers provide on-site technical diagnostics, dryer profiling, and RSL compliance support for production factories across India.
              </p>
            </div>
          </div>
          <a
            href="#contact"
            className="btn btn-primary btn-sm"
            style={{ whiteSpace: 'nowrap' }}
          >
            <span>Consult an Application Chemist</span>
            <ChevronRight size={16} />
          </a>
        </div>
      </div>

      {/* ==========================================================================
          IN-PAGE FULL TECHNICAL READER MODAL
          ========================================================================== */}
      {selectedGuide && (
        <div
          className="guide-modal-backdrop"
          onClick={(e) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
              setSelectedGuide(null);
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="guide-reader-title"
        >
          <div className="guide-modal-container" ref={modalRef}>
            {/* Header Bar */}
            <div className="guide-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  className="guide-modal-icon-badge"
                  style={{ backgroundColor: `${selectedGuide.badgeColor}18`, color: selectedGuide.badgeColor }}
                >
                  <selectedGuide.icon size={20} color={selectedGuide.badgeColor} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="guide-modal-topic-tag" style={{ color: selectedGuide.badgeColor }}>
                      {selectedGuide.category}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>• {selectedGuide.readTime}</span>
                  </div>
                  <h3 id="guide-reader-title" className="guide-modal-title">
                    {selectedGuide.title}
                  </h3>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="btn btn-outline btn-sm guide-modal-print-btn"
                  title="Print Technical Bulletin"
                >
                  <Printer size={15} />
                  <span>Print Bulletin</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedGuide(null)}
                  className="tds-close-btn"
                  aria-label="Close Guide"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Scrollable Reader Body */}
            <div className="guide-modal-body">
              {/* Abstract Banner */}
              <div className="guide-abstract-box">
                <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--primary-color)', marginBottom: '6px' }}>
                  Technical Abstract & Industrial Scope
                </div>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-body)', lineHeight: 1.7 }}>
                  {selectedGuide.fullArticle.overview}
                </p>
              </div>

              {/* Comprehensive Takeaways Checklist */}
              <div className="guide-checklist-container">
                <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileCheck2 size={18} color="var(--accent-teal)" />
                  <span>Key Processing Guidelines & Takeaways</span>
                </h4>
                <div className="guide-checklist-grid">
                  {selectedGuide.takeaways.map((item, idx) => (
                    <div key={idx} className="guide-checklist-item">
                      <CheckCircle2 size={16} color="var(--accent-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Article Sections */}
              <div className="guide-article-content">
                {selectedGuide.fullArticle.sections.map((section, sIdx) => (
                  <div key={sIdx} className="guide-article-section">
                    <h4 className="guide-section-heading">{section.heading}</h4>
                    <p className="guide-section-text">{section.content}</p>

                    {/* Optional Section Checklist */}
                    {section.checklist && (
                      <div className="guide-sub-checklist">
                        {section.checklist.map((cItem, cIdx) => (
                          <div key={cIdx} className="guide-sub-item">
                            <div className="guide-sub-bullet" />
                            <span>{cItem}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Optional Technical Matrix Table */}
                    {section.table && (
                      <div className="guide-table-wrapper">
                        <table className="guide-table">
                          <thead>
                            <tr>
                              {section.table.headers.map((h, hIdx) => (
                                <th key={hIdx}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {section.table.rows.map((row, rIdx) => (
                              <tr key={rIdx}>
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx}>{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Optional Critical Advisory Callout */}
                    {section.advisory && (
                      <div className="guide-advisory-box">
                        <AlertTriangle size={20} color="var(--accent-orange)" style={{ flexShrink: 0 }} />
                        <div>{section.advisory}</div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Pro Chemist Tip */}
                <div className="guide-protip-box">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Sparkles size={16} color="var(--accent-gold)" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase' }}>
                      Application Chemist Advice
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.925rem', color: 'var(--text-body)', lineHeight: 1.65 }}>
                    {selectedGuide.fullArticle.proTip}
                  </p>
                </div>

                {/* Reference Standard Stamp */}
                <div className="guide-standard-ref">
                  <ShieldCheck size={16} color="var(--primary-color)" />
                  <span>Grounded in International Standard: <strong>{selectedGuide.fullArticle.standardRef}</strong></span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="guide-modal-footer">
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Chemtech Polymers Technical Bulletin Archive — Reference Only
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedGuide(null)}
                  className="btn btn-outline btn-sm"
                >
                  Close Article
                </button>
                <a
                  href="#contact"
                  onClick={() => setSelectedGuide(null)}
                  className="btn btn-primary btn-sm"
                >
                  <span>Request Factory Lab Support</span>
                  <ArrowRight size={15} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
