import { useForm } from '@mantine/form';
import { Card, Text, Box, Group, Stack, ActionIcon, ThemeIcon, Paper, rem, Container } from '@mantine/core';
import { Button } from '@mantine/core';
import { IconPlus, IconTrash, IconUsers, IconEdit, IconDeviceFloppy, IconX } from '@tabler/icons-react';
import type { FindOneTeamResponse } from '../api/teams/teams.response';
import { updateTeamSchema, type UpdateTeamSchema } from '../schemas/teams.schema';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useUpdateTeam } from '../api/teams/teams.mutations';
import { modals } from '@mantine/modals';
import { useNavigate } from 'react-router-dom';
import { MatchStatus } from '../schemas/entities/match.entity';
import PlayerInput from './match-inputs/player-input';
import PositionsInput from './match-inputs/positions.input';
import TeamNameInput from './match-inputs/team-name.input';
import GoalsInput from './match-inputs/goals.input';
import AssistsInput from './match-inputs/assists.input';
import IsCaptainInput from './match-inputs/is-captain.input';

interface EditTeamFormProps {
  team: FindOneTeamResponse;
  status: (typeof MatchStatus.options)[number];
}

export default function EditTeamForm({ team, status }: EditTeamFormProps) {
  const mutation = useUpdateTeam(team.matchId);
  const navigate = useNavigate();
  const isResult = status !== MatchStatus.enum.PENDING;

  const form = useForm<UpdateTeamSchema>({
    initialValues: {
      name: team.name || '',
      players: team.players.map((player) => ({
        id: player.id,
        name: player.name,
        positions: player.positions,
        isCaptain: player.isCaptain,
        goals: player.goals,
        assists: player.assists,
        userId: player.userId,
      })),
      deletedPlayers: [],
    },
    validate: zodResolver(updateTeamSchema),
  });

  function onCancel() {
    form.reset();
    navigate(`/matches/edit/${team.matchId}`);
  }

  const openDeletePlayerConfirmModal = (playerId: string, playerName: string) => {
    return modals.openConfirmModal({
      title: 'Remove Player from Squad',
      children: (
        <Text>
          Are you sure you want to remove <strong>{playerName}</strong> from the team? This action cannot be undone.
        </Text>
      ),
      labels: {
        confirm: 'Remove Player',
        cancel: 'Keep Player',
      },
      confirmProps: {
        color: 'red',
        variant: 'filled',
      },
      cancelProps: {
        variant: 'light',
      },
      zIndex: 10000,
      onConfirm: () => {
        const deletedPlayers = [...(form.getValues().deletedPlayers || [])];
        deletedPlayers.push(playerId);
        form.setFieldValue('deletedPlayers', [...new Set(deletedPlayers)]);
        form.setFieldValue(
          'players',
          form.getValues().players.filter((player) => player.id !== playerId)
        );
      },
    });
  };

  const handleSubmit = form.onSubmit((values) => {
    mutation.mutate({
      id: team.id,
      updateTeamSchema: values,
    });
  });

  const currentPlayers = form.getValues().players;

  return (
    <Container size='lg' py='xl'>
      <Box component='form' onSubmit={handleSubmit}>
        <Stack gap='xl'>
          {/* Header */}
          <Paper
            shadow='xl'
            radius='xl'
            p='xl'
            style={{
              background: 'linear-gradient(135deg, var(--mantine-color-orange-6) 0%, var(--mantine-color-red-6) 100%)',
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
                width: '200px',
                height: '100px',
                background:
                  "url(\"data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.1'%3E%3Ccircle cx='15' cy='15' r='2'/%3E%3C/g%3E%3C/svg%3E\")",
                opacity: 0.3,
              }}
            />

            <Group align='center' gap='lg'>
              <ThemeIcon
                size={60}
                radius='xl'
                color='white'
                variant='white'
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                <IconEdit size={30} />
              </ThemeIcon>

              <Box>
                <Text size='xl' fw={900} mb='sm'>
                  Edit Team Squad
                </Text>
                <Text size='lg' opacity={0.9}>
                  Modify team lineup and player details
                </Text>
              </Box>
            </Group>
          </Paper>

          {/* Team Name Section */}
          <Card shadow='md' radius='xl' p='xl' withBorder>
            <Group align='center' gap='sm' mb='lg'>
              <ThemeIcon size={32} radius='xl' color='blue' variant='light'>
                <IconUsers size={18} />
              </ThemeIcon>
              <Text size='lg' fw={700} c='gray.8' tt='uppercase'>
                Team Information
              </Text>
            </Group>

            <TeamNameInput form={form} field='name' />
          </Card>

          {/* Players Section */}
          <Card shadow='md' radius='xl' p='xl' withBorder>
            <Group justify='space-between' align='center' mb='xl'>
              <Group align='center' gap='sm'>
                <ThemeIcon size={32} radius='xl' color='green' variant='light'>
                  <IconUsers size={18} />
                </ThemeIcon>
                <Box>
                  <Text size='lg' fw={700} c='gray.8' tt='uppercase'>
                    Team Squad
                  </Text>
                  <Text size='sm' c='gray.6'>
                    {currentPlayers.length} {currentPlayers.length === 1 ? 'player' : 'players'} registered
                  </Text>
                </Box>
              </Group>

              <Button
                leftSection={<IconPlus size={18} />}
                variant='gradient'
                gradient={{ from: 'blue', to: 'indigo' }}
                size='lg'
                radius='xl'
                onClick={() => {
                  form.insertListItem('players', {
                    id: '',
                    name: '',
                    positions: [],
                    isCaptain: false,
                    goals: 0,
                    assists: 0,
                    userId: null,
                  });
                }}
              >
                Add Player
              </Button>
            </Group>

            <Stack gap='lg'>
              {currentPlayers.length === 0 ? (
                <Paper
                  p='xl'
                  radius='xl'
                  style={{
                    textAlign: 'center',
                    background:
                      'linear-gradient(135deg, var(--mantine-color-gray-0) 0%, var(--mantine-color-gray-1) 100%)',
                    border: '3px dashed var(--mantine-color-gray-4)',
                  }}
                >
                  <Stack align='center' gap='md'>
                    <ThemeIcon size={60} radius='xl' color='gray' variant='light'>
                      <IconUsers size={30} />
                    </ThemeIcon>
                    <Text size='lg' fw={600} c='gray.7'>
                      No players in squad
                    </Text>
                    <Text c='gray.6'>Add players to build your team</Text>
                  </Stack>
                </Paper>
              ) : (
                currentPlayers.map((player, index) => {
                  const isCaptain = player.isCaptain;

                  return (
                    <Paper
                      key={player.id || index}
                      shadow='lg'
                      radius='xl'
                      p='xl'
                      withBorder
                      style={{
                        background: isCaptain
                          ? 'linear-gradient(135deg, var(--mantine-color-yellow-0) 0%, var(--mantine-color-orange-0) 100%)'
                          : 'linear-gradient(135deg, white 0%, var(--mantine-color-gray-0) 100%)',
                        border: isCaptain
                          ? '2px solid var(--mantine-color-yellow-4)'
                          : '2px solid var(--mantine-color-gray-3)',
                        position: 'relative',
                      }}
                    >
                      {/* Player Number */}
                      <Box
                        style={{
                          position: 'absolute',
                          top: rem(-12),
                          left: rem(20),
                          width: rem(32),
                          height: rem(32),
                          borderRadius: '50%',
                          background:
                            'linear-gradient(135deg, var(--mantine-color-blue-6) 0%, var(--mantine-color-indigo-6) 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                          zIndex: 1,
                        }}
                      >
                        <Text size='sm' fw={900} c='white'>
                          {index + 1}
                        </Text>
                      </Box>

                      {/* Captain Badge */}
                      {isCaptain && (
                        <Box
                          style={{
                            position: 'absolute',
                            top: rem(-8),
                            right: rem(20),
                            background:
                              'linear-gradient(135deg, var(--mantine-color-yellow-5) 0%, var(--mantine-color-orange-5) 100%)',
                            borderRadius: rem(16),
                            padding: `${rem(4)} ${rem(12)}`,
                            color: 'white',
                            fontSize: rem(10),
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            zIndex: 1,
                          }}
                        >
                          Captain
                        </Box>
                      )}

                      <Stack gap='lg' pt='sm'>
                        {/* Player Basic Info */}
                        <Stack gap='md'>
                          <PlayerInput
                            form={form}
                            field={`players.${index}`}
                            label='Player Name'
                            required
                            playerIds={
                              form
                                .getValues()
                                .players.map((player) => player.userId)
                                .filter((id) => typeof id === 'string') as string[]
                            }
                          />

                          <PositionsInput form={form} field={`players.${index}.positions`} />
                        </Stack>

                        {/* Match Stats - Only for completed matches */}
                        {isResult && (
                          <Paper
                            p='md'
                            radius='lg'
                            style={{
                              background:
                                'linear-gradient(135deg, var(--mantine-color-green-0) 0%, var(--mantine-color-teal-0) 100%)',
                              border: '1px solid var(--mantine-color-green-2)',
                            }}
                          >
                            <Group align='center' gap='sm' mb='md'>
                              <ThemeIcon size={20} radius='xl' color='green' variant='light'>
                                <IconEdit size={12} />
                              </ThemeIcon>
                              <Text size='sm' fw={600} c='green.7' tt='uppercase'>
                                Match Statistics
                              </Text>
                            </Group>

                            <Group grow>
                              <GoalsInput form={form} field={`players.${index}.goals`} />
                              <AssistsInput form={form} field={`players.${index}.assists`} />
                            </Group>
                          </Paper>
                        )}

                        {/* Player Actions */}
                        <Group
                          justify='space-between'
                          align='center'
                          pt='md'
                          style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}
                        >
                          <IsCaptainInput form={form} field={`players.${index}.isCaptain`} />

                          <ActionIcon
                            variant='filled'
                            color='red'
                            size='xl'
                            radius='xl'
                            onClick={() => openDeletePlayerConfirmModal(player.id, player.name)}
                            style={{
                              boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)',
                            }}
                          >
                            <IconTrash size={18} />
                          </ActionIcon>
                        </Group>
                      </Stack>
                    </Paper>
                  );
                })
              )}
            </Stack>
          </Card>

          {/* Action Buttons */}
          <Paper
            shadow='lg'
            radius='xl'
            p='lg'
            style={{
              background: 'linear-gradient(135deg, var(--mantine-color-gray-0) 0%, white 100%)',
              border: '2px solid var(--mantine-color-gray-2)',
            }}
          >
            <Group justify='flex-end' gap='md'>
              <Button
                variant='light'
                color='gray'
                size='lg'
                radius='xl'
                leftSection={<IconX size={18} />}
                onClick={onCancel}
              >
                Cancel Changes
              </Button>

              <Button
                type='submit'
                loading={mutation.isPending}
                variant='gradient'
                gradient={{ from: 'orange', to: 'red' }}
                size='lg'
                radius='xl'
                leftSection={<IconDeviceFloppy size={18} />}
                style={{
                  boxShadow: '0 4px 8px rgba(249, 115, 22, 0.3)',
                }}
              >
                Save Team Changes
              </Button>
            </Group>
          </Paper>
        </Stack>
      </Box>
    </Container>
  );
}
