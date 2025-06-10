import { useForm } from '@mantine/form';
import { Button, Group, Paper, Stack, Title, ThemeIcon, Text, Box, rem } from '@mantine/core';
import { IconTrophy, IconBallFootball } from '@tabler/icons-react';
import type { FindAllMatchesResponse } from '../api/matches/matches.responses';
import { useCompleteMatch } from '../api/matches/matches.mutations';
import { completeMatchSchema, type CompleteMatchSchema } from '../schemas/matches.schema';
import RatingInput from './match-inputs/rating-input';
import GoalsInput from './match-inputs/goals.input';
import AssistsInput from './match-inputs/assists.input';
import WeatherConditionInput from './match-inputs/weather-condition';
import DurationInput from './match-inputs/duration.input';
import { zodResolver } from 'mantine-form-zod-resolver';

interface CompleteMatchModalProps {
  match: FindAllMatchesResponse;
}

export default function CompleteMatchModal({ match }: CompleteMatchModalProps) {
  const form = useForm<CompleteMatchSchema>({
    initialValues: {
      duration: match.duration ?? 90,
      weatherCondition: match.weatherCondition,
      teams: match.teams.map((team) => ({
        name: team.name,
        players: team.players.map((player) => ({
          id: player.id,
          name: player.name,
          isCaptain: player.isCaptain,
          positions: player.positions,
          goals: 0,
          assists: 0,
          rating: null,
        })),
      })),
    },
    validate: zodResolver(completeMatchSchema),
  });

  const mutation = useCompleteMatch(match);

  const onSubmit = form.onSubmit(
    (values) => {
      mutation.mutate({
        id: match.id,
        completeMatchSchema: values,
      });
    },
    (err) => {
      console.log(err);
    }
  );

  return (
    <form onSubmit={onSubmit}>
      <Stack gap='xl'>
        {/* Match Details Section */}
        <Paper
          shadow='md'
          radius='xl'
          p='xl'
          style={{
            background: 'linear-gradient(135deg, var(--mantine-color-blue-0) 0%, var(--mantine-color-indigo-0) 100%)',
            border: '2px solid var(--mantine-color-blue-2)',
          }}
        >
          <Group align='center' gap='sm' mb='lg'>
            <ThemeIcon size={32} radius='xl' color='blue' variant='filled'>
              <IconTrophy size={18} />
            </ThemeIcon>
            <Title order={3} fw={700} c='blue.8'>
              Match Details
            </Title>
          </Group>

          <Group grow align='flex-start'>
            <DurationInput form={form} />
            <WeatherConditionInput form={form} />
          </Group>
        </Paper>

        {/* Teams Section */}
        {match.teams.map((team, teamIndex) => (
          <Paper
            key={team.id}
            shadow='lg'
            radius='xl'
            p='xl'
            withBorder
            style={{
              background:
                teamIndex === 0
                  ? 'linear-gradient(135deg, var(--mantine-color-green-0) 0%, var(--mantine-color-teal-0) 100%)'
                  : 'linear-gradient(135deg, var(--mantine-color-orange-0) 0%, var(--mantine-color-red-0) 100%)',
              border: `2px solid var(--mantine-color-${teamIndex === 0 ? 'green' : 'orange'}-2)`,
            }}
          >
            <Group align='center' gap='sm' mb='xl'>
              <ThemeIcon size={40} radius='xl' color={teamIndex === 0 ? 'green' : 'orange'} variant='filled'>
                <IconBallFootball size={20} />
              </ThemeIcon>
              <Title order={3} fw={700} c={`${teamIndex === 0 ? 'green' : 'orange'}.8`}>
                {team.name || `Team ${teamIndex + 1}`}
              </Title>
            </Group>

            <Stack gap='lg'>
              {team.players.map((player, playerIndex) => (
                <Paper
                  key={player.id}
                  p='lg'
                  radius='lg'
                  withBorder
                  style={{
                    backgroundColor: 'white',
                    border: '2px solid var(--mantine-color-gray-2)',
                  }}
                >
                  <Stack gap='md'>
                    {/* Player Header */}
                    <Group align='center' gap='sm'>
                      <Box
                        style={{
                          backgroundColor: `var(--mantine-color-${teamIndex === 0 ? 'green' : 'orange'}-1)`,
                          borderRadius: '50%',
                          padding: rem(8),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text size='sm' fw={700} c={`${teamIndex === 0 ? 'green' : 'orange'}.7`}>
                          #{playerIndex + 1}
                        </Text>
                      </Box>

                      <Box>
                        <Text size='lg' fw={700} c='gray.8'>
                          {player.name}
                        </Text>
                        {player.isCaptain && (
                          <Text size='xs' fw={600} c='yellow.7' tt='uppercase'>
                            Team Captain
                          </Text>
                        )}
                      </Box>
                    </Group>

                    {/* Player Stats */}
                    <Group grow align='flex-start'>
                      <GoalsInput
                        form={form}
                        field={`teams.${teamIndex}.players.${playerIndex}.goals`}
                        compact={true}
                      />
                      <AssistsInput
                        form={form}
                        field={`teams.${teamIndex}.players.${playerIndex}.assists`}
                        compact={true}
                      />
                      <RatingInput
                        form={form}
                        field={`teams.${teamIndex}.players.${playerIndex}.rating`}
                        compact={true}
                      />
                    </Group>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Paper>
        ))}

        {/* Submit Button */}
        <Paper
          shadow='lg'
          radius='xl'
          p='lg'
          style={{
            background: 'linear-gradient(135deg, var(--mantine-color-green-0) 0%, white 100%)',
            border: '2px solid var(--mantine-color-green-2)',
          }}
        >
          <Button
            type='submit'
            loading={mutation.isPending}
            size='xl'
            radius='xl'
            fullWidth
            variant='gradient'
            gradient={{ from: 'green', to: 'teal' }}
            leftSection={<IconTrophy size={24} />}
            style={{
              height: rem(60),
              fontSize: rem(18),
              fontWeight: 700,
              boxShadow: '0 8px 16px rgba(34, 197, 94, 0.3)',
            }}
          >
            Complete Match & Record Results
          </Button>
        </Paper>
      </Stack>
    </form>
  );
}
