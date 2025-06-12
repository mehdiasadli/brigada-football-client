import { Link, useParams } from 'react-router-dom';
import { useMatch } from '../api/matches/matches.queries';
import ErrorComponent from '../components/error-component';
import LoadingComponent from '../components/loading-component';
import {
  Anchor,
  Badge,
  Button,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Paper,
  Tooltip,
  Container,
  Box,
  rem,
} from '@mantine/core';
import MatchHeader from '../components/match-header';
import { useUserStore } from '../stores/user.store';
import { IconBallFootball, IconHandGrab, IconCrown, IconEdit, IconShirt } from '@tabler/icons-react';
import type { FindOneMatchResponse } from '../api/matches/matches.responses';
import { MatchStatus } from '../schemas/entities/match.entity';

export default function MatchPage() {
  const { matchId } = useParams() as { matchId: string };
  const { data, error } = useMatch(matchId);
  const { user } = useUserStore();

  if (error) {
    return (
      <Container size='lg' py='xl'>
        <ErrorComponent error={error} />
      </Container>
    );
  }

  if (!data || !data.data) {
    return (
      <Container size='lg' py='xl'>
        <LoadingComponent />
      </Container>
    );
  }

  const match = data.data;
  const isCreator = match.creatorId === user?.id;

  return (
    <Stack gap='xl'>
      <MatchHeader match={match} />

      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: rem(24),
        }}
      >
        <TeamCard team={match.teams[0]} teamIndex={1} status={match.status} isCreator={isCreator} align='left' />
        <TeamCard team={match.teams[1]} teamIndex={2} status={match.status} isCreator={isCreator} align='right' />
      </Box>
    </Stack>
  );
}

// TeamCard Component
function TeamCard({
  team,
  teamIndex,
  status,
  isCreator,
  align,
}: {
  team: FindOneMatchResponse['teams'][number];
  teamIndex: 1 | 2;
  status: FindOneMatchResponse['status'];
  isCreator: boolean;
  align: 'left' | 'right';
}) {
  const teamColor = teamIndex === 1 ? 'blue' : 'green';

  return (
    <Paper
      shadow='sm'
      radius='xl'
      p='lg'
      style={{
        background: `linear-gradient(135deg, var(--mantine-color-${teamColor}-0) 0%, white 100%)`,
        border: `2px solid var(--mantine-color-${teamColor}-2)`,
      }}
    >
      <Stack gap='lg'>
        {/* Team Header */}
        <Group justify={align === 'right' ? 'flex-end' : 'space-between'} align='center'>
          {align === 'left' && (
            <Group align='center' gap='sm'>
              <ThemeIcon size={40} radius='xl' color={teamColor} variant='filled'>
                <IconBallFootball size={20} />
              </ThemeIcon>
              <Text size='xl' fw={800} c={`${teamColor}.8`}>
                {team.name || `Team ${teamIndex}`}
              </Text>
            </Group>
          )}

          {isCreator && (
            <Button
              variant='light'
              color={teamColor}
              size='sm'
              radius='xl'
              leftSection={<IconEdit size={14} />}
              component={Link}
              to={`/teams/edit/${team.id}`}
            >
              Edit Squad
            </Button>
          )}

          {align === 'right' && (
            <Group align='center' gap='sm'>
              <Text size='xl' fw={800} c={`${teamColor}.8`}>
                {team.name || `Team ${teamIndex}`}
              </Text>
              <ThemeIcon size={40} radius='xl' color={teamColor} variant='filled'>
                <IconBallFootball size={20} />
              </ThemeIcon>
            </Group>
          )}
        </Group>

        {/* Squad List */}
        <Stack gap='md'>
          <Group align='center' gap='sm' justify={align === 'right' ? 'flex-end' : 'flex-start'}>
            <ThemeIcon size={20} radius='xl' color={teamColor} variant='light'>
              <IconShirt size={12} />
            </ThemeIcon>
            <Text size='sm' fw={700} c='gray.7' tt='uppercase'>
              Squad ({team.players.length})
            </Text>
          </Group>

          <Players team={team} rtl={align === 'right'} status={status} teamColor={teamColor} />
        </Stack>
      </Stack>
    </Paper>
  );
}

