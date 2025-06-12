import { useCallback, useEffect, useRef, useState } from 'react';
import { PWAUtils } from '../utils/pwa';

interface PullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  resistance?: number;
  enabled?: boolean;
}

interface PullToRefreshState {
  isPulling: boolean;
  pullDistance: number;
  isRefreshing: boolean;
  canRefresh: boolean;
}

export function usePullToRefresh(options: PullToRefreshOptions) {
  const { onRefresh, threshold = 80, resistance = 2.5, enabled = true } = options;
  const [state, setState] = useState<PullToRefreshState>({
    isPulling: false,
    pullDistance: 0,
    isRefreshing: false,
    canRefresh: false,
  });

  const touchStartY = useRef<number>(0);
  const touchCurrentY = useRef<number>(0);
  const isScrolledToTop = useRef<boolean>(true);

  const isPWA = () => PWAUtils.isPWA();

  // Check if user is at the top of the page
  const checkScrollPosition = useCallback(() => {
    isScrolledToTop.current = window.scrollY <= 0;
  }, []);

  // Handle touch start
  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!enabled || !isPWA() || state.isRefreshing) return;

      checkScrollPosition();
      if (isScrolledToTop.current) {
        touchStartY.current = e.touches[0].clientY;
      }
    },
    [enabled, state.isRefreshing, checkScrollPosition]
  );

  // Handle touch move
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!enabled || !isPWA() || state.isRefreshing || !isScrolledToTop.current) return;

      touchCurrentY.current = e.touches[0].clientY;
      const pullDistance = Math.max(0, (touchCurrentY.current - touchStartY.current) / resistance);

      if (pullDistance > 0) {
        // Prevent default scroll behavior when pulling down
        e.preventDefault();

        setState((prev) => ({
          ...prev,
          isPulling: true,
          pullDistance,
          canRefresh: pullDistance >= threshold,
        }));
      }
    },
    [enabled, resistance, threshold, state.isRefreshing]
  );

  // Handle touch end
  const handleTouchEnd = useCallback(async () => {
    if (!enabled || !isPWA() || state.isRefreshing) return;

    if (state.canRefresh && state.pullDistance >= threshold) {
      setState((prev) => ({
        ...prev,
        isRefreshing: true,
        isPulling: false,
      }));

      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setState((prev) => ({
          ...prev,
          isRefreshing: false,
          pullDistance: 0,
          canRefresh: false,
        }));
      }
    } else {
      setState((prev) => ({
        ...prev,
        isPulling: false,
        pullDistance: 0,
        canRefresh: false,
      }));
    }

    touchStartY.current = 0;
    touchCurrentY.current = 0;
  }, [enabled, onRefresh, state.canRefresh, state.isRefreshing, state.pullDistance, threshold]);

  // Add event listeners
  useEffect(() => {
    if (!enabled || !isPWA()) return;

    const options = { passive: false };

    document.addEventListener('touchstart', handleTouchStart, options);
    document.addEventListener('touchmove', handleTouchMove, options);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('scroll', checkScrollPosition);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('scroll', checkScrollPosition);
    };
  }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd, checkScrollPosition]);

  return {
    ...state,
    isPWA: isPWA(),
  };
}
