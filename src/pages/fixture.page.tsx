import { Stack, Container, Box } from '@mantine/core';
import { useMatches } from '../api/matches/matches.queries';
import InfiniteList from '../components/infinite-list';
import FixtureCard from '../components/fixture-card';
import { MatchStatus } from '../schemas/entities/match.entity';
import FixturesHeader from '../components/fixtures-header';

export default function FixturePage() {
  const result = useMatches(
    {
      limit: 10,
    },
    {
      orderDir: 'asc',
      orderBy: 'startTime',
    },
    {
      status: MatchStatus.enum.PENDING,
    }
  );

  return (
    <Box
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, var(--mantine-color-blue-0) 0%, var(--mantine-color-gray-0) 100%)',
      }}
    >
      <Container size='xl' py='xl'>
        <Stack gap='xl'>
          <FixturesHeader />

          <InfiniteList
            result={result}
            cols={{ base: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
            render={(match) => <FixtureCard match={match} />}
          />
        </Stack>
      </Container>
    </Box>
  );
}
