import { useLeaderboard } from '../api/stats/stats.queries';
import type { LeaderboardResponse } from '../api/stats/stats.responses';
import ErrorComponent from '../components/error-component';
import LoadingComponent from '../components/loading-component';
import {
  Container,
  Paper,
  Tabs,
  Stack,
  Title,
  ThemeIcon,
  Group,
  Box,
  rem,
  Table,
  Avatar,
  Text,
  Badge,
  Anchor,
} from '@mantine/core';
import {
  IconTarget,
  IconHandGrab,
  IconUsers,
  IconChartBar,
  IconMedal,
  IconStar,
  IconBallFootball,
  IconCrown,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

export default function StatsPage() {
  const { data: leaderboard, status: leaderboardStatus, error: leaderboardError } = useLeaderboard();

  if (leaderboardStatus === 'pending') {
    return <LoadingComponent />;
  }

  if (leaderboardStatus === 'error' || !leaderboard) {
    return <ErrorComponent error={leaderboardError} />;
  }

  const leaderboardData: LeaderboardResponse = leaderboard.data;

  const getRankMedal = (position: number) => {
    switch (position) {
      case 1:
        return { icon: IconCrown, color: 'yellow', bg: 'var(--mantine-color-yellow-0)' };
      case 2:
        return { icon: IconMedal, color: 'gray', bg: 'var(--mantine-color-gray-0)' };
      case 3:
        return { icon: IconMedal, color: 'orange', bg: 'var(--mantine-color-orange-0)' };
      default:
        return null;
    }
  };

  // Render Goals Leaderboard
  const GoalsLeaderboard = () => {
    return (
      <Stack gap='lg'>
        <Paper
          p='lg'
          radius='xl'
          style={{
            background: 'linear-gradient(135deg, var(--mantine-color-blue-0) 0%, white 100%)',
            border: '2px solid var(--mantine-color-blue-2)',
          }}
        >
          <Group align='center' gap='sm' mb='md'>
            <ThemeIcon size={32} radius='xl' color='blue' variant='filled'>
              <IconTarget size={18} />
            </ThemeIcon>
            <Title order={3} fw={700} c='blue.8'>
              Top Goal Scorers
            </Title>
          </Group>
          <Text size='sm' c='gray.6'>
            Players ranked by total goals scored in completed matches
          </Text>
        </Paper>

        <Paper withBorder radius='xl' style={{ overflow: 'hidden' }}>
          <Table highlightOnHover>
            <Table.Thead style={{ backgroundColor: 'var(--mantine-color-blue-0)' }}>
              <Table.Tr>
                <Table.Th style={{ width: 80, textAlign: 'center' }}>Rank</Table.Th>
                <Table.Th>Player</Table.Th>
                <Table.Th style={{ textAlign: 'center' }}>Goals</Table.Th>
                <Table.Th style={{ textAlign: 'center' }}>Avg/Match</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {leaderboardData.topScorers.map((player, index) => {
                const rank = index + 1;
                const medal = getRankMedal(rank);

                return (
                  <Table.Tr
                    key={player.user.id}
                    style={{
                      backgroundColor: medal?.bg,
                      fontWeight: rank <= 3 ? 600 : 400,
                    }}
                  >
                    <Table.Td style={{ textAlign: 'center' }}>
                      {medal ? (
                        <ThemeIcon size={32} radius='xl' color={medal.color} variant='light'>
                          <medal.icon size={16} />
                        </ThemeIcon>
                      ) : (
                        <Text size='lg' fw={700} c='gray.7'>
                          {rank}
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Group gap='sm'>
                        <Avatar src={player.user.avatar} size='md' radius='xl'>
                          {player.user.firstName[0]}
                          {player.user.lastName[0]}
                        </Avatar>
                        <Box>
                          <Anchor
                            component={Link}
                            to={`/users/${player.user.username}`}
                            style={{ textDecoration: 'none' }}
                          >
                            <Text fw={600} c='gray.8'>
                              {player.user.firstName} {player.user.lastName}
                            </Text>
                          </Anchor>
                          <Text size='sm' c='gray.6'>
                            @{player.user.username}
                          </Text>
                        </Box>
                      </Group>
                    </Table.Td>
                    <Table.Td style={{ textAlign: 'center' }}>
                      <Badge variant='filled' color='blue' size='lg'>
                        {player.goals}
                      </Badge>
                    </Table.Td>
                    <Table.Td style={{ textAlign: 'center' }}>
                      <Text size='sm' fw={600} c='gray.7'>
                        {player.averageGoals.toFixed(1)}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Paper>
      </Stack>
    );
  };

  // Render Assists Leaderboard
  const AssistsLeaderboard = () => {
    return (
      <Stack gap='lg'>
        <Paper
          p='lg'
          radius='xl'
          style={{
            background: 'linear-gradient(135deg, var(--mantine-color-violet-0) 0%, white 100%)',
            border: '2px solid var(--mantine-color-violet-2)',
          }}
        >
          <Group align='center' gap='sm' mb='md'>
            <ThemeIcon size={32} radius='xl' color='violet' variant='filled'>
              <IconHandGrab size={18} />
            </ThemeIcon>
            <Title order={3} fw={700} c='violet.8'>
              Top Assist Providers
            </Title>
          </Group>
          <Text size='sm' c='gray.6'>
            Players ranked by total assists in completed matches
          </Text>
        </Paper>

        <Paper withBorder radius='xl' style={{ overflow: 'hidden' }}>
          <Table highlightOnHover>
            <Table.Thead style={{ backgroundColor: 'var(--mantine-color-violet-0)' }}>
              <Table.Tr>
                <Table.Th style={{ width: 80, textAlign: 'center' }}>Rank</Table.Th>
                <Table.Th>Player</Table.Th>
                <Table.Th style={{ textAlign: 'center' }}>Assists</Table.Th>
                <Table.Th style={{ textAlign: 'center' }}>Avg/Match</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {leaderboardData.topAssisters.map((player, index) => {
                const rank = index + 1;
                const medal = getRankMedal(rank);

                return (
                  <Table.Tr
                    key={player.user.id}
                    style={{
                      backgroundColor: medal?.bg,
                      fontWeight: rank <= 3 ? 600 : 400,
                    }}
                  >
                    <Table.Td style={{ textAlign: 'center' }}>
                      {medal ? (
                        <ThemeIcon size={32} radius='xl' color={medal.color} variant='light'>
                          <medal.icon size={16} />
                        </ThemeIcon>
                      ) : (
                        <Text size='lg' fw={700} c='gray.7'>
                          {rank}
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Group gap='sm'>
                        <Avatar src={player.user.avatar} size='md' radius='xl'>
                          {player.user.firstName[0]}
                          {player.user.lastName[0]}
                        </Avatar>
                        <Box>
                          <Anchor
                            component={Link}
                            to={`/users/${player.user.username}`}
                            style={{ textDecoration: 'none' }}
                          >
                            <Text fw={600} c='gray.8'>
                              {player.user.firstName} {player.user.lastName}
                            </Text>
                          </Anchor>
                          <Text size='sm' c='gray.6'>
                            @{player.user.username}
                          </Text>
                        </Box>
                      </Group>
                    </Table.Td>
                    <Table.Td style={{ textAlign: 'center' }}>
                      <Badge variant='filled' color='violet' size='lg'>
                        {player.assists}
                      </Badge>
                    </Table.Td>
                    <Table.Td style={{ textAlign: 'center' }}>
                      <Text size='sm' fw={600} c='gray.7'>
                        {player.averageAssists.toFixed(1)}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Paper>
      </Stack>
    );
  };

  // Render Rating Leaderboard
  const RatingLeaderboard = () => {
    const getRatingLevel = (rating: number) => {
      if (rating >= 9) return { label: 'World Class', color: 'red' };
      if (rating >= 8) return { label: 'Excellent', color: 'orange' };
      if (rating >= 7) return { label: 'Very Good', color: 'yellow' };
      if (rating >= 6) return { label: 'Good', color: 'green' };
      return { label: 'Average', color: 'blue' };
    };

    return (
      <Stack gap='lg'>
        <Paper
          p='lg'
          radius='xl'
          style={{
            background: 'linear-gradient(135deg, var(--mantine-color-yellow-0) 0%, white 100%)',
            border: '2px solid var(--mantine-color-yellow-2)',
          }}
        >
          <Group align='center' gap='sm' mb='md'>
            <ThemeIcon size={32} radius='xl' color='yellow' variant='filled'>
              <IconStar size={18} />
            </ThemeIcon>
            <Title order={3} fw={700} c='yellow.8'>
              Top Rated Players
            </Title>
          </Group>
          <Text size='sm' c='gray.6'>
            Players ranked by average match rating (minimum 3 matches)
          </Text>
        </Paper>

        <Paper withBorder radius='xl' style={{ overflow: 'hidden' }}>
          <Table highlightOnHover>
            <Table.Thead style={{ backgroundColor: 'var(--mantine-color-yellow-0)' }}>
              <Table.Tr>
                <Table.Th style={{ width: 80, textAlign: 'center' }}>Rank</Table.Th>
                <Table.Th>Player</Table.Th>
                <Table.Th style={{ textAlign: 'center' }}>Rating</Table.Th>
                <Table.Th style={{ textAlign: 'center' }}>Level</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {leaderboardData.topRatedPlayers.map((player, index) => {
                const rank = index + 1;
                const medal = getRankMedal(rank);
                const level = getRatingLevel(player.rating);

                return (
                  <Table.Tr
                    key={player.user.id}
                    style={{
                      backgroundColor: medal?.bg,
                      fontWeight: rank <= 3 ? 600 : 400,
                    }}
                  >
                    <Table.Td style={{ textAlign: 'center' }}>
                      {medal ? (
                        <ThemeIcon size={32} radius='xl' color={medal.color} variant='light'>
                          <medal.icon size={16} />
                        </ThemeIcon>
                      ) : (
                        <Text size='lg' fw={700} c='gray.7'>
                          {rank}
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Group gap='sm'>
                        <Avatar src={player.user.avatar} size='md' radius='xl'>
                          {player.user.firstName[0]}
                          {player.user.lastName[0]}
                        </Avatar>
                        <Box>
                          <Anchor
                            component={Link}
                            to={`/users/${player.user.username}`}
                            style={{ textDecoration: 'none' }}
                          >
                            <Text fw={600} c='gray.8'>
                              {player.user.firstName} {player.user.lastName}
                            </Text>
                          </Anchor>
                          <Text size='sm' c='gray.6'>
                            @{player.user.username}
                          </Text>
                        </Box>
                      </Group>
                    </Table.Td>
                    <Table.Td style={{ textAlign: 'center' }}>
                      <Badge variant='filled' color='yellow' size='lg'>
                        {player.rating.toFixed(1)}
                      </Badge>
                    </Table.Td>
                    <Table.Td style={{ textAlign: 'center' }}>
                      <Badge variant='light' color={level.color} size='sm'>
                        {level.label}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Paper>
      </Stack>
    );
  };

  // Render Activity Leaderboard
  const ActivityLeaderboard = () => {
    return (
      <Stack gap='lg'>
        <Paper
          p='lg'
          radius='xl'
          style={{
            background: 'linear-gradient(135deg, var(--mantine-color-green-0) 0%, white 100%)',
            border: '2px solid var(--mantine-color-green-2)',
          }}
        >
          <Group align='center' gap='sm' mb='md'>
            <ThemeIcon size={32} radius='xl' color='green' variant='filled'>
              <IconBallFootball size={18} />
            </ThemeIcon>
            <Title order={3} fw={700} c='green.8'>
              Most Active Players
            </Title>
          </Group>
          <Text size='sm' c='gray.6'>
            Players ranked by total completed matches played
          </Text>
        </Paper>

        <Paper withBorder radius='xl' style={{ overflow: 'hidden' }}>
          <Table highlightOnHover>
            <Table.Thead style={{ backgroundColor: 'var(--mantine-color-green-0)' }}>
              <Table.Tr>
                <Table.Th style={{ width: 80, textAlign: 'center' }}>Rank</Table.Th>
                <Table.Th>Player</Table.Th>
                <Table.Th style={{ textAlign: 'center' }}>Matches</Table.Th>
                <Table.Th style={{ textAlign: 'center' }}>Activity</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {leaderboardData.topActivePlayers.map((player, index) => {
                const rank = index + 1;
                const medal = getRankMedal(rank);

                const getActivityLevel = (matches: number) => {
                  if (matches >= 20) return { label: 'Very Active', color: 'green' };
                  if (matches >= 10) return { label: 'Active', color: 'blue' };
                  if (matches >= 5) return { label: 'Regular', color: 'yellow' };
                  return { label: 'Casual', color: 'gray' };
                };

                const activity = getActivityLevel(player.matches);

                return (
                  <Table.Tr
                    key={player.user.id}
                    style={{
                      backgroundColor: medal?.bg,
                      fontWeight: rank <= 3 ? 600 : 400,
                    }}
                  >
                    <Table.Td style={{ textAlign: 'center' }}>
                      {medal ? (
                        <ThemeIcon size={32} radius='xl' color={medal.color} variant='light'>
                          <medal.icon size={16} />
                        </ThemeIcon>
                      ) : (
                        <Text size='lg' fw={700} c='gray.7'>
                          {rank}
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Group gap='sm'>
                        <Avatar src={player.user.avatar} size='md' radius='xl'>
                          {player.user.firstName[0]}
                          {player.user.lastName[0]}
                        </Avatar>
                        <Box>
                          <Anchor
                            component={Link}
                            to={`/users/${player.user.username}`}
                            style={{ textDecoration: 'none' }}
                          >
                            <Text fw={600} c='gray.8'>
                              {player.user.firstName} {player.user.lastName}
                            </Text>
                          </Anchor>
                          <Text size='sm' c='gray.6'>
                            @{player.user.username}
                          </Text>
                        </Box>
                      </Group>
                    </Table.Td>
                    <Table.Td style={{ textAlign: 'center' }}>
                      <Badge variant='filled' color='green' size='lg'>
                        {player.matches}
                      </Badge>
                    </Table.Td>
                    <Table.Td style={{ textAlign: 'center' }}>
                      <Badge variant='light' color={activity.color} size='sm'>
                        {activity.label}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Paper>
      </Stack>
    );
  };

  return (
    <Container size='xl' py='xl'>
      <Stack gap='xl'>
        {/* Page Header */}
        <Paper
          shadow='xl'
          radius='xl'
          p='xl'
          style={{
            background: 'linear-gradient(135deg, var(--mantine-color-green-6) 0%, var(--mantine-color-teal-6) 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '300px',
              height: '120px',
              background:
                "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='3'/%3E%3Cpath d='M20 0v40M0 20h40'/%3E%3C/g%3E%3C/svg%3E\")",
              opacity: 0.3,
            }}
          />

          <Group align='center' gap='lg'>
            <ThemeIcon
              size={80}
              radius='xl'
              color='white'
              variant='white'
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            >
              <IconChartBar size={40} />
            </ThemeIcon>

            <Box>
              <Title order={1} fw={900} mb='sm'>
                Player Statistics & Leaderboards
              </Title>
              <Text size='lg' opacity={0.9}>
                Discover top performers and community champions
              </Text>
            </Box>
          </Group>
        </Paper>

        {/* Leaderboard Tabs */}
        <Tabs defaultValue='goals' variant='pills' radius='xl'>
          <Tabs.List
            grow
            mb='xl'
            style={{ backgroundColor: 'var(--mantine-color-gray-0)', padding: rem(8), borderRadius: rem(16) }}
          >
            <Tabs.Tab value='goals' leftSection={<IconTarget size={16} />} style={{ fontWeight: 600 }}>
              Goal Scorers
            </Tabs.Tab>
            <Tabs.Tab value='assists' leftSection={<IconHandGrab size={16} />} style={{ fontWeight: 600 }}>
              Assist Providers
            </Tabs.Tab>
            <Tabs.Tab value='rating' leftSection={<IconStar size={16} />} style={{ fontWeight: 600 }}>
              Top Rated
            </Tabs.Tab>
            <Tabs.Tab value='activity' leftSection={<IconUsers size={16} />} style={{ fontWeight: 600 }}>
              Most Active
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value='goals'>
            <GoalsLeaderboard />
          </Tabs.Panel>

          <Tabs.Panel value='assists'>
            <AssistsLeaderboard />
          </Tabs.Panel>

          <Tabs.Panel value='rating'>
            <RatingLeaderboard />
          </Tabs.Panel>

          <Tabs.Panel value='activity'>
            <ActivityLeaderboard />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}
