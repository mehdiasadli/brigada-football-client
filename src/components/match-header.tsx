import { Badge, Group, Stack, Text, ThemeIcon, Paper, Box, rem, Anchor } from '@mantine/core';
import type { FindOneMatchResponse } from '../api/matches/matches.responses';
import { MatchStatus } from '../schemas/entities/match.entity';
import { getTeamStats } from '../utils/team-utils';
import { getWeatherCondition } from '../resources/weather-map';
import { IconMapPin, IconClock, IconCalendar, IconBallFootball, IconTrophy, IconVs } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { VenueMapModal } from './venue-map-modal';
import { modals } from '@mantine/modals';

interface MatchHeaderProps {
  match: FindOneMatchResponse;
}

export default function MatchHeader({ match }: MatchHeaderProps) {
  const status = match.status;
  const isCompleted = status === MatchStatus.enum.COMPLETED;

  const homeTeam = match.teams[0];
  const awayTeam = match.teams[1];

  const homeTeamStats = getTeamStats(homeTeam);
  const awayTeamStats = getTeamStats(awayTeam);

  const weatherCondition = getWeatherCondition(match.weatherCondition);

  // Determine winner
  const winner = isCompleted
    ? homeTeamStats.goals > awayTeamStats.goals
      ? 'home'
      : awayTeamStats.goals > homeTeamStats.goals
        ? 'away'
        : 'draw'
    : null;

  const openVenueMapModal = () => {
    if (!match.venue) return;

    modals.open({
      withCloseButton: false,
      size: 'xl',
      children: <VenueMapModal venue={match.venue} />,
    });
  };

  return (
    <Stack gap='xl'>
      {/* Main Match Header */}
      <Paper
        shadow='xl'
        radius='xl'
        p='xl'
        style={{
          background: isCompleted
            ? 'linear-gradient(135deg, var(--mantine-color-green-6) 0%, var(--mantine-color-teal-6) 100%)'
            : 'linear-gradient(135deg, var(--mantine-color-blue-6) 0%, var(--mantine-color-indigo-6) 100%)',
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
            width: '300px',
            height: '120px',
            background:
              "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='3'/%3E%3Cpath d='M20 0v40M0 20h40'/%3E%3C/g%3E%3C/svg%3E\")",
            opacity: 0.3,
          }}
        />

        {isCompleted ? (
          // Completed Match - Show Score
          <Stack align='center' gap='lg'>
            <Group align='center' gap='sm'>
              <ThemeIcon
                size={40}
                radius='xl'
                color='white'
                variant='white'
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                <IconTrophy size={20} />
              </ThemeIcon>
              <Text size='lg' fw={600} opacity={0.9} tt='uppercase'>
                Final Result
              </Text>
            </Group>

            <Group justify='space-between' align='center' w='100%' maw={600}>
              {/* Home Team */}
              <Stack align='center' gap='xs' style={{ flex: 1 }}>
                <Text
                  size='xl'
                  fw={800}
                  ta='center'
                  style={{
                    textDecoration: winner === 'home' ? 'underline' : 'none',
                    textDecorationColor: 'rgba(255, 255, 255, 0.8)',
                    textDecorationThickness: '3px',
                  }}
                >
                  {homeTeam.name || 'Team 1'}
                </Text>
                {winner === 'home' && (
                  <Badge variant='white' color='green' size='sm' fw={700}>
                    WINNER
                  </Badge>
                )}
              </Stack>

              {/* Score Display */}
              <Box
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: rem(20),
                  padding: `${rem(16)} ${rem(24)}`,
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Group gap='lg' align='center'>
                  <Text size={rem(36)} fw={900}>
                    {homeTeamStats.goals}
                  </Text>
                  <Text size={rem(24)} fw={700} opacity={0.8}>
                    -
                  </Text>
                  <Text size={rem(36)} fw={900}>
                    {awayTeamStats.goals}
                  </Text>
                </Group>
                {winner === 'draw' && (
                  <Text size='xs' fw={700} ta='center' mt={4} opacity={0.9}>
                    DRAW
                  </Text>
                )}
              </Box>

              {/* Away Team */}
              <Stack align='center' gap='xs' style={{ flex: 1 }}>
                <Text
                  size='xl'
                  fw={800}
                  ta='center'
                  style={{
                    textDecoration: winner === 'away' ? 'underline' : 'none',
                    textDecorationColor: 'rgba(255, 255, 255, 0.8)',
                    textDecorationThickness: '3px',
                  }}
                >
                  {awayTeam.name || 'Team 2'}
                </Text>
                {winner === 'away' && (
                  <Badge variant='white' color='green' size='sm' fw={700}>
                    WINNER
                  </Badge>
                )}
              </Stack>
            </Group>
          </Stack>
        ) : (
          // Upcoming Match - Show VS
          <Stack align='center' gap='lg'>
            <Group align='center' gap='sm'>
              <ThemeIcon
                size={40}
                radius='xl'
                color='white'
                variant='white'
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                <IconBallFootball size={20} />
              </ThemeIcon>
              <Text size='lg' fw={600} opacity={0.9} tt='uppercase'>
                Upcoming Fixture
              </Text>
            </Group>

            <Group justify='center' align='center' gap='xl' w='100%' maw={600}>
              <Text size='xl' fw={800} ta='center' style={{ flex: 1 }}>
                {homeTeam.name || 'Team 1'}
              </Text>

              <Box
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  padding: rem(12),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                <IconVs size={24} />
              </Box>

              <Text size='xl' fw={800} ta='center' style={{ flex: 1 }}>
                {awayTeam.name || 'Team 2'}
              </Text>
            </Group>
          </Stack>
        )}
      </Paper>

      {/* Match Details */}
      <Group justify='center' gap='lg' wrap='wrap'>
        {/* Date & Time Card */}
        <Paper
          shadow='md'
          radius='xl'
          p='lg'
          withBorder
          style={{
            backgroundColor: 'white',
            border: '2px solid var(--mantine-color-blue-2)',
            minWidth: rem(200),
          }}
        >
          <Stack gap='md' align='center'>
            <Group align='center' gap='sm'>
              <ThemeIcon size={24} radius='xl' color='blue' variant='light'>
                <IconCalendar size={14} />
              </ThemeIcon>
              <Text size='sm' fw={700} c='blue.7' tt='uppercase'>
                Match Date
              </Text>
            </Group>

            <Stack gap={4} align='center'>
              <Text size='lg' fw={700} c='gray.8'>
                {dayjs(match.startTime).format('MMM D, YYYY')}
              </Text>
              <Text size='sm' c='gray.6'>
                {dayjs(match.startTime).fromNow()}
              </Text>
            </Stack>
          </Stack>
        </Paper>

        {/* Time & Duration Card */}
        <Paper
          shadow='md'
          radius='xl'
          p='lg'
          withBorder
          style={{
            backgroundColor: 'white',
            border: '2px solid var(--mantine-color-indigo-2)',
            minWidth: rem(200),
          }}
        >
          <Stack gap='md' align='center'>
            <Group align='center' gap='sm'>
              <ThemeIcon size={24} radius='xl' color='indigo' variant='light'>
                <IconClock size={14} />
              </ThemeIcon>
              <Text size='sm' fw={700} c='indigo.7' tt='uppercase'>
                {isCompleted ? 'Match Time' : 'Kick-off'}
              </Text>
            </Group>

            <Stack gap={4} align='center'>
              <Text size='lg' fw={700} c='gray.8'>
                {dayjs(match.startTime).format('h:mm A')}
              </Text>
              <Text size='sm' c='gray.6'>
                {match.duration || 90} minutes
              </Text>
            </Stack>
          </Stack>
        </Paper>

        {/* Venue Card */}
        {match.venueName && (
          <Paper
            shadow='md'
            radius='xl'
            p='lg'
            withBorder
            style={{
              backgroundColor: 'white',
              border: '2px solid var(--mantine-color-orange-2)',
              minWidth: rem(200),
            }}
          >
            <Stack gap='md' align='center'>
              <Group align='center' gap='sm'>
                <ThemeIcon size={24} radius='xl' color='orange' variant='light'>
                  <IconMapPin size={14} />
                </ThemeIcon>
                <Text size='sm' fw={700} c='orange.7' tt='uppercase'>
                  Venue
                </Text>
              </Group>

              {!match.venue ? (
                <Text size='lg' fw={700} c='gray.8' ta='center'>
                  {match.venueName}
                </Text>
              ) : (
                <Anchor size='lg' onClick={openVenueMapModal}>
                  {match.venue.name}
                </Anchor>
              )}
            </Stack>
          </Paper>
        )}

        {/* Weather Card */}
        {match.weatherCondition && (
          <Paper
            shadow='md'
            radius='xl'
            p='lg'
            withBorder
            style={{
              backgroundColor: 'white',
              border: `2px solid var(--mantine-color-${weatherCondition.color}-2)`,
              minWidth: rem(200),
            }}
          >
            <Stack gap='md' align='center'>
              <Group align='center' gap='sm'>
                <ThemeIcon size={24} radius='xl' color={weatherCondition.color} variant='light'>
                  <weatherCondition.icon size={14} />
                </ThemeIcon>
                <Text size='sm' fw={700} c={`${weatherCondition.color}.7`} tt='uppercase'>
                  Weather
                </Text>
              </Group>

              <Text size='lg' fw={700} c='gray.8' ta='center'>
                {weatherCondition.label}
              </Text>
            </Stack>
          </Paper>
        )}
      </Group>

      {/* Match Description */}
      {match.description && (
        <Paper
          shadow='sm'
          radius='lg'
          p='lg'
          style={{
            backgroundColor: 'var(--mantine-color-gray-0)',
            border: '1px solid var(--mantine-color-gray-3)',
          }}
        >
          <Text size='md' c='gray.7' ta='center' fs='italic'>
            "{match.description}"
          </Text>
        </Paper>
      )}
    </Stack>
  );
}
