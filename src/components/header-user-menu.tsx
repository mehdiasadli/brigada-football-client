import { IconLogout, IconUser, IconCrown } from '@tabler/icons-react';
import { Avatar, Menu, Group, Text, ThemeIcon, Divider, rem } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useLogout } from '../api/auth/auth.mutations';
import { useUserStore } from '../stores/user.store';
import { Link } from 'react-router-dom';

export default function HeaderUserMenu() {
  const logout = useLogout();
  const user = useUserStore((state) => state.user);

  const openLogoutModal = () => {
    modals.openConfirmModal({
      title: 'Logout Confirmation',
      children: 'Are you sure you want to logout? You will need to sign in again to access your account.',
      labels: {
        confirm: 'Logout',
        cancel: 'Stay Logged In',
      },
      confirmProps: {
        color: 'red',
        variant: 'filled',
        leftSection: <IconLogout size={16} />,
      },
      cancelProps: {
        variant: 'light',
      },
      zIndex: 10000,
      onConfirm: logout,
      radius: 'lg',
    });
  };

  return (
    <Menu
      shadow='xl'
      radius='lg'
      position='bottom-end'
      transitionProps={{ transition: 'pop-top-right' }}
      zIndex={10000}
    >
      <Menu.Target>
        <Group
          gap='xs'
          style={{
            cursor: 'pointer',
            padding: rem(8),
            borderRadius: rem(20),
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              transform: 'translateY(-1px)',
            },
          }}
        >
          <Avatar
            size='md'
            radius='xl'
            src={user?.avatar}
            style={{
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            }}
          >
            {user?.firstName?.[0]?.toUpperCase() || 'U'}
          </Avatar>

          {user && (
            <Group gap={4} visibleFrom='sm'>
              <Text size='sm' fw={600} c='white' style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>
                {user.firstName} {user.lastName}
              </Text>
              {user.role !== 'USER' && (
                <ThemeIcon size={16} radius='xl' color='yellow' variant='filled'>
                  <IconCrown size={10} />
                </ThemeIcon>
              )}
            </Group>
          )}
        </Group>
      </Menu.Target>

      <Menu.Dropdown style={{ minWidth: rem(240) }}>
        {/* User Info Header */}
        {user && (
          <>
            <Menu.Label>
              <Group gap='sm' align='center'>
                <Avatar size='sm' src={user.avatar} radius='xl'>
                  {user.firstName?.[0]?.toUpperCase()}
                </Avatar>
                <div>
                  <Text size='sm' fw={600}>
                    {user.firstName} {user.lastName}
                  </Text>
                  <Text size='xs' c='dimmed'>
                    @{user.username}
                  </Text>
                </div>
                {user.role !== 'USER' && (
                  <ThemeIcon size={20} radius='xl' color='yellow' variant='light'>
                    <IconCrown size={12} />
                  </ThemeIcon>
                )}
              </Group>
            </Menu.Label>
            <Divider my='xs' />
          </>
        )}

        {/* Menu Items */}
        <Menu.Item
          component={Link}
          to='/users'
          leftSection={
            <ThemeIcon size={20} radius='xl' color='blue' variant='light'>
              <IconUser size={12} />
            </ThemeIcon>
          }
        >
          <div>
            <Text size='sm' fw={500}>
              Profile
            </Text>
            <Text size='xs' c='dimmed'>
              View your profile
            </Text>
          </div>
        </Menu.Item>

        {/* <Menu.Item
          leftSection={
            <ThemeIcon size={20} radius='xl' color='gray' variant='light'>
              <IconSettings size={12} />
            </ThemeIcon>
          }
        >
          <div>
            <Text size='sm' fw={500}>
              Settings
            </Text>
            <Text size='xs' c='dimmed'>
              Account preferences
            </Text>
          </div>
        </Menu.Item> */}

        <Divider my='xs' />

        <Menu.Item
          color='red'
          leftSection={
            <ThemeIcon size={20} radius='xl' color='red' variant='light'>
              <IconLogout size={12} />
            </ThemeIcon>
          }
          onClick={openLogoutModal}
        >
          <div>
            <Text size='sm' fw={500}>
              Logout
            </Text>
            <Text size='xs' c='dimmed'>
              Sign out of your account
            </Text>
          </div>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
