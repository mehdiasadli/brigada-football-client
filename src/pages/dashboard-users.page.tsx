import { Box, Group, Loader, Paper, rem, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { useUsers } from '../api/users/users.queries';
import InfiniteList from '../components/infinite-list';
import { UserCard } from '../components/user-card';
import { IconUsers } from '@tabler/icons-react';
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
  const { data: stats, status } = useDashboardStats();

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
              <IconUsers size={14} />
            </ThemeIcon>
            <Box>
              {status === 'pending' ? (
                <Loader size='xs' mb={10} ml={2} color='blue' type='dots' />
              ) : (
                <Text size='xl' fw={700} c='blue'>
                  {stats?.data.usersStats.totalUsers ?? 0}
                </Text>
              )}
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
    </Stack>
  );
}
