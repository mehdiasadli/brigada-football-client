import { Card, Group, Progress, SimpleGrid, ThemeIcon } from '@mantine/core';
import { useDashboardStats } from '../../api/dashboard/dashboard.queries';
import { Text } from '@mantine/core';
import { IconBallFootball, IconMapPin, IconMessageCircle, IconTrendingUp, IconUsers } from '@tabler/icons-react';
import ErrorComponent from '../error-component';
import LoadingComponent from '../loading-component';

export function DashboardStats() {
  const { data: stats, error: statsError } = useDashboardStats();

  if (statsError) {
    return <ErrorComponent error={statsError} />;
  }

  if (!stats || !stats.data) {
    return <LoadingComponent />;
  }

  const userGrowth = (
    stats.data.usersStats.usersInLastMonth === 0
      ? 100
      : (stats.data.usersStats.usersInThisMonth / stats.data.usersStats.usersInLastMonth) * 100
  ).toFixed(2);
  const venuesActivityRate = (
    stats.data.venuesStats.totalVenues === 0
      ? 0
      : (stats.data.venuesStats.activeVenues / stats.data.venuesStats.totalVenues) * 100
  ).toFixed(2);
  const matchesGrowth = (
    stats.data.matchesStats.completedMatchesInLastMonth === 0
      ? 100
      : stats.data.matchesStats.completedMatchesInThisMonth / stats.data.matchesStats.completedMatchesInLastMonth
  ).toFixed(2);
  const postsGrowth = (
    stats.data.postsStats.postsInLastMonth === 0
      ? 100
      : (stats.data.postsStats.postsInThisMonth / stats.data.postsStats.postsInLastMonth) * 100
  ).toFixed(2);

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing='lg'>
      <Card shadow='sm' padding='lg' radius='md' style={{ border: '1px solid var(--mantine-color-gray-2)' }}>
        <Group justify='space-between' mb='xs'>
          <Text size='sm' c='dimmed' fw={600}>
            Total Users
          </Text>
          <ThemeIcon color='blue' variant='light' size='sm'>
            <IconUsers size={16} />
          </ThemeIcon>
        </Group>
        <Text size='xl' fw={700} c='blue'>
          {stats.data.usersStats.totalUsers.toLocaleString()}
        </Text>
        <Group gap='xs' mt='xs'>
          <IconTrendingUp size={14} color='var(--mantine-color-green-6)' />
          <Text size='xs' c='green' fw={600}>
            +{userGrowth}%
          </Text>
          <Text size='xs' c='dimmed'>
            this month
          </Text>
        </Group>
      </Card>

      <Card shadow='sm' padding='lg' radius='md' style={{ border: '1px solid var(--mantine-color-gray-2)' }}>
        <Group justify='space-between' mb='xs'>
          <Text size='sm' c='dimmed' fw={600}>
            Total Venues
          </Text>
          <ThemeIcon color='green' variant='light' size='sm'>
            <IconMapPin size={16} />
          </ThemeIcon>
        </Group>
        <Text size='xl' fw={700} c='green'>
          {stats.data.venuesStats.totalVenues.toLocaleString()}
        </Text>
        <Progress value={Number(venuesActivityRate)} color='green' size='sm' mt='xs' radius='xl' />
        <Text size='xs' c='dimmed' mt='xs'>
          {venuesActivityRate}% activity rate
        </Text>
      </Card>

      <Card shadow='sm' padding='lg' radius='md' style={{ border: '1px solid var(--mantine-color-gray-2)' }}>
        <Group justify='space-between' mb='xs'>
          <Text size='sm' c='dimmed' fw={600}>
            Total Matches
          </Text>
          <ThemeIcon color='orange' variant='light' size='sm'>
            <IconBallFootball size={16} />
          </ThemeIcon>
        </Group>
        <Text size='xl' fw={700} c='orange'>
          {stats.data.matchesStats.totalMatches.toLocaleString()}
        </Text>
        <Group gap='xs' mt='xs'>
          <IconTrendingUp size={14} color='var(--mantine-color-green-6)' />
          <Text size='xs' c='green' fw={600}>
            +{matchesGrowth}%
          </Text>
          <Text size='xs' c='dimmed'>
            this month
          </Text>
        </Group>
      </Card>

      <Card shadow='sm' padding='lg' radius='md' style={{ border: '1px solid var(--mantine-color-gray-2)' }}>
        <Group justify='space-between' mb='xs'>
          <Text size='sm' c='dimmed' fw={600}>
            Total Posts
          </Text>
          <ThemeIcon color='red' variant='light' size='sm'>
            <IconMessageCircle size={16} />
          </ThemeIcon>
        </Group>
        <Text size='xl' fw={700} c='red'>
          {stats.data.postsStats.totalPosts.toLocaleString()}
        </Text>
        <Group gap='xs' mt='xs'>
          <IconTrendingUp size={14} color='var(--mantine-color-green-6)' />
          <Text size='xs' c='green' fw={600}>
            +{postsGrowth}%
          </Text>
          <Text size='xs' c='dimmed'>
            this month
          </Text>
        </Group>
      </Card>
    </SimpleGrid>
  );
}
