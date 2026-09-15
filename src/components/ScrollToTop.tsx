import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0, { immediate: true });
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
