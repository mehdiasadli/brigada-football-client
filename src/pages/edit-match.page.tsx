import { useParams } from 'react-router-dom';
import { useMatch } from '../api/matches/matches.queries';
import ErrorComponent from '../components/error-component';
import LoadingComponent from '../components/loading-component';
import { Container } from '@mantine/core';
import EditMatchForm from '../components/edit-match.form';

export default function EditMatchPage() {
  const { matchId } = useParams() as { matchId: string };
  const { data, error } = useMatch(matchId);
  const match = data?.data;

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (!data || !match) {
    return <LoadingComponent />;
  }

  return (
    <Container size='md' py='xl'>
      <EditMatchForm match={match} />
    </Container>
  );
}
