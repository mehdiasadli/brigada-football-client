import { Group, Paper, Container, rem } from '@mantine/core';
import HeaderUserMenu from './header-user-menu';
import HeaderNavbar from './header-navbar';

export function Header() {
  return (
    <Paper
      shadow='md'
      radius={0}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 2,
        background: 'linear-gradient(135deg, var(--mantine-color-green-6) 0%, var(--mantine-color-teal-6) 100%)',
        borderBottom: '3px solid var(--mantine-color-green-4)',
      }}
    >
      <Container size='xl'>
        <Group justify='space-between' align='center' py='md' style={{ minHeight: rem(60) }}>
          {/* Navigation */}
          <HeaderNavbar />

          {/* User Menu */}
          <HeaderUserMenu />
        </Group>
      </Container>
    </Paper>
  );
}
