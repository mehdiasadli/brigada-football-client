import { Button, Group, Stack, Title, ThemeIcon, Text, Paper, Box } from '@mantine/core';
import { IconPlus, IconTrophy } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { useUserStore } from '../stores/user.store';
import { UserRole } from '../schemas/entities/user.entity';

export default function ResultsHeader() {
  const user = useUserStore((state) => state.user);
  const isNotUser = user?.role !== UserRole.enum.USER;

  return (
    <Paper
      shadow='lg'
      radius='xl'
      p='xl'
      style={{
        background: 'linear-gradient(135deg, var(--mantine-color-green-6) 0%, var(--mantine-color-teal-6) 100%)',
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
            "url(\"data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.1'%3E%3Ccircle cx='15' cy='15' r='2'/%3E%3C/g%3E%3C/svg%3E\")",
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
            <IconTrophy size={30} />
          </ThemeIcon>

          <Stack gap={4}>
            <Title order={1} fw={900}>
              Match Results
            </Title>
            <Text size='lg' opacity={0.9}>
              Completed matches and final scores
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
            to='/matches/create/result'
            style={{
              color: 'var(--mantine-color-green-7)',
              fontWeight: 700,
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            Add Result
          </Button>
        )}
      </Group>
    </Paper>
  );
}
