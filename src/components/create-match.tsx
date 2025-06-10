import { useForm } from '@mantine/form';
import { createMatchSchema, type CreateMatchSchema } from '../schemas/matches.schema';
import { zodResolver } from 'mantine-form-zod-resolver';
import { Button, Container, Stack, Title, Paper, Text, Box, ThemeIcon, Group, Card, rem } from '@mantine/core';
import { MatchStatus, type MatchSchema } from '../schemas/entities/match.entity';
import { IconBallFootball, IconTrophy, IconCalendarEvent, IconInfoCircle, IconFlag } from '@tabler/icons-react';
import { useCreateMatch } from '../api/matches/matches.mutations';
import z from 'zod';
import WeatherConditionInput from './match-inputs/weather-condition';
import DurationInput from './match-inputs/duration.input';
import StartTimeInput from './match-inputs/start-time.input';
import MatchDescriptionInput from './match-inputs/match-description.input';
import PlayersView from './players-view';
import { notifications } from '@mantine/notifications';

interface CreateMatchProps {
  status: MatchSchema['status'];
}

export default function CreateMatch({ status }: CreateMatchProps) {
  const isResult = status === MatchStatus.enum.COMPLETED;

  const mutation = useCreateMatch();
  const form = useForm<CreateMatchSchema>({
    initialValues: {
      status,
      isPrivate: false,
      startTime:
        status === MatchStatus.enum.COMPLETED ? new Date() : new Date(new Date().setHours(new Date().getHours() + 1)),
      duration: 60,
      description: '',
      venueId: undefined,
      venueName: '',
      weatherCondition: undefined,
      team1: {
        name: '',
        players: [],
      },
      team2: {
        name: '',
        players: [],
      },
    },
    validate: zodResolver(
      createMatchSchema.superRefine((args, ctx) => {
        if (status === MatchStatus.enum.COMPLETED) {
          if (args.team1.players.length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Team 1 must have at least 1 player',
              path: ['team1', 'players', '0', 'name'],
            });
            return z.NEVER;
          }
          if (args.team2.players.length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Team 2 must have at least 1 player',
              path: ['team2', 'players', '0', 'name'],
            });
            return z.NEVER;
          }
        }
      })
    ),
  });

  const onSubmit = form.onSubmit(
    (values) => {
      mutation.mutate(values, {
        onSuccess() {
          form.reset();
        },
      });
    },
    (errors) => {
      // first error
      const firstError = Object.values(errors)[0] as string;

      notifications.show({
        title: 'Error',
        message: firstError,
        color: 'red',
        autoClose: 5000,
      });
    }
  );

  return (
    <Container size='lg' py='xl'>
      <form onSubmit={onSubmit}>
        <Stack gap='xl'>
          {/* Header Section */}
          <Paper
            shadow='xl'
            radius='xl'
            p='xl'
            style={{
              background: `linear-gradient(135deg, 
                ${isResult ? 'var(--mantine-color-green-6)' : 'var(--mantine-color-blue-6)'} 0%, 
                ${isResult ? 'var(--mantine-color-teal-6)' : 'var(--mantine-color-indigo-6)'} 100%)`,
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
                width: '200px',
                height: '100px',
                background:
                  "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E\")",
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
                {isResult ? <IconTrophy size={40} /> : <IconBallFootball size={40} />}
              </ThemeIcon>

              <Box>
                <Title order={1} fw={900} mb='sm'>
                  Create New {isResult ? 'Match Result' : 'Match Fixture'}
                </Title>
                <Text size='lg' opacity={0.9}>
                  {isResult ? 'Record the outcome of a completed match' : 'Schedule an upcoming football match'}
                </Text>
              </Box>
            </Group>
          </Paper>

          {/* Match Details Section */}
          <Card shadow='md' radius='xl' p='xl' withBorder>
            <Group align='center' gap='sm' mb='xl'>
              <ThemeIcon size={32} radius='xl' color='blue' variant='light'>
                <IconInfoCircle size={18} />
              </ThemeIcon>
              <Title order={3} fw={700} c='gray.8'>
                Match Information
              </Title>
            </Group>

            <Stack gap='lg'>
              <MatchDescriptionInput form={form} />

              <Group grow align='flex-start'>
                <StartTimeInput form={form} status={status} />
                <DurationInput form={form} />
              </Group>

              <WeatherConditionInput form={form} />
            </Stack>
          </Card>

          {/* Rules & Guidelines */}
          <Paper
            p='lg'
            radius='lg'
            style={{
              backgroundColor: 'var(--mantine-color-blue-0)',
              border: '2px solid var(--mantine-color-blue-2)',
            }}
          >
            <Group align='center' gap='sm' mb='md'>
              <ThemeIcon size={24} radius='xl' color='blue' variant='filled'>
                <IconFlag size={14} />
              </ThemeIcon>
              <Text size='sm' fw={700} c='blue.8' tt='uppercase'>
                Match Rules & Guidelines
              </Text>
            </Group>

            <Stack gap='xs'>
              <Text size='sm' c='blue.7'>
                • Each team must have at least 1 player to start the match
              </Text>
              <Text size='sm' c='blue.7'>
                • Each team can have only 1 captain (team leader)
              </Text>
              <Text size='sm' c='blue.7'>
                • Team names are optional but recommended for easy identification
              </Text>
              <Text size='sm' c='blue.7'>
                • Players can be linked to user accounts or added as names only
              </Text>
            </Stack>
          </Paper>

          {/* Teams Section */}
          <Stack gap='xl'>
            <Group align='center' gap='sm'>
              <ThemeIcon size={32} radius='xl' color='green' variant='light'>
                <IconBallFootball size={18} />
              </ThemeIcon>
              <Title order={3} fw={700} c='gray.8'>
                Team Squads
              </Title>
            </Group>

            {/* Team Cards */}
            <Box
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
                gap: rem(24),
              }}
            >
              <PlayersView teamIndex={1} form={form} isResult={isResult} />
              <PlayersView teamIndex={2} form={form} isResult={isResult} />
            </Box>
          </Stack>

          {/* Submit Button */}
          <Paper
            shadow='lg'
            radius='xl'
            p='lg'
            style={{
              background: `linear-gradient(135deg, 
                ${isResult ? 'var(--mantine-color-green-0)' : 'var(--mantine-color-blue-0)'} 0%, 
                white 100%)`,
              border: `2px solid ${isResult ? 'var(--mantine-color-green-2)' : 'var(--mantine-color-blue-2)'}`,
            }}
          >
            <Button
              loading={mutation.isPending}
              type='submit'
              size='xl'
              radius='xl'
              fullWidth
              variant='gradient'
              gradient={{
                from: isResult ? 'green' : 'blue',
                to: isResult ? 'teal' : 'indigo',
              }}
              leftSection={isResult ? <IconTrophy size={24} /> : <IconCalendarEvent size={24} />}
              style={{
                height: rem(60),
                fontSize: rem(18),
                fontWeight: 700,
                boxShadow: `0 8px 16px ${isResult ? 'rgba(34, 197, 94, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
              }}
            >
              {isResult ? 'Record Match Result' : 'Schedule Match Fixture'}
            </Button>
          </Paper>
        </Stack>
      </form>
    </Container>
  );
}
