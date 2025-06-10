import { Navigate } from 'react-router-dom';
import { UserRole } from '../schemas/entities/user.entity';
import { useUserStore } from '../stores/user.store';
import CreateMatch from '../components/create-match';
import { MatchStatus } from '../schemas/entities/match.entity';

export default function CreateResultPage() {
  const user = useUserStore((state) => state.user);
  const isUser = user?.role === UserRole.enum.USER;

  if (isUser) {
    return <Navigate to='/results' />;
  }

  return <CreateMatch status={MatchStatus.enum.COMPLETED} />;
}
