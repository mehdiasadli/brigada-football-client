import { Paper, ThemeIcon, Text, Box, rem, Flex } from '@mantine/core';
import { IconDashboard, IconMapPin, IconShare, IconUsers } from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';

const dashboardLinks = [
  {
    label: 'Overview',
    to: '/dashboard',
    Icon: IconDashboard,
    color: 'blue',
  },
  {
    label: 'Venues',
    to: '/dashboard/venues',
    Icon: IconMapPin,
    color: 'green',
  },
  {
    label: 'Users',
    to: '/dashboard/users',
    Icon: IconUsers,
    color: 'indigo',
  },
  {
    label: 'Posts',
    to: '/dashboard/posts',
    Icon: IconShare,
    color: 'indigo',
  },
  // {
  //   label: 'Matches',
  //   to: '/dashboard/matches',
  //   Icon: IconBallFootball,
  //   color: 'orange',
  // },
];

export function DashboardNavigation() {
  const location = useLocation();

  return (
    <Box
      style={{
        position: 'fixed',
        bottom: rem(20),
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
      }}
    >
      <Paper
        shadow='xl'
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderTop: `3px solid var(--mantine-color-green-4)`,
          borderRadius: rem(16),
          backdropFilter: 'blur(10px)',
          padding: `${rem(3)} ${rem(5)}`,
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
        }}
      >
        <Flex gap={rem(8)} justify='center'>
          {dashboardLinks.map((link) => {
            const isActive = location.pathname === link.to;

            return (
              <Box
                key={link.label}
                component={Link}
                to={link.to}
                style={{
                  textDecoration: 'none',
                  padding: `${rem(10)} ${rem(16)}`,
                  borderRadius: rem(12),
                  backgroundColor: isActive ? 'var(--mantine-color-green-0)' : 'transparent',
                  border: isActive ? '2px solid var(--mantine-color-green-3)' : '2px solid transparent',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: rem(4),
                  minWidth: rem(80),
                  '&:hover': {
                    backgroundColor: isActive ? 'var(--mantine-color-green-0)' : 'var(--mantine-color-gray-0)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <ThemeIcon
                  size={28}
                  radius='xl'
                  color='green'
                  variant={isActive ? 'filled' : 'light'}
                  style={{
                    backgroundColor: isActive ? 'var(--mantine-color-green-6)' : 'var(--mantine-color-green-0)',
                    color: isActive ? 'white' : 'var(--mantine-color-green-7)',
                  }}
                >
                  <link.Icon size={16} />
                </ThemeIcon>

                <Text
                  size='xs'
                  fw={isActive ? 700 : 600}
                  c={isActive ? 'green.7' : 'gray.7'}
                  style={{
                    lineHeight: 1,
                    textAlign: 'center',
                  }}
                >
                  {link.label}
                </Text>
              </Box>
            );
          })}
        </Flex>
      </Paper>
    </Box>
  );
}