// Players Component
function Players({
  team,
  rtl,
  status,
  teamColor,
}: {
  team: FindOneMatchResponse['teams'][number];
  rtl?: boolean;
  status: FindOneMatchResponse['status'];
  teamColor: string;
}) {
  return (
    <Stack gap='sm'>
      {team.players.map((player, index) => (
        <Paper
          key={player.id}
          p='md'
          radius='lg'
          withBorder
          style={{
            backgroundColor: player.isCaptain ? 'var(--mantine-color-yellow-0)' : 'white',
            border: player.isCaptain
              ? '2px solid var(--mantine-color-yellow-3)'
              : '1px solid var(--mantine-color-gray-3)',
            position: 'relative',
          }}
        >
          {/* Jersey Number */}
          <Box
            style={{
              position: 'absolute',
              top: rem(-8),
              [rtl ? 'right' : 'left']: rem(12),
              width: rem(24),
              height: rem(24),
              borderRadius: '50%',
              background: `var(--mantine-color-${teamColor}-6)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
            }}
          >
            <Text size='xs' fw={900} c='white'>
              {index + 1}
            </Text>
          </Box>

          <Group justify='space-between' align='center' style={{ flexDirection: rtl ? 'row-reverse' : 'row' }}>
            <Group gap='sm' style={{ flexDirection: rtl ? 'row-reverse' : 'row' }}>
              {/* Captain Badge */}
              {player.isCaptain && (
                <Tooltip label='Team Captain'>
                  <ThemeIcon size={20} radius='xl' color='yellow' variant='filled'>
                    <IconCrown size={10} />
                  </ThemeIcon>
                </Tooltip>
              )}

              {/* Player Info */}
              <Box style={{ textAlign: rtl ? 'right' : 'left' }}>
                {player.user === null ? (
                  <Text fw={600} c='gray.8'>
                    {player.name}
                  </Text>
                ) : (
                  <Anchor component={Link} to={`/users/${player.user.username}`} style={{ textDecoration: 'none' }}>
                    <Text fw={600} c={`${teamColor}.7`}>
                      {player.name}
                    </Text>
                  </Anchor>
                )}

                {player.positions.length > 0 && (
                  <Group gap={4} justify={rtl ? 'flex-end' : 'flex-start'} mt={2}>
                    {player.positions.slice(0, 2).map((position, idx) => (
                      <Badge key={idx} size='xs' variant='light' color={teamColor}>
                        {position}
                      </Badge>
                    ))}
                    {player.positions.length > 2 && (
                      <Badge size='xs' variant='outline' color='gray'>
                        +{player.positions.length - 2}
                      </Badge>
                    )}
                  </Group>
                )}
              </Box>
            </Group>

            {/* Match Stats */}
            {status !== MatchStatus.enum.PENDING && (
              <Group gap='md'>
                <Tooltip label='Goals'>
                  <Group gap='xs'>
                    <ThemeIcon size={18} radius='xl' color='blue' variant='light'>
                      <IconBallFootball size={10} />
                    </ThemeIcon>
                    <Text size='sm' fw={600} c='blue.7'>
                      {player.goals}
                    </Text>
                  </Group>
                </Tooltip>

                <Tooltip label='Assists'>
                  <Group gap='xs'>
                    <ThemeIcon size={18} radius='xl' color='violet' variant='light'>
                      <IconHandGrab size={10} />
                    </ThemeIcon>
                    <Text size='sm' fw={600} c='violet.7'>
                      {player.assists}
                    </Text>
                  </Group>
                </Tooltip>
              </Group>
            )}
          </Group>
        </Paper>
      ))}
    </Stack>
  );
}
