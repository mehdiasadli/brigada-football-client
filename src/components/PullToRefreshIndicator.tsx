import { Box, Text, Loader, ThemeIcon, Transition } from '@mantine/core';
import { IconArrowDown, IconRefresh } from '@tabler/icons-react';

interface PullToRefreshIndicatorProps {
  isPulling: boolean;
  pullDistance: number;
  isRefreshing: boolean;
  canRefresh: boolean;
  threshold?: number;
}

export default function PullToRefreshIndicator({
  isPulling,
  pullDistance,
  isRefreshing,
  canRefresh,
  threshold = 80,
}: PullToRefreshIndicatorProps) {
  const progress = Math.min(pullDistance / threshold, 1);
  const rotation = progress * 180;

  if (!isPulling && !isRefreshing) return null;

  return (
    <Transition mounted={isPulling || isRefreshing} transition='slide-down' duration={200} timingFunction='ease-out'>
      {(styles) => (
        <Box
          style={{
            ...styles,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            height: Math.min(pullDistance, 100),
            background: 'linear-gradient(135deg, var(--mantine-color-green-6) 0%, var(--mantine-color-teal-6) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '8px',
            paddingTop: 'env(safe-area-inset-top)',
            transition: isRefreshing ? 'height 0.3s ease' : 'none',
          }}
        >
          {isRefreshing ? (
            <>
              <Loader size='sm' color='white' />
              <Text size='xs' c='white' fw={600}>
                Refreshing...
              </Text>
            </>
          ) : (
            <>
              <ThemeIcon
                size='md'
                color='white'
                variant='transparent'
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: 'transform 0.1s ease-out',
                }}
              >
                {canRefresh ? <IconRefresh size={18} /> : <IconArrowDown size={18} />}
              </ThemeIcon>

              <Text size='xs' c='white' fw={600}>
                {canRefresh ? 'Release to refresh' : 'Pull to refresh'}
              </Text>

              {/* Progress bar */}
              <Box
                style={{
                  width: '40px',
                  height: '2px',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: '1px',
                  overflow: 'hidden',
                }}
              >
                <Box
                  style={{
                    width: `${progress * 100}%`,
                    height: '100%',
                    backgroundColor: 'white',
                    transition: 'width 0.1s ease-out',
                  }}
                />
              </Box>
            </>
          )}
        </Box>
      )}
    </Transition>
  );
}
