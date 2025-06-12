import { useEffect, useState } from 'react';
import { PWAUtils } from '../utils/pwa';

export function usePWADetection() {
  const [isPWA, setIsPWA] = useState(PWAUtils.isPWA());
  const [displayMode, setDisplayMode] = useState(PWAUtils.getDisplayMode());

  useEffect(() => {
    // Add PWA classes on mount
    PWAUtils.addPWAClasses();

    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = () => {
      setIsPWA(PWAUtils.isPWA());
      setDisplayMode(PWAUtils.getDisplayMode());
      PWAUtils.addPWAClasses();
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return {
    isPWA,
    displayMode,
    isIOS: PWAUtils.isIOS(),
    isAndroid: PWAUtils.isAndroid(),
    supportsPWA: PWAUtils.supportsPWA(),
    isTouchDevice: PWAUtils.isTouchDevice(),
    safeAreaInsets: PWAUtils.getSafeAreaInsets(),
    showInstallPrompt: PWAUtils.showInstallPrompt,
  };
}
