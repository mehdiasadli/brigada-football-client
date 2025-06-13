import { Button, Group, Text, Box, ThemeIcon, rem } from '@mantine/core';
import { IconPlus, IconEdit, IconSparkles, IconBallFootball } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CreatePostButtonProps {
  onClick?: (() => void) | string;
  variant?: 'primary' | 'floating' | 'compact';
  disabled?: boolean;
}

export default function CreatePostButton({ onClick, variant = 'primary', disabled = false }: CreatePostButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  if (variant === 'floating') {
    return (
      <Box
        style={{
          position: 'fixed',
          bottom: rem(90), // Above navigation bar
          right: rem(20),
          zIndex: 999,
        }}
      >
        <Button
          size='lg'
          radius='xl'
          onClick={() => {
            if (typeof onClick === 'string') {
              navigate(onClick);
            } else {
              onClick?.();
            }
          }}
          disabled={disabled}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            background: 'linear-gradient(135deg, var(--mantine-color-green-6) 0%, var(--mantine-color-teal-6) 100%)',
            border: 'none',
            boxShadow: isHovered ? '0 8px 25px rgba(34, 197, 94, 0.4)' : '0 4px 15px rgba(34, 197, 94, 0.3)',
            transform: isHovered ? 'translateY(-2px) scale(1.05)' : 'translateY(0) scale(1)',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            overflow: 'hidden',
            position: 'relative',
          }}
          leftSection={
            <ThemeIcon
              size='sm'
              color='white'
              variant='transparent'
              style={{
                transform: isHovered ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
              }}
            >
              <IconPlus size={20} />
            </ThemeIcon>
          }
        >
          <Text size='sm' fw={600} c='white'>
            Post
          </Text>

          {/* Animated background shine */}
          <Box
            style={{
              position: 'absolute',
              top: 0,
              left: isHovered ? '100%' : '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              transition: 'left 0.6s ease',
              pointerEvents: 'none',
            }}
          />
        </Button>
      </Box>
    );
  }

  if (variant === 'compact') {
    return (
      <Button
        variant='light'
        color='green'
        size='sm'
        radius='lg'
        onClick={() => {
          if (typeof onClick === 'string') {
            navigate(onClick);
          } else {
            onClick?.();
          }
        }}
        disabled={disabled}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transition: 'all 0.2s ease',
          transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
        }}
        leftSection={
          <IconPlus
            size={16}
            style={{
              transform: isHovered ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          />
        }
      >
        New Post
      </Button>
    );
  }

  // Primary variant (default)
  return (
    <Box
      style={{
        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(20, 184, 166, 0.05) 100%)',
        borderRadius: rem(16),
        border: '1px solid rgba(34, 197, 94, 0.1)',
        padding: rem(16),
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background pattern */}
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(20, 184, 166, 0.1) 0%, transparent 50%)
          `,
          animation: isHovered ? 'pulse 2s ease-in-out infinite' : 'none',
          zIndex: 0,
        }}
      />

      <Group justify='space-between' align='center' style={{ position: 'relative', zIndex: 1 }}>
        <Group gap='md'>
          <ThemeIcon
            size='lg'
            radius='xl'
            variant='gradient'
            gradient={{ from: 'green.6', to: 'teal.6' }}
            style={{
              transform: isHovered ? 'rotate(5deg) scale(1.1)' : 'rotate(0deg) scale(1)',
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <IconEdit size={20} />
          </ThemeIcon>

          <Box>
            <Text size='lg' fw={700} c='gray.8'>
              Share Your Football Moment
            </Text>
            <Text size='sm' c='dimmed'>
              Tell your team about matches, goals, or soccer thoughts
            </Text>
          </Box>
        </Group>

        <Button
          size='md'
          radius='xl'
          onClick={() => {
            if (typeof onClick === 'string') {
              navigate(onClick);
            } else {
              onClick?.();
            }
          }}
          disabled={disabled}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            background: 'linear-gradient(135deg, var(--mantine-color-green-6) 0%, var(--mantine-color-teal-6) 100%)',
            border: 'none',
            boxShadow: isHovered ? '0 6px 20px rgba(34, 197, 94, 0.3)' : '0 3px 10px rgba(34, 197, 94, 0.2)',
            transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            position: 'relative',
            overflow: 'hidden',
          }}
          leftSection={
            <Box style={{ position: 'relative' }}>
              <IconPlus
                size={18}
                style={{
                  transform: isHovered ? 'rotate(90deg) scale(1.1)' : 'rotate(0deg) scale(1)',
                  transition: 'transform 0.3s ease',
                }}
              />
              {isHovered && (
                <IconSparkles
                  size={12}
                  style={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    animation: 'sparkle 1s ease-in-out infinite',
                  }}
                />
              )}
            </Box>
          }
        >
          <Text size='sm' fw={600} c='white'>
            Create Post
          </Text>

          {/* Animated shine effect */}
          <Box
            style={{
              position: 'absolute',
              top: 0,
              left: isHovered ? '100%' : '-100%',
              width: '50%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              transition: 'left 0.6s ease',
              pointerEvents: 'none',
              transform: 'skewX(-20deg)',
            }}
          />
        </Button>
      </Group>

      {/* Floating soccer ball animation */}
      {isHovered && (
        <Box
          style={{
            position: 'absolute',
            top: rem(10),
            right: rem(10),
            width: rem(20),
            height: rem(20),
            borderRadius: '50%',
            // background: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
            animation: 'float 3s ease-in-out infinite',
            zIndex: 0,
            opacity: 0.1,
          }}
        >
          <IconBallFootball />
        </Box>
      )}

      <style>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes sparkle {
          0%,
          100% {
            opacity: 0;
            transform: scale(0.8) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.2) rotate(180deg);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-10px) rotate(90deg);
          }
          50% {
            transform: translateY(-5px) rotate(180deg);
          }
          75% {
            transform: translateY(-15px) rotate(270deg);
          }
        }
      `}</style>
    </Box>
  );
}
