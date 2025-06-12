import { Link, useLocation } from 'react-router-dom';
import { Group, Menu, ActionIcon, ThemeIcon, Text, Paper, rem } from '@mantine/core';
import { IconCalendar, IconTrophy, IconHome, IconMenu2, IconChartBar, IconDashboard } from '@tabler/icons-react';
import { UserRole } from '../schemas/entities/user.entity';
import { useUserStore } from '../stores/user.store';

const links = [
  {
    label: 'Home',
    to: '/',
    Icon: IconHome,
    color: 'blue',
    description: 'Dashboard & Overview',
  },
  {
    label: 'Fixtures',
    to: '/fixture',
    Icon: IconCalendar,
    color: 'indigo',
    description: 'Upcoming Matches',
  },
  {
    label: 'Results',
    to: '/results',
    Icon: IconTrophy,
    color: 'green',
    description: 'Match Results',
  },
  {
    label: 'Statistics',
    to: '/stats',
    Icon: IconChartBar,
    color: 'orange',
    description: 'Analytics & Stats',
  },
  {
    label: 'Dashboard',
    to: '/dashboard',
    Icon: IconDashboard,
    color: 'gray',
    description: 'Admin dashboard',
    roles: [UserRole.enum.ADMIN, UserRole.enum.SUPER_ADMIN],
  },
];

export default function HeaderNavbar() {
  const location = useLocation();
  const { user } = useUserStore()!;

  const showDashboard = user?.role === UserRole.enum.ADMIN || user?.role === UserRole.enum.SUPER_ADMIN;

  return (
    <>
      {/* Mobile Menu */}
      <Menu
        shadow='xl'
        radius='lg'
        position='bottom-end'
        transitionProps={{ transition: 'pop-top-right' }}
        zIndex={10000}
      >
        <Menu.Target>
          <ActionIcon
            radius='xl'
            size='lg'
            variant='white'
            color='green'
            hiddenFrom='sm'
            style={{
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            <IconMenu2 size={18} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown style={{ minWidth: rem(220) }}>
          <Menu.Label
            style={{
              fontSize: rem(12),
              fontWeight: 700,
              color: 'var(--mantine-color-gray-6)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Navigation
          </Menu.Label>

          {links
            .filter((link) => {
              if (!link.roles || link.roles.length === 0) return true;
              return showDashboard;
            })
            .map((link) => {
              const isActive = location.pathname === link.to;

              return (
                <Menu.Item
                  key={link.label}
                  component={Link}
                  to={link.to}
                  leftSection={
                    <ThemeIcon size={20} radius='xl' color={link.color} variant='light'>
                      <link.Icon size={12} />
                    </ThemeIcon>
                  }
                  style={{
                    backgroundColor: isActive ? `var(--mantine-color-${link.color}-0)` : 'transparent',
                    borderRadius: rem(8),
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  <div>
                    <Text size='sm' fw={600}>
                      {link.label}
                    </Text>
                    <Text size='xs' c='dimmed'>
                      {link.description}
                    </Text>
                  </div>
                </Menu.Item>
              );
            })}
        </Menu.Dropdown>
      </Menu>

      {/* Desktop Navigation */}
      <Group gap='xs' visibleFrom='sm'>
        {links
          .filter((link) => {
            if (!link.roles || link.roles.length === 0) return true;
            return showDashboard;
          })
          .map((link) => {
            const isActive = location.pathname === link.to;

            return (
              <Paper
                key={link.label}
                component={Link}
                to={link.to}
                radius='xl'
                p='sm'
                style={{
                  textDecoration: 'none',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  border: isActive ? '2px solid rgba(255, 255, 255, 0.3)' : '2px solid transparent',
                  transition: 'all 0.2s ease',
                  backdropFilter: isActive ? 'blur(10px)' : 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                <Group gap='xs' align='center'>
                  <ThemeIcon
                    size={28}
                    radius='xl'
                    color='white'
                    variant='white'
                    style={{
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                    }}
                  >
                    <link.Icon size={14} />
                  </ThemeIcon>

                  <Text
                    size='sm'
                    fw={isActive ? 700 : 600}
                    c='white'
                    style={{
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    {link.label}
                  </Text>
                </Group>
              </Paper>
            );
          })}
      </Group>
    </>
  );
}
