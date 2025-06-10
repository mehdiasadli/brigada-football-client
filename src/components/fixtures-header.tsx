import { Button, Group, Stack, Title, ThemeIcon, Text, Paper, Box } from '@mantine/core';
import { IconPlus, IconCalendarEvent } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { useUserStore } from '../stores/user.store';
import { UserRole } from '../schemas/entities/user.entity';

export default function FixturesHeader() {
  const user = useUserStore((state) => state.user);
  const isNotUser = user?.role !== UserRole.enum.USER;

  return (
    <Paper
      shadow='lg'
      radius='xl'
      p='xl'
      style={{
        background: 'linear-gradient(135deg, var(--mantine-color-blue-6) 0%, var(--mantine-color-indigo-6) 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Soccer field pattern */}
      <Box
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '200px',
          height: '100px',
          background:
            "url(\"data:image/svg+xml,%3Csvg width='25' height='25' viewBox='0 0 25 25' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.1'%3E%3Crect x='10' y='10' width='5' height='5'/%3E%3C/g%3E%3C/svg%3E\")",
          opacity: 0.3,
        }}
      />

      <Group justify='space-between' align='center'>
        <Group align='center' gap='lg'>
          <ThemeIcon
            size={60}
            radius='xl'
            color='white'
            variant='white'
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          >
            <IconCalendarEvent size={30} />
          </ThemeIcon>

          <Stack gap={4}>
            <Title order={1} fw={900}>
              Match Fixtures
            </Title>
            <Text size='lg' opacity={0.9}>
              Upcoming matches and scheduled kick-offs
            </Text>
          </Stack>
        </Group>

        {isNotUser && (
          <Button
            variant='white'
            size='lg'
            radius='xl'
            leftSection={<IconPlus size={18} />}
            component={Link}
            to='/matches/create/fixture'
            style={{
              color: 'var(--mantine-color-blue-7)',
              fontWeight: 700,
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            Add Fixture
          </Button>
        )}
      </Group>
    </Paper>
  );
}
