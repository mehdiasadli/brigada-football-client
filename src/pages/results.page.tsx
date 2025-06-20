import { Stack, Box } from '@mantine/core';
import { useMatches } from '../api/matches/matches.queries';
import InfiniteList from '../components/infinite-list';
import { MatchStatus } from '../schemas/entities/match.entity';
import ResultCard from '../components/result-card';
import ResultsHeader from '../components/results-header';

export default function ResultsPage() {
  const result = useMatches(
    {
      limit: 10,
    },
    {
      orderDir: 'desc',
      orderBy: 'startTime',
    },
    {
      status: MatchStatus.enum.COMPLETED,
    }
  );

  return (
    <Box
      style={{
        minHeight: '100vh',
      }}
    >
      <Stack gap='xl'>
        <ResultsHeader />

        <InfiniteList
          result={result}
          cols={{ base: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
          render={(match) => <ResultCard match={match} />}
        />
      </Stack>
    </Box>
  );
}
