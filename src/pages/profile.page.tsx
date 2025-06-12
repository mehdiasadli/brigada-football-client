// ProfilePage.tsx - Soccer-Themed Profile
import { useParams } from 'react-router-dom';
import { useProfile } from '../api/users/users.queries';
import { useUserStats } from '../api/stats/stats.queries';
import LoadingComponent from '../components/loading-component';
import ErrorComponent from '../components/error-component';
import {
  Stack,
  Container,
  Paper,
  Avatar,
  Text,
  Group,
  Badge,
  ThemeIcon,
  SimpleGrid,
  Box,
  rem,
  Title,
} from '@mantine/core';
import {
  IconBallFootball,
  IconTarget,
  IconHandGrab,
  IconTrophy,
  IconCalendar,
  IconMapPin,
  IconCrown,
  IconStars,
  IconUsers,
  IconChartBar,
  IconAward,
} from '@tabler/icons-react';
import dayjs from 'dayjs';

export default function ProfilePage() {
  const { username } = useParams();
  const { data: profile, status: profileStatus, error: profileError } = useProfile(username);
  const { data: userStats, status: userStatsStatus } = useUserStats(profile?.data?.id);

  if (profileStatus === 'pending') {
    return <LoadingComponent />;
  }

  if (!profile || !profile.data) {
    return <ErrorComponent error={profileError?.message} />;
  }

  const user = profile.data;
  const stats = userStats?.data;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'red';
      case 'ADMIN':
        return 'orange';
      default:
        return 'blue';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Admin';
      case 'ADMIN':
        return 'Admin';
      default:
        return 'Player';
    }
  };

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
        <Paper
          shadow='xl'
          radius='xl'
          p='lg'
          style={{
            background: 'linear-gradient(135deg, var(--mantine-color-blue-6) 0%, var(--mantine-color-indigo-6) 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background Pattern */}
          <Box
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '300px',
              height: '150px',
              background:
                "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='3'/%3E%3Cpath d='M20 0v40M0 20h40'/%3E%3C/g%3E%3C/svg%3E\")",
              opacity: 0.3,
            }}
          />

          <Group align='center' gap='xl'>
            {/* Avatar */}
            <Box style={{ position: 'relative' }}>
              <Avatar
                src={user.avatar}
                size={120}
                radius='xl'
                style={{
                  border: '4px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                <Text size='xl' fw={700}>
                  {user.firstName[0]}
                  {user.lastName[0]}
                </Text>
              </Avatar>

              {/* Role Badge */}
              {user.role !== 'USER' && (
                <ThemeIcon
                  size={32}
                  radius='xl'
                  color={getRoleColor(user.role)}
                  variant='filled'
                  style={{
                    position: 'absolute',
                    bottom: rem(8),
                    right: rem(8),
                    border: '2px solid white',
                  }}
                >
                  <IconCrown size={16} />
                </ThemeIcon>
              )}
            </Box>

            {/* User Info */}
            <Stack gap='sm' style={{ flex: 1 }}>
              <Group align='center' gap='md'>
                <Title order={2} fw={900}>
                  {user.firstName} {user.lastName}
                </Title>
                <Badge
                  variant='white'
                  color={getRoleColor(user.role)}
                  size='lg'
                  leftSection={user.role !== 'USER' ? <IconCrown size={12} /> : <IconUsers size={12} />}
                >
                  {getRoleLabel(user.role)}
                </Badge>
              </Group>

              <Text size='lg' opacity={0.9} fw={500}>
                @{user.username}
              </Text>

              <Group gap='lg'>
                <Group gap='xs'>
                  <ThemeIcon
                    size={20}
                    radius='xl'
                    color='white'
                    variant='white'
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                  >
                    <IconMapPin size={12} />
                  </ThemeIcon>
                  <Text size='sm' opacity={0.9}>
                    {user.placeOfBirth}
                  </Text>
                </Group>

                <Group gap='xs'>
                  <ThemeIcon
                    size={20}
                    radius='xl'
                    color='white'
                    variant='white'
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                  >
                    <IconCalendar size={12} />
                  </ThemeIcon>
                  <Text size='sm' opacity={0.9}>
                    Joined {dayjs(user.createdAt).format('MMMM YYYY')}
                  </Text>
                </Group>
              </Group>
            </Stack>
          </Group>
        </Paper>

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
      </Stack>
    </Container>
  );
}
