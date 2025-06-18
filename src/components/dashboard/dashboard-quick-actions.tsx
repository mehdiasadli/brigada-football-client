import { Card, ThemeIcon, Group, Paper, Stack, Text } from '@mantine/core';
import { IconBallFootball, IconChevronRight, IconMapPin, IconShare, IconTrophy } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

export default function DashboardQuickActions() {
  const quickActions = [
    { label: 'Add Venue', icon: IconMapPin, color: 'green', path: '/dashboard/venues/add' },
    { label: 'Add Post', icon: IconShare, color: 'blue', path: '/posts/create' },
    { label: 'Add Fixture', icon: IconBallFootball, color: 'green', path: '/matches/create/fixture' },
    { label: 'Add Resulted Match', icon: IconTrophy, color: 'blue', path: '/matches/create/result' },
  ];

  return (
    <Card shadow='sm' padding='lg' radius='md' h='100%'>
      <Text size='lg' fw={600} mb='lg'>
        Quick Actions
      </Text>
      <Stack gap='sm'>
        {quickActions.map((action) => (
          <Paper
            component={Link}
            to={action.path}
            key={action.label}
            p='sm'
            radius='md'
            style={{
              cursor: 'pointer',
              border: '1px solid var(--mantine-color-gray-2)',
              transition: 'all 0.2s ease',
              color: 'inherit',
              '&:hover': {
                backgroundColor: 'var(--mantine-color-gray-0)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            <Group justify='space-between'>
              <Group gap='sm'>
                <ThemeIcon color={action.color} variant='light' size='md'>
                  <action.icon size={16} />
                </ThemeIcon>
                <Text size='sm' fw={500}>
                  {action.label}
                </Text>
              </Group>
              <IconChevronRight size={16} color='var(--mantine-color-gray-5)' />
            </Group>
          </Paper>
        ))}
      </Stack>
    </Card>
  );
}
