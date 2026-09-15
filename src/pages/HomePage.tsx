import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  CheckCircle2,
  Droplets,
  ShieldCheck,
  Zap,
  Sparkles,
  Layers,
  Palette,
  ChevronRight,
  Award,
  BookOpen,
  Clock,
  Factory,
  Truck,
  FlaskConical,
} from 'lucide-react';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { articlesData } from '../data/articlesData';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 240;
const currentFrame = (index: number) =>
  `assets/PhotoForAnimation/ezgif-frame-${String(index + 1).padStart(3, '0')}.jpg`;

export const HomePage: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const industriesRef = useRef<HTMLDivElement>(null);

  // Full-page canvas frame-sequence refs and loading state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const headlineWords = [
    { text: 'Innovative', highlight: false },
    { text: 'Textile', highlight: false },
    { text: 'Screen', highlight: false },
    { text: 'Printing', highlight: false },
    { text: 'Inks,', highlight: false },
    { text: 'Engineered', highlight: true },
    { text: 'for', highlight: true },
    { text: 'Excellence', highlight: true },
  ];

  // Preload all 240 frames and initialize canvas Apple-style scroll-scrubbing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    let isCancelled = false;
    const images: HTMLImageElement[] = [];
    const frameObj = { frame: 0 };
    let lastRenderedIndex = -1;

    const updateCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasDimensions();

    const drawFrame = (index: number, force = false) => {
      const boundedIndex = Math.max(0, Math.min(FRAME_COUNT - 1, index));
      if (!force && boundedIndex === lastRenderedIndex) return;

      const img = images[boundedIndex];
      if (!img || !img.complete || !img.naturalWidth) return;

      lastRenderedIndex = boundedIndex;

      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.naturalWidth / img.naturalHeight;

      let drawWidth: number;
      let drawHeight: number;
      let offsetX: number;
      let offsetY: number;

      if (imgRatio > canvasRatio) {
        drawHeight = canvas.height;
        drawWidth = img.naturalWidth * (drawHeight / img.naturalHeight);
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
      } else {
        drawWidth = canvas.width;
        drawHeight = img.naturalHeight * (drawWidth / img.naturalWidth);
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
      }

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    const handleResize = () => {
      updateCanvasDimensions();
      drawFrame(Math.round(frameObj.frame), true);
    };
    window.addEventListener('resize', handleResize);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Preload all 240 images
    let loadedCount = 0;
    const preloadImages = () => {
      return new Promise<void>((resolve) => {
        for (let i = 0; i < FRAME_COUNT; i++) {
          const img = new Image();
          img.onload = () => {
            if (isCancelled) return;
            loadedCount++;
            const pct = Math.round((loadedCount / FRAME_COUNT) * 100);
            setLoadProgress(pct);

            // Draw initial frame as soon as frame 0 is ready
            if (i === 0 && !prefersReducedMotion) {
              drawFrame(0, true);
            }

            if (loadedCount === FRAME_COUNT) {
              resolve();
            }
          };
          img.onerror = () => {
            if (isCancelled) return;
            loadedCount++;
            if (loadedCount === FRAME_COUNT) {
              resolve();
            }
          };
          img.src = currentFrame(i);
          images[i] = img;
        }
      });
    };

    let stTween: gsap.core.Tween | null = null;

    preloadImages().then(() => {
      if (isCancelled) return;
      setIsLoaded(true);

      if (prefersReducedMotion) {
        // Render static frame 120 (0-indexed 119)
        drawFrame(119, true);
        return;
      }

      // Initial frame draw
      drawFrame(0, true);

      // Setup GSAP ScrollTrigger spanning the entire page
      stTween = gsap.to(frameObj, {
        frame: FRAME_COUNT - 1,
        ease: 'none',
        scrollTrigger: {
          id: 'canvas-frame-scrub',
          trigger: pageRef.current || document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
        onUpdate: () => {
          drawFrame(Math.round(frameObj.frame));
        },
      });

      ScrollTrigger.refresh();
    });

    return () => {
      isCancelled = true;
      window.removeEventListener('resize', handleResize);
      if (stTween) {
        stTween.scrollTrigger?.kill();
        stTween.kill();
      }
    };
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Hero Entrance Timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero-content', {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: 'power3.out',
      })
        .from(
          '.hero-badge-item',
          {
            opacity: 0,
            y: -12,
            duration: 0.5,
          },
          '-=0.4'
        )
        .from(
          '.hero-word',
          {
            opacity: 0,
            y: 20,
            stagger: 0.05,
            duration: 0.6,
          },
          '-=0.3'
        )
        .from(
          '.hero-subheadline',
          {
            opacity: 0,
            y: 16,
            duration: 0.6,
          },
          '-=0.3'
        )
        .from(
          '.hero-cta-group',
          {
            opacity: 0,
            y: 14,
            duration: 0.5,
          },
          '-=0.3'
        )
        .from(
          '.hero-trust-row',
          {
            opacity: 0,
            y: 12,
            duration: 0.5,
          },
          '-=0.3'
        );

      // Process Timeline Animation
      gsap.fromTo(
        '.process-connecting-line',
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1,
          duration: 1.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: processRef.current || '#our-process',
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.process-step-card',
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.14,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: processRef.current || '#our-process',
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );

      // Industries Cards Animation
      gsap.fromTo(
        '.industry-card',
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: industriesRef.current || '#industries-we-serve',
            start: 'top 88%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );

      // Safety fallback: ensure all cards become visible even if scroll is abrupt or ScrollTrigger refreshed late
      if (typeof IntersectionObserver !== 'undefined') {
        const revealObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const el = entry.target as HTMLElement;
                el.style.opacity = '1';
                el.style.transform = 'none';
                revealObserver.unobserve(el);
              }
            });
          },
          { threshold: 0.1, rootMargin: '0px 0px 50px 0px' }
        );
        document.querySelectorAll('.process-step-card, .industry-card, .guide-card').forEach((el) => {
          revealObserver.observe(el);
        });
      }

    });

    return () => {
      ctx.revert();
    };
  }, []);

  const processSteps = [
    {
      step: '01',
      title: 'R&D & Formulation',
      desc: 'Precision chemical compounding, viscosity tuning, and pigment matching engineered for high-speed automatic presses.',
      icon: <FlaskConical size={24} />,
      accentColor: 'var(--color-secondary-green)',
      accentBg: 'var(--color-secondary-green-soft)',
    },
    {
      step: '02',
      title: 'High-Dispersal Manufacturing',
      desc: 'Triple-roll milling and planetary high-shear dispersion ensuring sub-micron pigment consistency with zero mesh clogging.',
      icon: <Factory size={24} />,
      accentColor: 'var(--color-accent-orange)',
      accentBg: 'var(--color-accent-orange-soft)',
    },
    {
      step: '03',
      title: 'Rigorous Quality Testing',
      desc: 'Automated rheology analysis, AATCC wash-fastness, and elongation stretch testing to guarantee batch repeatability.',
      icon: <ShieldCheck size={24} />,
      accentColor: 'var(--color-accent-purple)',
      accentBg: 'var(--color-accent-purple-soft)',
    },
    {
      step: '04',
      title: 'Prompt Pan-India Delivery',
      desc: 'Dedicated logistics network providing rapid fulfillment and consistent bulk replenishment across major textile clusters.',
      icon: <Truck size={24} />,
      accentColor: 'var(--color-accent-teal)',
      accentBg: 'var(--color-accent-teal-soft)',
    },
  ];

  const industriesList = [
    {
      title: 'Textile Screen Printers',
      desc: 'High-volume garment printing houses running MHM, Roq, and automatic carousel presses demanding stable viscosity and fast flashes.',
      icon: <Layers size={26} />,
      accentColor: 'var(--color-primary)',
      accentBg: 'var(--color-primary-light)',
    },
    {
      title: 'Garment Manufacturers & Exporters',
      desc: 'Tier-1 export factories requiring certified compliance with global brand Restricted Substance Lists (ZDHC & OEKO-TEX).',
      icon: <Factory size={26} />,
      accentColor: 'var(--color-secondary-green)',
      accentBg: 'var(--color-secondary-green-soft)',
    },
    {
      title: 'Promotional Product Companies',
      desc: 'Decorators printing athletic wear, high-opacity tote bags, caps, and branded corporate merchandise with high wash fastness.',
      icon: <Sparkles size={26} />,
      accentColor: 'var(--color-accent-orange)',
      accentBg: 'var(--color-accent-orange-soft)',
    },
    {
      title: 'Fashion & Streetwear Brands',
      desc: 'Apparel brands seeking tactile 3D high-density relief, mirrored foil embellishments, metallic luster, and velvet puff textures.',
      icon: <Palette size={26} />,
      accentColor: 'var(--color-accent-purple)',
      accentBg: 'var(--color-accent-purple-soft)',
    },
    {
      title: 'Craft & Hobby Studios',
      desc: 'Artisan textile workshops, flatbed vacuum tables, and block printers utilizing safe, non-toxic, water-washable formulations.',
      icon: <Droplets size={26} />,
      accentColor: 'var(--color-accent-mustard)',
      accentBg: 'var(--color-accent-mustard-soft)',
    },
    {
      title: 'Distributors & Stockists',
      desc: 'Regional chemical distributors and wholesale suppliers seeking dependable bulk inventory with guaranteed lot consistency.',
      icon: <Zap size={26} />,
      accentColor: 'var(--color-accent-teal)',
      accentBg: 'var(--color-accent-teal-soft)',
    },
  ];

  return (
    <div ref={pageRef} className="home-page" style={{ paddingTop: 0, backgroundColor: 'transparent' }}>
      {/* Full-page canvas frame-sequence background */}
      <canvas id="frameCanvas" ref={canvasRef} className="frame-sequence-canvas" />

      {/* Frame Loading Progress Overlay */}
      <div id="frameLoader" className={`frame-loader ${isLoaded ? 'loaded' : ''}`}>
        <div className="frame-loader-brand">
          <span className="accent-dot orange" />
          <span className="accent-dot teal" />
          <span className="accent-dot purple" />
          <span className="frame-loader-title">Chemtech Polymers</span>
        </div>
        <div className="frame-loader-text">Loading {loadProgress}%</div>
        <div className="frame-loader-bar">
          <div className="frame-loader-progress" style={{ width: `${loadProgress}%` }} />
        </div>
      </div>

      {/* ==========================================================================
          1. HERO SECTION WITH FULL-BLEED CANVAS FRAME SEQUENCE & DIRECT FLOATING TEXT
          ========================================================================== */}
      <section ref={heroRef} className="hero" style={{ backgroundColor: 'transparent' }}>
        {/* Localized left-side gradient overlay — text readability while leaving canvas visible */}
        <div className="hero-text-overlay" />

        {/* Hero Content floating directly over video with generous breathing room */}
        <div className="container" style={{ position: 'relative', zIndex: 3, width: '100%' }}>
          <div className="hero-content">
            {/* Badge with Logo 5-color accent dots */}
            <div
              className="badge-pill hero-badge-item"
              style={{
                marginBottom: '22px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                padding: '7px 18px',
              }}
            >
              <div className="dots-row">
                <span className="accent-dot orange" />
                <span className="accent-dot red" />
                <span className="accent-dot purple" />
                <span className="accent-dot teal" />
                <span className="accent-dot gold" />
              </div>
              <span style={{ color: '#FFFFFF', fontWeight: 600, letterSpacing: '0.04em' }}>
                Premier Textile Screen Printing Chemistry
              </span>
            </div>

            {/* Staggered Word Reveal Headline */}
            <h1
              className="hero-headline"
              style={{
                marginBottom: '24px',
                color: '#FFFFFF',
                letterSpacing: '-0.025em',
                lineHeight: 1.22,
                fontSize: 'clamp(1.95rem, 5.5vw, 3.4rem)',
                textShadow: '0 2px 14px rgba(0, 0, 0, 0.65)',
                fontWeight: 800,
              }}
            >
              {headlineWords.map((item, index) => (
                <span
                  key={index}
                  className="hero-word"
                  style={{
                    color: item.highlight ? '#60A5FA' : '#FFFFFF',
                    display: 'inline-block',
                    marginRight: '0.28em',
                  }}
                >
                  {item.text}
                </span>
              ))}
            </h1>

            {/* Subheadline */}
            <p
              className="hero-subheadline"
              style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
                color: 'rgba(255, 255, 255, 0.92)',
                lineHeight: 1.75,
                marginBottom: '36px',
                fontWeight: 400,
                textShadow: '0 1px 8px rgba(0, 0, 0, 0.6)',
                maxWidth: '580px',
              }}
            >
              Chemtech Polymers is an established manufacturer of high-grade textile screen printing formulations.
              Delivering intense pigmentation, commercial wash durability, and sustainable chemistry engineered
              for high-speed automatic presses.
            </p>

            {/* Dual CTA Buttons */}
            <div className="hero-cta-group">
              <Link
                to="/products"
                className="btn btn-primary btn-lg btn-shine"
                style={{
                  textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(43, 58, 143, 0.55)',
                }}
              >
                <span>Explore Products</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/contact"
                className="btn btn-lg"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  color: '#FFFFFF',
                  border: '1.5px solid rgba(255, 255, 255, 0.8)',
                  textDecoration: 'none',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.22)';
                  e.currentTarget.style.borderColor = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.8)';
                }}
              >
                <span>Request Sample Trials</span>
              </Link>
            </div>

            {/* Quality & Safety Trust Row */}
            <div
              className="hero-trust-row"
              style={{
                paddingTop: '24px',
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="var(--color-secondary-green)" style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#FFFFFF', textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
                  100% PVC & Phthalate Free
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="var(--color-secondary-green)" style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#FFFFFF', textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
                  High-Opacity Underbases
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="var(--color-secondary-green)" style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#FFFFFF', textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
                  Silky Soft Hand-Feel
                </span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ==========================================================================
          2. ENGINEERED INKS & ADDITIVES / COMPANY PROFILE TEASER
          ========================================================================== */}
      <section id="engineered-inks-additives" className="section canvas-zone-section" style={{ backgroundColor: 'transparent', paddingTop: '70px', paddingBottom: '80px' }}>
        <div className="container">
          <div style={{ maxWidth: '820px', margin: '0 auto 48px', textAlign: 'center' }}>
            <div className="badge-pill canvas-pill" style={{ marginBottom: '14px' }}>
              <span className="accent-dot teal" />
              <span>Engineered Inks & Additives</span>
            </div>
            <h2 className="canvas-heading" style={{ fontSize: '2.1rem', marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>
              Precision Chemistry Tailored for Textile Screen Printing
            </h2>
            <p className="canvas-text" style={{ fontSize: '1.05rem', lineHeight: 1.75, marginBottom: '24px' }}>
              With over three decades of polymer synthesis and dye dispersion experience, Chemtech Polymers formulates
              high-performance inks tailored to the exacting requirements of automatic screen presses and manual fashion print tables.
            </p>
            <Link to="/about" className="btn btn-outline btn-sm canvas-btn" style={{ textDecoration: 'none' }}>
              <span>Learn More About Our Facility & Standards</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          {/* Animated Stat Counters Bar */}
          <div className="stats-strip canvas-frosted-panel">
            <div style={{ textAlign: 'center' }}>
              <div className="stat-counter-number">
                <AnimatedCounter target={6} suffix="" />
              </div>
              <div className="stat-counter-label">
                Product Categories
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Formulated In-House
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div className="stat-counter-number">
                <AnimatedCounter target={40} suffix="+" />
              </div>
              <div className="stat-counter-label">
                Ink Variants
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Technical Inks & Additives
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div className="stat-counter-number">
                <AnimatedCounter target={25} suffix="+" />
              </div>
              <div className="stat-counter-label">
                Years of Trust
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Industry-Proven Heritage
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div className="stat-counter-number" style={{ color: 'var(--color-secondary-green)' }}>
                <AnimatedCounter target={100} suffix="%" />
              </div>
              <div className="stat-counter-label" style={{ color: 'var(--color-secondary-green)' }}>
                Eco-Friendly Badge
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                100% PVC & Phthalate-Free
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          3. WHY CHOOSE US (NEUTRAL BG #FAFAF9)
          ========================================================================== */}
      <WhyChooseUs />

      {/* ==========================================================================
          4. TRUST STRIP (SLIM HORIZONTAL BAND)
          ========================================================================== */}

      {/* ==========================================================================
          5. OUR PROCESS (HOW WE WORK)
          ========================================================================== */}
      <section id="our-process" className="section process-section canvas-zone-section" style={{ backgroundColor: 'transparent' }}>
        <div className="container">
          <div className="section-header" style={{ maxWidth: '780px', margin: '0 auto 48px', textAlign: 'center' }}>
            <div className="badge-pill canvas-pill" style={{ marginBottom: '14px' }}>
              <span className="accent-dot orange" />
              <span>Formulation Pipeline</span>
            </div>
            <h2 className="section-title canvas-heading" style={{ fontSize: '2.25rem' }}>
              Our Process: How We Engineer Inks
            </h2>
            <p className="section-subtitle canvas-text">
              From laboratory molecular design to high-shear production, every formulation undergoes a disciplined four-stage manufacturing lifecycle.
            </p>
          </div>

          {/* 4-Step Timeline */}
          <div ref={processRef} className="process-timeline-wrap">
            <div className="process-connecting-line" />
            <div className="process-steps-grid">
              {processSteps.map((step) => (
                <div key={step.step} className="process-step-card">
                  <div className="process-step-top">
                    <div
                      className="process-step-icon"
                      style={{
                        backgroundColor: step.accentBg,
                        color: step.accentColor,
                      }}
                    >
                      {step.icon}
                    </div>
                    <span
                      className="process-step-num"
                      style={{ color: step.accentColor }}
                    >
                      {step.step}
                    </span>
                  </div>

                  <h3 className="process-step-title">{step.title}</h3>
                  <p className="process-step-desc">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          6. INDUSTRIES WE SERVE
          ========================================================================== */}
      <section id="industries-we-serve" className="section canvas-zone-section" style={{ backgroundColor: 'transparent' }}>
        <div className="container">
          <div className="section-header" style={{ maxWidth: '800px', margin: '0 auto 52px', textAlign: 'center' }}>
            <div className="badge-pill canvas-pill" style={{ marginBottom: '14px' }}>
              <span className="accent-dot purple" />
              <span>Target Sectors</span>
            </div>
            <h2 className="section-title canvas-heading" style={{ fontSize: '2.25rem' }}>
              Industries We Serve
            </h2>
            <p className="section-subtitle canvas-text">
              Formulating performance textile chemistry tailored to the technical requirements of production print houses, fashion designers, and chemical distributors.
            </p>
          </div>

          <div ref={industriesRef} className="industries-grid">
            {industriesList.map((ind, idx) => (
              <div key={idx} className="industry-card">
                <div
                  className="industry-icon-box"
                  style={{
                    backgroundColor: ind.accentBg,
                    color: ind.accentColor,
                  }}
                >
                  {ind.icon}
                </div>
                <h3 className="industry-card-title">{ind.title}</h3>
                <p className="industry-card-desc">{ind.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================================================
          7. RESOURCES TEASER (APPLICATION GUIDES)
          ========================================================================== */}
      <section id="technical-knowledge-base" className="section canvas-zone-section" style={{ backgroundColor: 'transparent' }}>
        <div className="container">
          <div className="section-header">
            <div className="badge-pill canvas-pill">
              <span className="accent-dot blue" />
              <span>Technical Knowledge Base</span>
            </div>
            <h2 className="section-title canvas-heading">Application Guides & Best Practices</h2>
            <p className="section-subtitle canvas-text">
              Researched by Chemtech application chemists for factory technicians, master printers, and production managers.
            </p>
          </div>

          <div className="home-articles-grid">
            {articlesData.slice(0, 3).map((article) => (
              <Link
                key={article.slug}
                to={`/resources/${article.slug}`}
                className="guide-card"
                style={{ textDecoration: 'none' }}
              >
                <div className="guide-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div className="guide-category-badge" style={{ backgroundColor: `${article.badgeColor}18`, color: article.badgeColor }}>
                      <span>{article.category}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <Clock size={13} />
                      <span>{article.readTime}</span>
                    </div>
                  </div>

                  <h3 className="guide-card-title">{article.title}</h3>
                  <p className="guide-card-subtitle">{article.subtitle}</p>
                </div>

                <div className="guide-card-body">
                  <p className="guide-card-summary">{article.summary}</p>
                </div>

                <div className="guide-card-footer">
                  <div className="btn btn-outline btn-sm guide-read-btn canvas-btn">
                    <span>Read Technical Guide</span>
                    <ArrowRight size={15} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link
              to="/resources"
              className="btn btn-outline btn-md canvas-btn"
              style={{
                textDecoration: 'none',
              }}
            >
              <BookOpen size={16} />
              <span>View All 7 Application Guides</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          8. CLOSING CTA BANNER
          ========================================================================== */}
      <section
        className="section canvas-zone-section"
        style={{
          backgroundColor: 'transparent',
          color: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto' }}>
            <div
              className="badge-pill canvas-pill"
              style={{
                marginBottom: '18px',
              }}
            >
              <span className="accent-dot orange" />
              <span>Industrial Formulation Partner</span>
            </div>
            <h2 className="canvas-heading" style={{ fontSize: '2.4rem', color: '#FFFFFF', marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>
              Ready to Optimize Your Print House Runnability?
            </h2>
            <p className="canvas-text" style={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.92)', lineHeight: 1.7, marginBottom: '36px' }}>
              Request custom viscosity adjustments, technical sample batches, or an on-site dryer profile audit.
              Our technical formulation specialists are ready to support your production.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn btn-primary btn-lg btn-shine" style={{ textDecoration: 'none' }}>
                <span>Contact Sales & Sample Trials</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/products"
                className="btn btn-outline btn-lg"
                style={{
                  color: '#FFFFFF',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  textDecoration: 'none',
                }}
              >
                <span>Explore Products</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
