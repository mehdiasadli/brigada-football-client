import { Box, Center, rem } from '@mantine/core';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <Box
      style={{
        minHeight: '100vh',
        background: `
          linear-gradient(135deg, 
            var(--mantine-color-green-6) 0%, 
            var(--mantine-color-teal-6) 50%,
            var(--mantine-color-blue-6) 100%
          )
        `,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Stadium Background Pattern */}
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='white' stroke-width='1' stroke-opacity='0.1'%3E%3Ccircle cx='40' cy='40' r='20'/%3E%3Cpath d='M40 0v80M0 40h80'/%3E%3Cpath d='M20 20l40 40M60 20l-40 40'/%3E%3C/g%3E%3C/svg%3E"),
            radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)
          `,
          backgroundSize: '200px 200px, 400px 400px, 400px 400px',
          opacity: 0.3,
        }}
      />

      {/* Stadium Floodlights */}
      <Box
        style={{
          position: 'absolute',
          top: rem(-50),
          left: rem(100),
          width: rem(100),
          height: rem(100),
          background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(20px)',
        }}
      />

      <Box
        style={{
          position: 'absolute',
          top: rem(-50),
          right: rem(100),
          width: rem(100),
          height: rem(100),
          background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(20px)',
        }}
      />

      {/* Content Center */}
      <Center
        style={{
          minHeight: '100vh',
          padding: rem(20),
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Outlet />
      </Center>

      {/* Stadium Floor Stripe */}
      <Box
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: rem(6),
          background: `
            linear-gradient(90deg, 
              rgba(255,255,255,0.3) 0%, 
              rgba(255,255,255,0.1) 50%,
              rgba(255,255,255,0.3) 100%
            )
          `,
          backdropFilter: 'blur(10px)',
        }}
      />
    </Box>
  );
}
