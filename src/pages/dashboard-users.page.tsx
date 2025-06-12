import { Box, Group, Paper, rem, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { useUsers } from '../api/users/users.queries';
import InfiniteList from '../components/infinite-list';
import { UserCard } from '../components/user-card';
import { IconMapPin } from '@tabler/icons-react';
import { useDashboardStats } from '../api/dashboard/dashboard.queries';

export default function DashboardUsersPage() {
  const result = useUsers(
    {
      limit: 10,
    },
    {
      orderBy: 'createdAt',
      orderDir: 'desc',
    },
    {
      query: '',
      mode: 'insensitive',
      searchType: 'contains',
      fields: ['username', 'email', 'firstName', 'lastName'],
    },
    true
  );
  const { data: stats } = useDashboardStats();

  return (
    <Stack gap='xl'>
      {/* Header */}
      <Group justify='space-between' align='center'>
        <Box>
          <Title
            order={1}
            size='h2'
            style={{
              background: 'linear-gradient(135deg, var(--mantine-color-green-6), var(--mantine-color-teal-6))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            User Management
          </Title>
          <Text c='dimmed' size='md' mt={rem(4)}>
            Manage users and their roles
          </Text>
        </Box>
      </Group>

      {/* Summary Stats */}
      <SimpleGrid cols={{ base: 2, md: 4 }} spacing='md'>
        <Paper p='md' radius='md' style={{ border: '1px solid var(--mantine-color-gray-2)' }}>
          <Group gap='xs'>
            <ThemeIcon color='blue' variant='light' size='sm'>
              <IconMapPin size={14} />
            </ThemeIcon>
            <Box>
              <Text size='xl' fw={700} c='blue'>
                {stats?.data.usersStats.totalUsers ?? 0}
              </Text>
              <Text size='xs' c='dimmed'>
                Total Users
              </Text>
            </Box>
          </Group>
        </Paper>
      </SimpleGrid>

      {/* Venues Grid */}
      <InfiniteList
        result={result}
        render={(user) => <UserCard user={user} />}
        cols={{ base: 1, xs: 1, sm: 2, md: 2, lg: 3, xl: 3 }}
      />

      {/* Empty State */}
      {/* {filteredVenues.length === 0 && (
      <Paper p='xl' radius='md' ta='center' style={{ border: '2px dashed var(--mantine-color-gray-3)' }}>
        <ThemeIcon size='xl' color='gray' variant='light' mx='auto' mb='md'>
          <IconMapPin size={32} />
        </ThemeIcon>
        <Text size='lg' fw={600} mb='xs'>
          No venues found
        </Text>
        <Text size='sm' c='dimmed' mb='lg'>
          {searchTerm || filterType || filterStatus
            ? 'Try adjusting your filters to see more venues.'
            : 'Get started by adding your first venue.'}
        </Text>
        <Button leftSection={<IconPlus size={16} />} color='green'>
          Add New Venue
        </Button>
      </Paper>
    )} */}
    </Stack>
  );
}
