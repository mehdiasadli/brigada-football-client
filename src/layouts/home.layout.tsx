import { Outlet } from 'react-router-dom';
import { Header } from '../components/header';
import { Box, rem } from '@mantine/core';

export default function HomeLayout() {
  return (
    <Box
      style={{
        minHeight: '100vh',
        background: `
          linear-gradient(180deg, 
            var(--mantine-color-gray-0) 0%, 
            var(--mantine-color-gray-1) 50%,
            var(--mantine-color-gray-0) 100%
          )
        `,
        position: 'relative',
      }}
    >
      {/* Soccer Field Background Pattern */}
      <Box
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, var(--mantine-color-green-0) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, var(--mantine-color-blue-0) 0%, transparent 50%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
          `,
          zIndex: -1,
          opacity: 0.5,
        }}
      />

      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <Box
        style={{
          position: 'relative',
          zIndex: 1,
          paddingTop: rem(20),
          paddingBottom: rem(80),
          minHeight: `calc(100vh - 80px)`, // Account for header height
        }}
      >
        <Outlet />
      </Box>

      {/* Footer Pattern */}
      <Box
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: rem(4),
          background:
            'linear-gradient(90deg, var(--mantine-color-green-5) 0%, var(--mantine-color-teal-5) 50%, var(--mantine-color-blue-5) 100%)',
          zIndex: 1000,
        }}
      />
    </Box>
  );
}

// Alternative Enhanced Layout (if you want more sophisticated styling)
export function EnhancedHomeLayout() {
  return (
    <Box
      style={{
        minHeight: '100vh',
        background: `
          conic-gradient(from 180deg at 50% 50%, 
            var(--mantine-color-gray-0) 0deg,
            var(--mantine-color-green-0) 120deg,
            var(--mantine-color-blue-0) 240deg,
            var(--mantine-color-gray-0) 360deg
          )
        `,
        position: 'relative',
      }}
    >
      {/* Animated Soccer Field Lines */}
      <Box
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(90deg, transparent 49%, var(--mantine-color-gray-3) 50%, transparent 51%),
            linear-gradient(0deg, transparent 49%, var(--mantine-color-gray-3) 50%, transparent 51%),
            url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23d1d5db' stroke-width='1' stroke-opacity='0.1'%3E%3Ccircle cx='50' cy='50' r='20'/%3E%3Cpath d='M50 0v100M0 50h100'/%3E%3C/g%3E%3C/svg%3E")
          `,
          backgroundSize: '100px 100px, 100px 100px, 200px 200px',
          zIndex: -1,
          opacity: 0.3,
        }}
      />

      {/* Stadium Lighting Effect */}
      <Box
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(ellipse at top, transparent 0%, rgba(0,0,0,0.02) 100%),
            radial-gradient(ellipse at bottom, transparent 0%, rgba(0,0,0,0.02) 100%)
          `,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <Header />

      {/* Main Content with Stadium Container */}
      <Box
        style={{
          position: 'relative',
          zIndex: 1,
          paddingTop: rem(30),
          paddingBottom: rem(100),
          minHeight: `calc(100vh - 80px)`,
        }}
      >
        {/* Content Container with Stadium Border */}
        <Box
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: `0 ${rem(20)}`,
            position: 'relative',
          }}
        >
          {/* Stadium Corner Accents */}
          <Box
            style={{
              position: 'absolute',
              top: rem(-10),
              left: rem(10),
              width: rem(30),
              height: rem(30),
              background: 'linear-gradient(135deg, var(--mantine-color-green-4) 0%, var(--mantine-color-teal-4) 100%)',
              borderRadius: '0 0 100% 0',
              opacity: 0.1,
              zIndex: -1,
            }}
          />

          <Box
            style={{
              position: 'absolute',
              top: rem(-10),
              right: rem(10),
              width: rem(30),
              height: rem(30),
              background: 'linear-gradient(135deg, var(--mantine-color-blue-4) 0%, var(--mantine-color-indigo-4) 100%)',
              borderRadius: '0 0 0 100%',
              opacity: 0.1,
              zIndex: -1,
            }}
          />

          <Outlet />
        </Box>
      </Box>

      {/* Stadium Floor Stripe */}
      <Box
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: rem(6),
          background: `
            linear-gradient(90deg, 
              var(--mantine-color-green-6) 0%, 
              var(--mantine-color-teal-6) 25%,
              var(--mantine-color-blue-6) 50%,
              var(--mantine-color-indigo-6) 75%,
              var(--mantine-color-green-6) 100%
            )
          `,
          boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
        }}
      />
    </Box>
  );
}
