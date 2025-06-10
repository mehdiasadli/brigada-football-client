import { Group, Stack, Paper, Text, Box, ActionIcon, Badge, rem, ThemeIcon, SimpleGrid } from '@mantine/core';
import {
  IconTrash,
  IconUserPlus,
  IconBallFootball,
  IconTrophy,
  IconUsersGroup,
  IconShirt,
  IconCrown,
  IconPlayerPlay,
} from '@tabler/icons-react';
import IsCaptainInput from './match-inputs/is-captain.input';
import TeamNameInput from './match-inputs/team-name.input';
import GoalsInput from './match-inputs/goals.input';
import AssistsInput from './match-inputs/assists.input';
import RatingInput from './match-inputs/rating-input';
import PositionsInput from './match-inputs/positions.input';
import PlayerInput from './match-inputs/player-input';
import type { UseFormReturnType } from '@mantine/form';
import type { PlayerSchema } from '../schemas/entities/player.entity';

interface PlayersViewProps {
  teamIndex: 1 | 2;
  form: UseFormReturnType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  isResult: boolean;
}

export default function PlayersView({ teamIndex, form, isResult }: PlayersViewProps) {
  const team = teamIndex === 1 ? 'team1' : 'team2';
  const currentPlayers = form.getValues()[team].players as PlayerSchema[];
  const teamName = form.getValues()[team].name;

  const addPlayer = (teamIndex: 1 | 2) => {
    const team = teamIndex === 1 ? 'team1' : 'team2';
    const basePlayer = {
      name: '',
      isCaptain: false,
      positions: [],
      userId: undefined,
    };

    const player = isResult ? { ...basePlayer, goals: 0, assists: 0, rating: 5 } : basePlayer;

    form.insertListItem(`${team}.players`, player);
  };

  const removePlayer = (teamIndex: 1 | 2, index: number) => {
    const team = teamIndex === 1 ? 'team1' : 'team2';
    form.removeListItem(`${team}.players`, index);
  };

  const teamColor = teamIndex === 1 ? 'blue' : 'green';
  const teamColorShade = teamIndex === 1 ? 'var(--mantine-color-blue-6)' : 'var(--mantine-color-green-6)';

  return (
    <Stack gap='xl'>
      {/* Team Header - Soccer Stadium Style */}
      <Paper
        shadow='md'
        radius='xl'
        p='xl'
        style={{
          background: `linear-gradient(135deg, ${teamColorShade}15 0%, ${teamColorShade}05 100%)`,
          border: `2px solid ${teamColorShade}30`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Soccer field pattern background */}
        <Box
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100px',
            height: '100px',
            background: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${teamColorShade.replace('#', '%23')}' fill-opacity='0.1'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
            opacity: 0.3,
          }}
        />

        <Group align='center' gap='lg' mb='lg'>
          <ThemeIcon
            size={60}
            radius='xl'
            color={teamColor}
            variant='gradient'
            gradient={{ from: teamColor, to: teamIndex === 1 ? 'cyan' : 'teal' }}
          >
            <IconBallFootball size={30} />
          </ThemeIcon>

          <Box style={{ flex: 1 }}>
            <Group align='center' gap='md'>
              <Text size='xl' fw={800} c={`${teamColor}.8`}>
                Team {teamIndex}
              </Text>
              <Badge size='lg' variant='gradient' gradient={{ from: teamColor, to: teamIndex === 1 ? 'cyan' : 'teal' }}>
                {currentPlayers.length} Squad
              </Badge>
            </Group>
            {teamName && (
              <Text size='md' fw={600} c='gray.7' mt={4}>
                "{teamName}"
              </Text>
            )}
          </Box>
        </Group>

        <TeamNameInput form={form} field={`${team}.name`} />
      </Paper>

      {/* Squad List */}
      <Stack gap='lg'>
        {currentPlayers.length === 0 ? (
          <Paper
            p='xl'
            radius='xl'
            style={{
              textAlign: 'center',
              background: 'linear-gradient(135deg, var(--mantine-color-gray-0) 0%, var(--mantine-color-gray-1) 100%)',
              border: '3px dashed var(--mantine-color-gray-4)',
            }}
          >
            <Stack align='center' gap='md'>
              <ThemeIcon size={80} radius='xl' color='gray' variant='light'>
                <IconUsersGroup size={40} />
              </ThemeIcon>
              <Text size='xl' fw={700} c='gray.7'>
                No players in squad
              </Text>
              <Text c='gray.6' size='md'>
                Build your team by adding players
              </Text>
            </Stack>
          </Paper>
        ) : (
          currentPlayers.map((player, index) => {
            const isCaptain = player.isCaptain;
            const playerNumber = index + 1;

            return (
              <Paper
                key={index}
                shadow='lg'
                radius='xl'
                p='xl'
                style={{
                  background: isCaptain
                    ? 'linear-gradient(135deg, var(--mantine-color-yellow-0) 0%, var(--mantine-color-orange-0) 100%)'
                    : 'linear-gradient(135deg, white 0%, var(--mantine-color-gray-0) 100%)',
                  border: isCaptain
                    ? '3px solid var(--mantine-color-yellow-4)'
                    : '2px solid var(--mantine-color-gray-3)',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                }}
              >
                {/* Player Jersey Number */}
                <Box
                  style={{
                    position: 'absolute',
                    top: rem(-15),
                    left: rem(20),
                    width: rem(40),
                    height: rem(40),
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${teamColorShade} 0%, ${teamColorShade} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    zIndex: 2,
                  }}
                >
                  <Text size='lg' fw={900} c='white'>
                    {playerNumber}
                  </Text>
                </Box>

                {/* Captain Crown */}
                {isCaptain && (
                  <Box
                    style={{
                      position: 'absolute',
                      top: rem(-12),
                      right: rem(20),
                      background:
                        'linear-gradient(135deg, var(--mantine-color-yellow-5) 0%, var(--mantine-color-orange-5) 100%)',
                      borderRadius: rem(20),
                      padding: `${rem(6)} ${rem(12)}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: rem(4),
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                      zIndex: 2,
                    }}
                  >
                    <IconCrown size={14} color='white' />
                    <Text size='xs' fw={800} c='white'>
                      CAPTAIN
                    </Text>
                  </Box>
                )}

                <Stack gap='xl' pt='md'>
                  {/* Player Identity Section */}
                  <Stack gap='md'>
                    <Group align='center' gap='sm' mb='sm'>
                      <ThemeIcon size={24} radius='xl' color={teamColor} variant='light'>
                        <IconPlayerPlay size={14} />
                      </ThemeIcon>
                      <Text size='sm' fw={700} c='gray.7' tt='uppercase'>
                        Player Information
                      </Text>
                    </Group>

                    <PlayerInput
                      form={form}
                      field={`${team}.players.${index}`}
                      label='Full Name'
                      required
                      playerIds={
                        [
                          ...form.getValues()['team1']['players'].map((player: PlayerSchema) => player.userId),
                          ...form.getValues()['team2']['players'].map((player: PlayerSchema) => player.userId),
                        ].filter((id) => typeof id === 'string') as string[]
                      }
                    />

                    <PositionsInput form={form} field={`${team}.players.${index}.positions`} />
                  </Stack>

                  {/* Match Performance Section - Only for Results */}
                  {isResult && (
                    <Stack gap='md'>
                      <Group align='center' gap='sm' mb='sm'>
                        <ThemeIcon size={24} radius='xl' color='orange' variant='light'>
                          <IconTrophy size={14} />
                        </ThemeIcon>
                        <Text size='sm' fw={700} c='gray.7' tt='uppercase'>
                          Match Performance
                        </Text>
                      </Group>

                      <SimpleGrid cols={{ base: 1, sm: 2 }}>
                        <GoalsInput form={form} field={`${team}.players.${index}.goals`} />
                        <AssistsInput form={form} field={`${team}.players.${index}.assists`} />
                        <RatingInput form={form} field={`${team}.players.${index}.rating`} />
                      </SimpleGrid>
                    </Stack>
                  )}

                  {/* Player Actions */}
                  <Group
                    justify='space-between'
                    align='center'
                    pt='md'
                    style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}
                  >
                    {/* Player Stats */}
                    <Group gap='sm'>
                      <Badge variant='light' color='gray' size='md' leftSection={<IconShirt size={12} />}>
                        Squad #{playerNumber}
                      </Badge>

                      {player.positions && player.positions.length > 0 && (
                        <Group gap={4}>
                          {player.positions.slice(0, 2).map((position, idx) => (
                            <Badge key={idx} variant='filled' color={teamColor} size='sm'>
                              {position}
                            </Badge>
                          ))}
                          {player.positions.length > 2 && (
                            <Badge variant='outline' color='gray' size='sm'>
                              +{player.positions.length - 2}
                            </Badge>
                          )}
                        </Group>
                      )}
                    </Group>

                    {/* Captain & Remove Actions */}
                    <Group gap='md'>
                      <IsCaptainInput form={form} field={`${team}.players.${index}.isCaptain`} compact={true} />

                      <ActionIcon
                        variant='filled'
                        color='red'
                        size='xl'
                        radius='xl'
                        onClick={() => removePlayer(teamIndex, index)}
                        aria-label={`Remove player ${index + 1}`}
                        style={{
                          boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <IconTrash size={18} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Stack>
              </Paper>
            );
          })
        )}
      </Stack>

      {/* Add Player Button - Stadium Style */}
      <Paper
        shadow='md'
        radius='xl'
        p='lg'
        style={{
          background: `linear-gradient(135deg, ${teamColorShade}10 0%, transparent 100%)`,
          border: `2px dashed ${teamColorShade}60`,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          textAlign: 'center',
        }}
        onClick={() => addPlayer(teamIndex)}
      >
        <Group justify='center' gap='md'>
          <ThemeIcon size={50} radius='xl' color={teamColor} variant='light'>
            <IconUserPlus size={24} />
          </ThemeIcon>
          <Stack gap={0}>
            <Text size='lg' fw={700} c={`${teamColor}.7`}>
              Add New Player
            </Text>
            <Text size='sm' c='gray.6'>
              Expand Team {teamIndex} squad
            </Text>
          </Stack>
        </Group>
      </Paper>
    </Stack>
  );
}
