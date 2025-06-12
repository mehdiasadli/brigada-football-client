import type { FindAllMatchesResponse } from '../api/matches/matches.responses';
import {
  Card,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Avatar,
  Tooltip,
  Badge,
  Box,
  Anchor,
  Paper,
  Divider,
  rem,
} from '@mantine/core';
import {
  IconCalendar,
  IconClock,
  IconBallFootball,
  IconHandGrab,
  IconMapPin,
  IconCrown,
  IconEye,
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import MatchCardActions from './match-card-actions';
import { Link } from 'react-router-dom';
import { getTeamStats } from '../utils/team-utils';
import { sortPlayers } from '../utils/team-utils';
import { modals } from '@mantine/modals';
import { VenueMapModal } from './venue-map-modal';

interface ResultCardProps {
  match: FindAllMatchesResponse;
}

export default function ResultCard({ match }: ResultCardProps) {
  const homeTeam = sortPlayers(match.teams[0]) as FindAllMatchesResponse['teams'][number];
  const awayTeam = sortPlayers(match.teams[1]) as FindAllMatchesResponse['teams'][number];

  const homeTeamStats = getTeamStats(homeTeam);
  const awayTeamStats = getTeamStats(awayTeam);

  const winner =
    homeTeamStats.goals > awayTeamStats.goals ? 'home' : awayTeamStats.goals > homeTeamStats.goals ? 'away' : 'draw';

  const openVenueMapModal = () => {
    if (!match.venue) return;

    modals.open({
      withCloseButton: false,
      size: 'xl',
      children: <VenueMapModal venue={match.venue} />,
    });
  };

  return (
    <Card
      shadow='lg'
      radius='xl'
      p='xl'
      withBorder
      style={{
        background: 'linear-gradient(135deg, white 0%, var(--mantine-color-gray-0) 100%)',
        border: '2px solid var(--mantine-color-gray-2)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      <Stack gap='lg'>
        {/* Match Header */}
        <Group justify='space-between' align='center'>
          <Group gap='xs'>
            <ThemeIcon size={24} radius='xl' color='green' variant='light'>
              <IconCalendar size={14} />
            </ThemeIcon>
            <Text size='sm' fw={600} c='gray.7'>
              {dayjs(match.startTime).format('D MMM YYYY')}
            </Text>
          </Group>

          <Group gap='xs'>
            <Text size='sm' fw={600} c='gray.7'>
              {dayjs(match.startTime).format('h:mm A')}
            </Text>
            <ThemeIcon size={24} radius='xl' color='blue' variant='light'>
              <IconClock size={14} />
            </ThemeIcon>
          </Group>
        </Group>

        {/* Score Section */}
        <Paper
          p='lg'
          radius='lg'
          style={{
            background: 'linear-gradient(135deg, var(--mantine-color-green-0) 0%, var(--mantine-color-teal-0) 100%)',
            border: '2px solid var(--mantine-color-green-2)',
          }}
        >
          <Group justify='space-between' align='center'>
            {/* Home Team */}
            <Stack align='center' gap='xs' style={{ flex: 1 }}>
              <Text
                size='lg'
                fw={700}
                c={winner === 'home' ? 'green.8' : 'gray.7'}
                ta='center'
                style={{
                  textDecoration: winner === 'home' ? 'underline' : 'none',
                  textDecorationColor: 'var(--mantine-color-green-6)',
                }}
              >
                {homeTeam.name || 'Team 1'}
              </Text>
              {winner === 'home' && (
                <Badge variant='filled' color='green' size='sm'>
                  Winner
                </Badge>
              )}
            </Stack>

            {/* Score */}
            <Box
              style={{
                backgroundColor: 'white',
                borderRadius: rem(16),
                padding: `${rem(12)} ${rem(20)}`,
                border: '2px solid var(--mantine-color-green-3)',
                minWidth: rem(80),
                textAlign: 'center',
              }}
            >
              <Group gap='sm' justify='center' align='center'>
                <Text size='xl' fw={900} c='green.8'>
                  {homeTeamStats.goals}
                </Text>
                <Text size='lg' fw={700} c='gray.5'>
                  -
                </Text>
                <Text size='xl' fw={900} c='green.8'>
                  {awayTeamStats.goals}
                </Text>
              </Group>
              {winner === 'draw' && (
                <Text size='xs' fw={600} c='gray.6' mt={2}>
                  DRAW
                </Text>
              )}
            </Box>

            {/* Away Team */}
            <Stack align='center' gap='xs' style={{ flex: 1 }}>
              <Text
                size='lg'
                fw={700}
                c={winner === 'away' ? 'green.8' : 'gray.7'}
                ta='center'
                style={{
                  textDecoration: winner === 'away' ? 'underline' : 'none',
                  textDecorationColor: 'var(--mantine-color-green-6)',
                }}
              >
                {awayTeam.name || 'Team 2'}
              </Text>
              {winner === 'away' && (
                <Badge variant='filled' color='green' size='sm'>
                  Winner
                </Badge>
              )}
            </Stack>
          </Group>
        </Paper>

        {/* Team Stats */}
        <Group justify='space-between'>
          <TeamStats team={homeTeam} align='left' />
          <TeamStats team={awayTeam} align='right' />
        </Group>

        <Divider />

        {/* Match Footer */}
        <Group justify='space-between' align='center'>
          <Group gap='xs'>
            <ThemeIcon size={20} radius='xl' color='gray' variant='light'>
              <IconMapPin size={12} />
            </ThemeIcon>
            {!match.venue ? (
              <Text size='sm' c='gray.6'>
                {match.venueName || 'Venue TBD'}
              </Text>
            ) : (
              <Anchor onClick={openVenueMapModal}>{match.venue.name}</Anchor>
            )}
          </Group>

          <Group gap='sm'>
            <Anchor component={Link} to={`/matches/${match.id}`} style={{ textDecoration: 'none' }}>
              <Group gap='xs'>
                <ThemeIcon size={20} radius='xl' color='blue' variant='light'>
                  <IconEye size={12} />
                </ThemeIcon>
                <Text size='sm' fw={600} c='blue.6'>
                  View Details
                </Text>
              </Group>
            </Anchor>

            <MatchCardActions match={match} />
          </Group>
        </Group>
      </Stack>
    </Card>
  );
}

// TeamStats Component
function TeamStats({ team, align }: { team: FindAllMatchesResponse['teams'][number]; align: 'left' | 'right' }) {
  const topScorer = team.players.reduce((top, player) => (player.goals > top.goals ? player : top), team.players[0]);

  return (
    <Stack gap='xs' align={align === 'left' ? 'flex-start' : 'flex-end'}>
      <Text size='xs' fw={700} c='gray.6' tt='uppercase'>
        Squad ({team.players.length})
      </Text>

      <Group gap='xs' justify={align === 'left' ? 'flex-start' : 'flex-end'}>
        {team.players.slice(0, 3).map((player) => (
          <Tooltip
            key={player.id}
            label={
              <Stack gap={2}>
                <Text size='xs' fw={600}>
                  {player.name} {player.isCaptain && '(C)'}
                </Text>
                <Group gap='xs'>
                  <Group gap={2}>
                    <IconBallFootball size={12} />
                    <Text size='xs'>{player.goals}</Text>
                  </Group>
                  <Group gap={2}>
                    <IconHandGrab size={12} />
                    <Text size='xs'>{player.assists}</Text>
                  </Group>
                </Group>
              </Stack>
            }
          >
            <Box style={{ position: 'relative' }}>
              {player.isCaptain && (
                <ThemeIcon
                  size={16}
                  radius='xl'
                  color='yellow'
                  variant='filled'
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    zIndex: 1,
                  }}
                >
                  <IconCrown size={8} />
                </ThemeIcon>
              )}

              <Avatar
                size='sm'
                src={player.user?.avatar}
                radius='xl'
                style={{
                  border:
                    player === topScorer && topScorer.goals > 0
                      ? '2px solid var(--mantine-color-blue-5)'
                      : '2px solid var(--mantine-color-gray-3)',
                }}
              >
                {(player.user?.firstName?.[0] || player.name[0]).toUpperCase()}
              </Avatar>
            </Box>
          </Tooltip>
        ))}

        {team.players.length > 3 && (
          <Text size='xs' c='gray.5' fw={600}>
            +{team.players.length - 3}
          </Text>
        )}
      </Group>
    </Stack>
  );
}
