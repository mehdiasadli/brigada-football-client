import { Box, Container, rem } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { DashboardNavigation } from '../components/dashboard/dashboard-navigation';

export function DashboardLayout() {
  return (
    <Box
      style={{
        minHeight: '100vh',
        background: `
          linear-gradient(135deg, 
            var(--mantine-color-gray-1) 0%, 
            var(--mantine-color-blue-0) 50%, 
            var(--mantine-color-green-0) 100%
          )
        `,
        position: 'relative',
        paddingBottom: rem(80), // Space for fixed navigation
      }}
    >
      {/* Admin Pattern Background */}
      <Box
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e9ecef' fill-opacity='0.3'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm15 0c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
          `,
          backgroundSize: '120px 120px',
          zIndex: 0,
          opacity: 0.4,
        }}
      />

      {/* Content Container */}
      <Container size='xl' style={{ position: 'relative', zIndex: 1, paddingTop: rem(20) }}>
        <Outlet />
      </Container>

      {/* Fixed Bottom Navigation */}
      <DashboardNavigation />
    </Box>
  );
}
