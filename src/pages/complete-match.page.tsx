import { useParams } from 'react-router-dom';
import { useMatch } from '../api/matches/matches.queries';
import ErrorComponent from '../components/error-component';
import LoadingComponent from '../components/loading-component';
import CompleteMatch from '../components/complete-match';

export default function CompleteMatchPage() {
  const { matchId } = useParams() as { matchId: string };

  const { data: match, error: matchError } = useMatch(matchId);

  if (matchError) {
    return <ErrorComponent error={matchError} />;
  }

  if (!match || !match.data) {
    return <LoadingComponent />;
  }

  return <CompleteMatch match={match.data} />;
}
