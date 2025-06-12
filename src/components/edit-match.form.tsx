import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { updateMatchSchema, type UpdateMatchSchema } from '../schemas/matches.schema';
import { Button, Group, Paper, Stack, Text, Title, Grid } from '@mantine/core';
import { MatchStatus } from '../schemas/entities/match.entity';
import { Link } from 'react-router-dom';
import type { FindOneMatchResponse } from '../api/matches/matches.responses';
import { useUpdateMatch } from '../api/matches/matches.mutations';
import WeatherConditionInput from './match-inputs/weather-condition';
import DurationInput from './match-inputs/duration.input';
import StartTimeInput from './match-inputs/start-time.input';
import MatchDescriptionInput from './match-inputs/match-description.input';
import { VenueInput } from './venue-input';

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
        <Title order={2}>Edit Match</Title>

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
            <Paper key={team.id} shadow='sm' p='md' withBorder>
              <Group justify='space-between' align='center'>
                <Text>{team.name || 'Team ' + (match.teams.indexOf(team) + 1)}</Text>
                <Button type='button' component={Link} to={`/teams/edit/${team.id}`} variant='light'>
                  Edit Team
                </Button>
              </Group>
            </Paper>
          ))}
        </Stack>

        <Group justify='flex-end' gap='md'>
          <Button
            variant='default'
            component={Link}
            to={match.status === MatchStatus.enum.PENDING ? '/fixture' : '/results'}
          >
            Cancel
          </Button>
          <Button type='submit' loading={mutation.isPending}>
            Save Changes
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
