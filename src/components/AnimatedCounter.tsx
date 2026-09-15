import React, { useState, useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  target,
  suffix = '',
  prefix = '',
  duration = 1600,
  decimals = 0,
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCount(target);
      return;
    }

    const startAnimation = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      const startTime = performance.now();
      const step = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutQuad
        const ease = 1 - (1 - progress) * (1 - progress);
        const currentVal = ease * target;
        setCount(currentVal);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setCount(target);
        }
      };
      requestAnimationFrame(step);
    };

    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              startAnimation();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -30px 0px' }
      );
      observer.observe(el);
      return () => observer.disconnect();
    } else {
      startAnimation();
    }
  }, [target, duration]);

  return (
    <span ref={ref} className="stat-counter-val">
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
};
