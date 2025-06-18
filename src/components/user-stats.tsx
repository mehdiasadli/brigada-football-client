import { Paper, ThemeIcon, Title, Stack, Text, Group, SimpleGrid, Badge, Space } from '@mantine/core';
import { useUserStats } from '../api/stats/stats.queries';
import LoadingComponent from './loading-component';
import {
  IconAward,
  IconBallFootball,
  IconChartBar,
  IconHandGrab,
  IconHeart,
  IconMessageCircle,
  IconShare,
  IconStars,
  IconTarget,
  IconTrophy,
  IconUsers,
} from '@tabler/icons-react';

interface UserStatsProps {
  userId: string;
}

export default function UserPerformanceStats({ userId }: UserStatsProps) {
  const { data: userStats, status: userStatsStatus } = useUserStats(userId);

  if (userStatsStatus === 'pending') {
    return (
      <Paper p='xl' radius='xl' style={{ textAlign: 'center' }}>
        <LoadingComponent />
      </Paper>
    );
  }

  if (!userStats || !userStats.data) {
    return (
      <Paper
        p='xl'
        radius='xl'
        style={{
          textAlign: 'center',
          background: 'linear-gradient(135deg, var(--mantine-color-gray-0) 0%, white 100%)',
          border: '2px solid var(--mantine-color-gray-2)',
        }}
      >
        <Stack align='center' gap='md'>
          <ThemeIcon size={60} radius='xl' color='gray' variant='light'>
            <IconChartBar size={30} />
          </ThemeIcon>
          <Title order={4} c='gray.7'>
            No Statistics Available
          </Title>
        </Stack>
      </Paper>
    );
  }

  const getPerformanceLevel = (rating: number) => {
    if (rating >= 9) return { label: 'World Class', color: 'red' };
    if (rating >= 8) return { label: 'Excellent', color: 'orange' };
    if (rating >= 7) return { label: 'Very Good', color: 'yellow' };
    if (rating >= 6) return { label: 'Good', color: 'green' };
    if (rating >= 5) return { label: 'Average', color: 'blue' };
    return { label: 'Developing', color: 'gray' };
  };

  const stats = userStats.data;

  return (
    <Stack gap='lg'>
      {/* Social Statistics */}
      <Group align='center' gap='sm'>
        <ThemeIcon size={32} radius='xl' color='green' variant='light'>
          <IconUsers size={18} />
        </ThemeIcon>
        <Title order={3} fw={700} c='gray.8'>
          Social Statistics
        </Title>
      </Group>

      <SimpleGrid cols={{ base: 2, sm: 4 }} spacing='lg'>
        {/* Posts */}
        <Paper
          p='lg'
          radius='xl'
          withBorder
          style={{
            background: 'linear-gradient(135deg, var(--mantine-color-teal-0) 0%, white 100%)',
            border: '2px solid var(--mantine-color-teal-2)',
            textAlign: 'center',
          }}
        >
          <Stack align='center' gap='sm'>
            <ThemeIcon size={48} radius='xl' color='teal' variant='light'>
              <IconShare size={24} />
            </ThemeIcon>
            <Text size='xl' fw={900} c='teal.8'>
              {stats.totalPosts ?? 0}
            </Text>
            <Text size='sm' fw={600} c='gray.7' tt='uppercase'>
              Posts
            </Text>
          </Stack>
        </Paper>

        {/* Comments */}
        <Paper
          p='lg'
          radius='xl'
          withBorder
          style={{
            background: 'linear-gradient(135deg, var(--mantine-color-indigo-0) 0%, white 100%)',
            border: '2px solid var(--mantine-color-indigo-2)',
            textAlign: 'center',
          }}
        >
          <Stack align='center' gap='sm'>
            <ThemeIcon size={48} radius='xl' color='indigo' variant='light'>
              <IconMessageCircle size={24} />
            </ThemeIcon>
            <Text size='xl' fw={900} c='indigo.8'>
              {stats.totalComments ?? 0}
            </Text>
            <Text size='sm' fw={600} c='gray.7' tt='uppercase'>
              Comments
            </Text>
          </Stack>
        </Paper>

        {/* Likes */}
        <Paper
          p='lg'
          radius='xl'
          withBorder
          style={{
            background: 'linear-gradient(135deg, var(--mantine-color-pink-0) 0%, white 100%)',
            border: '2px solid var(--mantine-color-pink-2)',
            textAlign: 'center',
          }}
        >
          <Stack align='center' gap='sm'>
            <ThemeIcon size={48} radius='xl' color='pink' variant='light'>
              <IconHeart size={24} />
            </ThemeIcon>
            <Text size='xl' fw={900} c='pink.8'>
              {stats.totalLikes ?? 0}
            </Text>
            <Text size='sm' fw={600} c='gray.7' tt='uppercase'>
              Likes
            </Text>
          </Stack>
        </Paper>
      </SimpleGrid>

      <Space h='xs' />

      {/* Performance Statistics */}
      <Group align='center' gap='sm'>
        <ThemeIcon size={32} radius='xl' color='green' variant='light'>
          <IconChartBar size={18} />
        </ThemeIcon>
        <Title order={3} fw={700} c='gray.8'>
          Performance Statistics
        </Title>
      </Group>

      {/* Main Stats Grid */}
      <SimpleGrid cols={{ base: 2, sm: 4 }} spacing='lg'>
        {/* Goals */}
        <Paper
          p='lg'
          radius='xl'
          withBorder
          style={{
            background: 'linear-gradient(135deg, var(--mantine-color-blue-0) 0%, white 100%)',
            border: '2px solid var(--mantine-color-blue-2)',
            textAlign: 'center',
          }}
        >
          <Stack align='center' gap='sm'>
            <ThemeIcon size={48} radius='xl' color='blue' variant='light'>
              <IconTarget size={24} />
            </ThemeIcon>
            <Text size='xl' fw={900} c='blue.8'>
              {stats.totalGoals ?? 0}
            </Text>
            <Text size='sm' fw={600} c='gray.7' tt='uppercase'>
              Goals
            </Text>
          </Stack>
        </Paper>

        {/* Assists */}
        <Paper
          p='lg'
          radius='xl'
          withBorder
          style={{
            background: 'linear-gradient(135deg, var(--mantine-color-violet-0) 0%, white 100%)',
            border: '2px solid var(--mantine-color-violet-2)',
            textAlign: 'center',
          }}
        >
          <Stack align='center' gap='sm'>
            <ThemeIcon size={48} radius='xl' color='violet' variant='light'>
              <IconHandGrab size={24} />
            </ThemeIcon>
            <Text size='xl' fw={900} c='violet.8'>
              {stats.totalAssists ?? 0}
            </Text>
            <Text size='sm' fw={600} c='gray.7' tt='uppercase'>
              Assists
            </Text>
          </Stack>
        </Paper>

        {/* Matches Played */}
        <Paper
          p='lg'
          radius='xl'
          withBorder
          style={{
            background: 'linear-gradient(135deg, var(--mantine-color-green-0) 0%, white 100%)',
            border: '2px solid var(--mantine-color-green-2)',
            textAlign: 'center',
          }}
        >
          <Stack align='center' gap='sm'>
            <ThemeIcon size={48} radius='xl' color='green' variant='light'>
              <IconBallFootball size={24} />
            </ThemeIcon>
            <Text size='xl' fw={900} c='green.8'>
              {stats.matchesPlayed}
            </Text>
            <Text size='sm' fw={600} c='gray.7' tt='uppercase'>
              Matches
            </Text>
          </Stack>
        </Paper>

        {/* Average Rating */}
        <Paper
          p='lg'
          radius='xl'
          withBorder
          style={{
            background: stats.averageRating
              ? 'linear-gradient(135deg, var(--mantine-color-yellow-0) 0%, white 100%)'
              : 'linear-gradient(135deg, var(--mantine-color-gray-0) 0%, white 100%)',
            border: stats.averageRating
              ? '2px solid var(--mantine-color-yellow-2)'
              : '2px solid var(--mantine-color-gray-2)',
            textAlign: 'center',
          }}
        >
          <Stack align='center' gap='sm'>
            <ThemeIcon size={48} radius='xl' color={stats.averageRating ? 'yellow' : 'gray'} variant='light'>
              <IconStars size={24} />
            </ThemeIcon>
            <Text size='xl' fw={900} c={stats.averageRating ? 'yellow.8' : 'gray.6'}>
              {stats.averageRating ? stats.averageRating.toFixed(1) : '-'}
            </Text>
            <Text size='sm' fw={600} c='gray.7' tt='uppercase'>
              Rating
            </Text>
          </Stack>
        </Paper>
      </SimpleGrid>

      {/* Performance Level & Additional Stats */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='lg'>
        {/* Performance Level */}
        {stats.averageRating && (
          <Paper
            p='lg'
            radius='xl'
            withBorder
            style={{
              background: 'linear-gradient(135deg, var(--mantine-color-orange-0) 0%, white 100%)',
              border: '2px solid var(--mantine-color-orange-2)',
            }}
          >
            <Group align='center' gap='sm' mb='md'>
              <ThemeIcon size={24} radius='xl' color='orange' variant='light'>
                <IconAward size={14} />
              </ThemeIcon>
              <Text size='sm' fw={700} c='gray.7' tt='uppercase'>
                Performance Level
              </Text>
            </Group>

            {(() => {
              const level = getPerformanceLevel(stats.averageRating);
              return (
                <Group justify='space-between' align='center'>
                  <Text size='lg' fw={700} c={`${level.color}.8`}>
                    {level.label}
                  </Text>
                  <Badge variant='filled' color={level.color} size='lg'>
                    {stats.averageRating.toFixed(1)}/10
                  </Badge>
                </Group>
              );
            })()}

            <Text size='xs' c='gray.6' mt='xs'>
              Based on {stats.totalRatingCount} match ratings
            </Text>
          </Paper>
        )}

        {/* Organizer Stats */}
        <Paper
          p='lg'
          radius='xl'
          withBorder
          style={{
            background: 'linear-gradient(135deg, var(--mantine-color-teal-0) 0%, white 100%)',
            border: '2px solid var(--mantine-color-teal-2)',
          }}
        >
          <Group align='center' gap='sm' mb='md'>
            <ThemeIcon size={24} radius='xl' color='teal' variant='light'>
              <IconTrophy size={14} />
            </ThemeIcon>
            <Text size='sm' fw={700} c='gray.7' tt='uppercase'>
              Match Organizer
            </Text>
          </Group>

          <Group justify='space-between' align='center'>
            <Text size='lg' fw={700} c='teal.8'>
              {stats.matchesCreated} Matches Created
            </Text>
            {stats.matchesCreated > 0 && (
              <Badge variant='filled' color='teal' size='lg'>
                Organizer
              </Badge>
            )}
          </Group>

          <Text size='xs' c='gray.6' mt='xs'>
            {stats.matchesCreated > 0 ? 'Active community organizer' : 'Focus on playing matches'}
          </Text>
        </Paper>
      </SimpleGrid>
    </Stack>
  );
}
