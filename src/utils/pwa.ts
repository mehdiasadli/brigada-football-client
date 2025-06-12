/* eslint-disable @typescript-eslint/no-explicit-any */

export const PWAUtils = {
  /**
   * Check if the app is running as a PWA (installed on home screen)
   */
  isPWA() {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;
    const isAndroidTWA = document.referrer.includes('android-app://');
    const isSamsungPWA = window.matchMedia('(display-mode: minimal-ui)').matches;

    return isStandalone || isIOSStandalone || isAndroidTWA || isSamsungPWA;
  },
  /**
   * Check if running on iOS
   */
  isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  },
  /**
   * Check if running on Android
   */
  isAndroid() {
    return /Android/.test(navigator.userAgent);
  },
  /**
   * Check if running on iOS Safari (not PWA)
   */
  isIOSSafari() {
    return this.isIOS() && !this.isPWA();
  },
  /**
   * Check if browser supports PWA features
   */
  supportsPWA(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  },
  /**
   * Get the current display mode
   */
  getDisplayMode(): string {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return 'standalone';
    }
    if (window.matchMedia('(display-mode: minimal-ui)').matches) {
      return 'minimal-ui';
    }
    if (window.matchMedia('(display-mode: fullscreen)').matches) {
      return 'fullscreen';
    }
    return 'browser';
  },
  /**
   * Check if device supports touch
   */
  isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },
  /**
   * Get safe area insets for devices with notches
   */
  getSafeAreaInsets(): {
    top: string;
    bottom: string;
    left: string;
    right: string;
  } {
    const style = getComputedStyle(document.documentElement);
    return {
      top: style.getPropertyValue('env(safe-area-inset-top)') || '0px',
      bottom: style.getPropertyValue('env(safe-area-inset-bottom)') || '0px',
      left: style.getPropertyValue('env(safe-area-inset-left)') || '0px',
      right: style.getPropertyValue('env(safe-area-inset-right)') || '0px',
    };
  },
  /**
   * Add CSS class based on PWA status
   */
  addPWAClasses(): void {
    const html = document.documentElement;

    if (this.isPWA()) {
      html.classList.add('is-pwa');
    } else {
      html.classList.add('is-browser');
    }

    if (this.isIOS()) {
      html.classList.add('is-ios');
    }

    if (this.isAndroid()) {
      html.classList.add('is-android');
    }

    html.classList.add(`display-mode-${this.getDisplayMode()}`);
  },

  /**
   * Show install prompt if available
   */
  async showInstallPrompt(): Promise<boolean> {
    // This requires the beforeinstallprompt event to be captured
    const deferredPrompt = (window as any).deferredPrompt;

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      (window as any).deferredPrompt = null;
      return outcome === 'accepted';
    }

    return false;
  },
};
