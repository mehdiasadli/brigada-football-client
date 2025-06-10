import { Card, Group, Text, Badge, Stack, Avatar, Tooltip, Anchor, Paper, ThemeIcon, Box, rem } from '@mantine/core';
import { IconCalendar, IconClock, IconMapPin, IconBallFootball, IconCrown } from '@tabler/icons-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { FindAllMatchesResponse } from '../api/matches/matches.responses';
import MatchCardActions from './match-card-actions';
import { getWeatherCondition } from '../resources/weather-map';
import { Link } from 'react-router-dom';

dayjs.extend(relativeTime);

interface FixtureCardProps {
  match: FindAllMatchesResponse;
}

export default function FixtureCard({ match }: FixtureCardProps) {
  const weatherCondition = getWeatherCondition(match.weatherCondition);
  const totalPlayers = match.teams.reduce((acc, team) => acc + team.players.length, 0);
  const isUpcoming = dayjs(match.startTime).isAfter(dayjs());
  const isToday = dayjs(match.startTime).isSame(dayjs(), 'day');
  const timeUntilMatch = dayjs(match.startTime).fromNow();

  return (
    <Card
      shadow='lg'
      radius='xl'
      p='xl'
      withBorder
      style={{
        background: 'linear-gradient(135deg, white 0%, var(--mantine-color-gray-0) 100%)',
        border: isToday ? '2px solid var(--mantine-color-orange-4)' : '2px solid var(--mantine-color-gray-2)',
        transition: 'all 0.3s ease',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      {/* Today Match Indicator */}
      {isToday && (
        <Box
          style={{
            position: 'absolute',
            top: rem(-8),
            right: rem(20),
            background: 'linear-gradient(135deg, var(--mantine-color-orange-5) 0%, var(--mantine-color-red-5) 100%)',
            borderRadius: rem(16),
            padding: `${rem(4)} ${rem(12)}`,
            color: 'white',
            fontSize: rem(11),
            fontWeight: 700,
            textTransform: 'uppercase',
            zIndex: 1,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          }}
        >
          Today
        </Box>
      )}

      <Stack gap='lg'>
        {/* Match Header */}
        <Paper
          p='md'
          radius='lg'
          style={{
            background: 'linear-gradient(135deg, var(--mantine-color-blue-0) 0%, var(--mantine-color-indigo-0) 100%)',
            border: '2px solid var(--mantine-color-blue-2)',
          }}
        >
          <Group justify='space-between' align='center'>
            <Anchor component={Link} to={`/matches/${match.id}`} style={{ textDecoration: 'none', flex: 1 }}>
              <Group gap='sm' align='center'>
                <ThemeIcon size={24} radius='xl' color='blue' variant='filled'>
                  <IconBallFootball size={14} />
                </ThemeIcon>
                <Text size='lg' fw={700} c='blue.8'>
                  {match.teams[0]?.name || 'Team 1'} vs {match.teams[1]?.name || 'Team 2'}
                </Text>
              </Group>
            </Anchor>

            <MatchCardActions match={match} />
          </Group>
        </Paper>

        {/* Match Details */}
        <Stack gap='md'>
          {/* Date & Time */}
          <Group gap='md'>
            <Group gap='xs' style={{ flex: 1 }}>
              <ThemeIcon size={20} radius='xl' color='green' variant='light'>
                <IconCalendar size={12} />
              </ThemeIcon>
              <Stack gap={2}>
                <Text size='sm' fw={600} c='gray.8'>
                  {dayjs(match.startTime).format('MMM D, YYYY')}
                </Text>
                <Text size='xs' c={isUpcoming ? 'green.6' : 'gray.6'} fw={500}>
                  {timeUntilMatch}
                </Text>
              </Stack>
            </Group>

            <Group gap='xs' style={{ flex: 1 }}>
              <ThemeIcon size={20} radius='xl' color='blue' variant='light'>
                <IconClock size={12} />
              </ThemeIcon>
              <Stack gap={2}>
                <Text size='sm' fw={600} c='gray.8'>
                  {dayjs(match.startTime).format('h:mm A')}
                </Text>
                <Text size='xs' c='gray.6' fw={500}>
                  {match.duration || 90} minutes
                </Text>
              </Stack>
            </Group>
          </Group>

          {/* Venue */}
          {match.venueName && (
            <Group gap='xs'>
              <ThemeIcon size={20} radius='xl' color='orange' variant='light'>
                <IconMapPin size={12} />
              </ThemeIcon>
              <Text size='sm' fw={600} c='gray.7'>
                {match.venueName}
              </Text>
            </Group>
          )}

          {/* Description */}
          <Box
            style={{
              backgroundColor: 'var(--mantine-color-gray-0)',
              borderRadius: rem(8),
              padding: rem(12),
              border: '1px solid var(--mantine-color-gray-2)',
            }}
          >
            <Text size='sm' c='gray.7' style={{ lineHeight: 1.5 }}>
              {match.description || 'No description provided for this match.'}
            </Text>
          </Box>

          {/* Weather Badge */}
          {match.weatherCondition ? (
            <Group justify='center'>
              <Badge
                size='lg'
                color={weatherCondition.color}
                variant='light'
                leftSection={<weatherCondition.icon size={14} />}
                style={{ fontWeight: 600 }}
              >
                {weatherCondition.label}
              </Badge>
            </Group>
          ) : (
            <Group justify='center'>
              <Badge size='lg' color='gray' variant='light'>
                Weather TBD
              </Badge>
            </Group>
          )}
        </Stack>

        {/* Footer Section */}
        <Box
          style={{
            borderTop: '1px solid var(--mantine-color-gray-3)',
            paddingTop: rem(16),
          }}
        >
          <Group justify='space-between' align='center'>
            {/* Match Creator */}
            <Group gap='xs'>
              <Text size='xs' fw={600} c='gray.5' tt='uppercase'>
                Organized by
              </Text>
              {match.creator ? (
                <Group gap='xs'>
                  <Avatar src={match.creator.avatar} size='sm' radius='xl' />
                  <Text size='sm' fw={600} c='gray.7'>
                    {match.creator.username}
                  </Text>
                </Group>
              ) : (
                <Group gap='xs'>
                  <Avatar size='sm' radius='xl' />
                  <Text size='sm' c='gray.5' fs='italic'>
                    Deleted user
                  </Text>
                </Group>
              )}
            </Group>

            {/* Players Preview */}
            <Stack gap={4} align='flex-end'>
              <Text size='xs' fw={600} c='gray.5' tt='uppercase'>
                Squad ({totalPlayers})
              </Text>

              <Tooltip.Group openDelay={300} closeDelay={100}>
                <Avatar.Group spacing='xs'>
                  {match.teams.flatMap((team) =>
                    team.players.slice(0, 4).map((player) => (
                      <Tooltip
                        key={player.id}
                        label={
                          <Stack gap={2}>
                            <Text size='xs' fw={600}>
                              {player.user?.username || player.name}
                            </Text>
                            {player.isCaptain && (
                              <Group gap={2}>
                                <IconCrown size={10} />
                                <Text size='xs'>Captain</Text>
                              </Group>
                            )}
                          </Stack>
                        }
                      >
                        <Box style={{ position: 'relative' }}>
                          {player.isCaptain && (
                            <ThemeIcon
                              size={12}
                              radius='xl'
                              color='yellow'
                              variant='filled'
                              style={{
                                position: 'absolute',
                                top: -2,
                                right: -2,
                                zIndex: 1,
                              }}
                            >
                              <IconCrown size={6} />
                            </ThemeIcon>
                          )}

                          <Avatar
                            src={player.user?.avatar}
                            size='sm'
                            radius='xl'
                            style={{
                              border: '2px solid var(--mantine-color-gray-3)',
                            }}
                          >
                            {(player.user?.firstName?.[0] || player.name[0]).toUpperCase()}
                          </Avatar>
                        </Box>
                      </Tooltip>
                    ))
                  )}

                  {totalPlayers > 8 && (
                    <Tooltip label={`${totalPlayers - 8} more players`}>
                      <Avatar
                        size='sm'
                        radius='xl'
                        style={{
                          backgroundColor: 'var(--mantine-color-blue-5)',
                          color: 'white',
                          fontWeight: 600,
                        }}
                      >
                        +{totalPlayers - 8}
                      </Avatar>
                    </Tooltip>
                  )}
                </Avatar.Group>
              </Tooltip.Group>
            </Stack>
          </Group>
        </Box>
      </Stack>
    </Card>
  );
}
