/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { updateMatchSchema, type UpdateMatchSchema } from '../schemas/matches.schema';
import { Button, Group, Paper, Stack, Text, Title, Grid, Box, ThemeIcon, rem, Flex } from '@mantine/core';
import { MatchStatus } from '../schemas/entities/match.entity';
import { Link, useNavigate } from 'react-router-dom';
import type { FindOneMatchResponse } from '../api/matches/matches.responses';
import { useUpdateMatch } from '../api/matches/matches.mutations';
import WeatherConditionInput from './match-inputs/weather-condition';
import DurationInput from './match-inputs/duration.input';
import StartTimeInput from './match-inputs/start-time.input';
import MatchDescriptionInput from './match-inputs/match-description.input';
import { VenueInput } from './venue-input';
import { IconBallFootball, IconCalendarEvent, IconTrophy } from '@tabler/icons-react';

interface EditMatchFormProps {
  match: FindOneMatchResponse;
}

export default function EditMatchForm({ match }: EditMatchFormProps) {
  const form = useForm<UpdateMatchSchema>({
    initialValues: {
      status: match?.status ?? MatchStatus.enum.PENDING,
      isPrivate: match?.isPrivate ?? false,
      startTime: match?.startTime ? new Date(match.startTime) : new Date(),
      duration: match?.duration ?? 60,
      description: match?.description ?? '',
      venueId: match?.venueId ?? undefined,
      venueName: match?.venueName ?? '',
      weatherCondition: match?.weatherCondition ?? undefined,
    },
    validate: zodResolver(updateMatchSchema),
  });
  const navigate = useNavigate();
  const isResult = match.status === MatchStatus.enum.COMPLETED;

  const mutation = useUpdateMatch();

  const onSubmit = form.onSubmit(
    (values) => {
      mutation.mutate({
        id: match.id,
        updateMatchSchema: values,
      });
    },
    (errors) => {
      console.log(errors);
    }
  );

  return (
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
                Edit {isResult ? 'Match Result' : 'Match Fixture'}
              </Title>
              <Text size='lg' opacity={0.9}>
                {isResult ? 'Edit the outcome of a completed match' : 'Edit the fixture of an upcoming football match'}
              </Text>
            </Box>
          </Group>
        </Paper>

        <Paper shadow='sm' p='md' withBorder>
          <Stack gap='md'>
            <MatchDescriptionInput form={form} />

            <Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <StartTimeInput form={form} status={form.getValues().status} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <DurationInput form={form} />
              </Grid.Col>
            </Grid>

            <WeatherConditionInput form={form} />
            <VenueInput form={form} />
          </Stack>
        </Paper>

        <Stack gap='md'>
          <Title order={6}>Teams</Title>
          {match!.teams.map((team) => (
            <Paper
              key={team.id}
              shadow='sm'
              p='md'
              withBorder
              radius='md'
              style={{
                background: `linear-gradient(135deg, 
                ${isResult ? 'var(--mantine-color-green-0)' : 'var(--mantine-color-blue-0)'} 0%, 
                white 100%)`,
                border: `2px solid ${isResult ? 'var(--mantine-color-green-2)' : 'var(--mantine-color-blue-2)'}`,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                },
              }}
            >
              <Group justify='space-between' align='center'>
                <Group gap='md'>
                  <ThemeIcon size={40} radius='xl' variant='light' color={isResult ? 'green' : 'blue'}>
                    <IconBallFootball size={24} />
                  </ThemeIcon>
                  <Text fw={600} size='lg'>
                    {team.name || 'Team ' + (match.teams.indexOf(team) + 1)}
                  </Text>
                </Group>
                <Button
                  type='button'
                  component={Link}
                  to={`/teams/edit/${team.id}`}
                  variant='gradient'
                  gradient={{
                    from: isResult ? 'green' : 'blue',
                    to: isResult ? 'teal' : 'indigo',
                  }}
                  radius='xl'
                >
                  Edit Team
                </Button>
              </Group>
            </Paper>
          ))}
        </Stack>

        <Paper
          radius='xl'
          p='lg'
          style={{
            background: `linear-gradient(135deg, 
                ${isResult ? 'var(--mantine-color-green-0)' : 'var(--mantine-color-blue-0)'} 0%, 
                white 100%)`,
            border: `2px solid ${isResult ? 'var(--mantine-color-green-2)' : 'var(--mantine-color-blue-2)'}`,
          }}
        >
          <Flex
            justify='flex-end'
            gap='md'
            align='center'
            sx={(_, u) => ({
              [u.smallerThan('xs')]: {
                flexDirection: 'column-reverse',
              },
            })}
          >
            <Button
              size='lg'
              radius='xl'
              type='button'
              variant='gradient'
              gradient={{
                from: 'gray.1',
                to: 'gray.2',
              }}
              c='black'
              onClick={() => navigate(-1 as any, { replace: true })}
            >
              Cancel
            </Button>
            {/* Submit Button */}
            <Button
              loading={mutation.isPending}
              type='submit'
              size='xl'
              radius='xl'
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
          </Flex>
        </Paper>
      </Stack>
    </form>
  );
}
