import { Group, Paper, Container, rem, Box } from '@mantine/core';
import HeaderUserMenu from './header-user-menu';
import HeaderNavbar from './header-navbar';
import HeaderSearchBar from './header-search';

export function Header() {
  return (
    <Paper
      shadow='md'
      radius={0}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'linear-gradient(135deg, var(--mantine-color-green-6) 0%, var(--mantine-color-teal-6) 100%)',
        borderBottom: '3px solid var(--mantine-color-green-4)',
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
            radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        }}
      />

      <Container size='xl' style={{ position: 'relative', zIndex: 1 }}>
        <Group justify='space-between' align='center' py='md' style={{ minHeight: rem(60) }}>
          {/* Left side - Navigation */}
          <HeaderNavbar />

          {/* Right side - Search + User Menu */}
          <Group gap='md' align='center'>
            {/* Center - Search Bar (Desktop) */}
            <Box
              hiddenFrom='lg'
              style={{
                flex: 1,
                maxWidth: rem(500),
                display: 'flex',
                justifyContent: 'center',
                paddingLeft: rem(20),
                paddingRight: rem(20),
              }}
            >
              <HeaderSearchBar />
            </Box>

            {/* Search Button for Mobile */}
            <Box visibleFrom='lg'>
              <HeaderSearchBar />
            </Box>

            {/* User Menu */}
            <HeaderUserMenu />
          </Group>
        </Group>
      </Container>
    </Paper>
  );
}
