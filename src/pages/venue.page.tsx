import { Link, useParams } from 'react-router-dom';
import { useVenue } from '../api/venues/venues.queries';
import ErrorComponent from '../components/error-component';
import LoadingComponent from '../components/loading-component';
import { Stack, Title, Group, Text, Paper, ThemeIcon, Box, rem, Anchor, SimpleGrid, Badge } from '@mantine/core';
import {
  IconBuildingStadium,
  IconCurrencyManat,
  IconMapPin,
  IconParking,
  IconUser,
  IconWaterpolo,
} from '@tabler/icons-react';
import { Map } from '../components/map';
import FixtureCard from '../components/fixture-card';
import ResultCard from '../components/result-card';
import type { FindAllMatchesResponse } from '../api/matches/matches.responses';
import { MatchStatus } from '../schemas/entities/match.entity';

export default function VenuePage() {
  const { venueId } = useParams() as { venueId: string };
  const { data: venue, error: venueError } = useVenue(venueId);

  if (venueError) {
    return <ErrorComponent error={venueError} />;
  }

  if (!venue || !venue.data) {
    return <LoadingComponent />;
  }

  const fixtures = venue.data.matches.filter((match) => match.status === MatchStatus.enum.PENDING);
  const results = venue.data.matches.filter((match) => match.status === MatchStatus.enum.COMPLETED);

  return (
    <Stack gap='xl'>
      {/* Venue Header */}
      <Paper
        p='xl'
        radius='lg'
        style={{
          background: 'linear-gradient(135deg, var(--mantine-color-green-0) 0%, var(--mantine-color-teal-0) 100%)',
          border: '2px solid var(--mantine-color-green-2)',
        }}
      >
        <Stack gap='md'>
          <Group>
            <Title order={1} c='green.9'>
              {venue.data.name}
            </Title>
          </Group>

          <Group gap='xl'>
            <Group gap='xs'>
              <ThemeIcon size={24} radius='xl' color='blue' variant='light'>
                <IconUser size={14} />
              </ThemeIcon>
              <Group gap={4}>
                <Text size='sm' c='gray.6'>
                  Created by
                </Text>
                <Group gap='xs'>
                  {venue.data.creator === null ? (
                    <Text c='dimmed' fz='sm' sx={{ textDecoration: 'underline' }}>
                      Deleted user
                    </Text>
                  ) : (
                    <Anchor component={Link} to={`/users/${venue.data.creator.username}`}>
                      {venue.data.creator.firstName} {venue.data.creator.lastName}
                    </Anchor>
                  )}
                </Group>
              </Group>
            </Group>
          </Group>

          <Stack gap='md'>
            <Stack gap='xs'>
              <Group gap='xs'>
                <ThemeIcon size={24} radius='xl' color='blue' variant='light'>
                  <IconMapPin size={14} />
                </ThemeIcon>
                <Text>{venue.data.address}</Text>
              </Group>

              {venue.data.addressDescription && (
                <Text size='sm' c='gray.6' ml={34}>
                  {venue.data.addressDescription}
                </Text>
              )}
            </Stack>

            <Group gap='xs'>
              <ThemeIcon size={24} radius='xl' color='green' variant='light'>
                <IconCurrencyManat size={14} />
              </ThemeIcon>
              <Text fw={500}>{venue.data.pricePerHour} AZN per hour</Text>
            </Group>

            <Group gap='md'>
              <Badge
                leftSection={<IconParking size={14} />}
                color={venue.data.hasParking ? 'green' : 'red'}
                variant='light'
              >
                {venue.data.hasParking ? 'Parking Available' : 'No Parking'}
              </Badge>

              <Badge
                leftSection={<IconWaterpolo size={14} />}
                color={venue.data.hasShowers ? 'green' : 'red'}
                variant='light'
              >
                {venue.data.hasShowers ? 'Showers Available' : 'No Showers'}
              </Badge>

              <Badge leftSection={<IconBuildingStadium size={14} />} color='blue' variant='light'>
                {venue.data.type.replace('_', ' ')}
              </Badge>
            </Group>
          </Stack>
        </Stack>
      </Paper>

      {/* Venue Map */}
      <Box style={{ height: rem(400), borderRadius: rem(16), overflow: 'hidden' }}>
        <Map venue={venue.data} style={{ height: '100%', width: '100%' }} />
      </Box>

      {/* Fixtures */}
      {fixtures.length > 0 && (
        <Stack gap='md'>
          <Title order={2} c='gray.8'>
            Fixtures
          </Title>
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            {fixtures.map((match) => (
              <FixtureCard key={match.id} match={match as FindAllMatchesResponse} />
            ))}
          </SimpleGrid>
        </Stack>
      )}

      {/* Completed Matches */}
      {results.length > 0 && (
        <Stack gap='md'>
          <Title order={2} c='gray.8'>
            Completed Matches
          </Title>
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            {results.map((match) => (
              <ResultCard key={match.id} match={match as FindAllMatchesResponse} />
            ))}
          </SimpleGrid>
        </Stack>
      )}
    </Stack>
  );
}
