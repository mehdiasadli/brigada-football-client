// ProfilePage.tsx - Soccer-Themed Profile
import { useParams } from 'react-router-dom';
import { useProfile } from '../api/users/users.queries';
import { useUserStats } from '../api/stats/stats.queries';
import LoadingComponent from '../components/loading-component';
import ErrorComponent from '../components/error-component';
import { Stack, Container, Paper, Text, Group, Badge, ThemeIcon, SimpleGrid, Title } from '@mantine/core';
import {
  IconBallFootball,
  IconTarget,
  IconHandGrab,
  IconTrophy,
  IconCalendar,
  IconStars,
  IconUsers,
  IconChartBar,
  IconAward,
  IconMessage,
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import InfiniteList from '../components/infinite-list';
import { usePostsOfUser } from '../api/posts/posts.queries';
import FeedPostCard from '../components/feed-post-card';
import { useUserStore } from '../stores/user.store';
import ProfileHeader from '../components/profile-header';

export default function ProfilePage() {
  const { username } = useParams();
  const { data: profile, status: profileStatus, error: profileError } = useProfile(username);
  const { data: userStats, status: userStatsStatus } = useUserStats(profile?.data?.id);
  const currentUser = useUserStore((state) => state.user)!;
  const posts = usePostsOfUser(username ?? currentUser.username);

  if (profileStatus === 'pending') {
    return <LoadingComponent />;
  }

  if (!profile || !profile.data) {
    return <ErrorComponent error={profileError?.message} />;
  }

  const user = profile.data;
  const stats = userStats?.data;

  const getPerformanceLevel = (rating: number) => {
    if (rating >= 9) return { label: 'World Class', color: 'red' };
    if (rating >= 8) return { label: 'Excellent', color: 'orange' };
    if (rating >= 7) return { label: 'Very Good', color: 'yellow' };
    if (rating >= 6) return { label: 'Good', color: 'green' };
    if (rating >= 5) return { label: 'Average', color: 'blue' };
    return { label: 'Developing', color: 'gray' };
  };

  return (
    <Container size='lg' py='xl'>
      <Stack gap='xl'>
        {/* Profile Header */}
        <ProfileHeader user={user} />

        {/* Statistics Section */}
        {userStatsStatus === 'pending' ? (
          <Paper p='xl' radius='xl' style={{ textAlign: 'center' }}>
            <LoadingComponent />
          </Paper>
        ) : stats ? (
          <Stack gap='lg'>
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
        ) : (
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
              <Text c='gray.6'>This player hasn't participated in any completed matches yet.</Text>
            </Stack>
          </Paper>
        )}

        {/* Personal Information */}
        <Stack gap='lg'>
          <Group align='center' gap='sm'>
            <ThemeIcon size={32} radius='xl' color='blue' variant='light'>
              <IconUsers size={18} />
            </ThemeIcon>
            <Title order={3} fw={700} c='gray.8'>
              Personal Information
            </Title>
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='lg'>
            <Paper p='lg' radius='xl' withBorder>
              <Stack gap='md'>
                <Group gap='xs'>
                  <IconCalendar size={16} color='var(--mantine-color-gray-6)' />
                  <Text size='sm' fw={600} c='gray.7'>
                    Age
                  </Text>
                </Group>
                <Text size='lg' fw={600} c='gray.8'>
                  {dayjs().diff(dayjs(user.dateOfBirth), 'year')} years old
                </Text>
              </Stack>
            </Paper>
          </SimpleGrid>
        </Stack>

        <Stack gap='lg'>
          <Group align='center' gap='sm'>
            <ThemeIcon size={32} radius='xl' color='blue' variant='light'>
              <IconMessage size={18} />
            </ThemeIcon>
            <Title order={3} fw={700} c='gray.8'>
              Posts
            </Title>
          </Group>

          <InfiniteList
            result={posts}
            render={(post) => <FeedPostCard post={post} />}
            cols={{
              base: 1,
              xs: 1,
              sm: 2,
              md: 2,
              lg: 2,
              xl: 2,
            }}
          />
        </Stack>
      </Stack>
    </Container>
  );
}
