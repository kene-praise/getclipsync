
import { useState, useEffect } from 'react';

export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isWeb, setIsWeb] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      
      // Mobile: up to 768px
      setIsMobile(width <= 768);
      // Tablet: 769px to 1024px
      setIsTablet(width > 768 && width <= 1024);
      // Web: above 1024px
      setIsWeb(width > 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return { isMobile, isTablet, isWeb, screenWidth };
};
