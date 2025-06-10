import { useFetch } from '../../hooks/use-fetch';
import { statsService } from './stats.service';

export const statsKeys = {
  index: ['stats'] as const,

  leaderboardIndex: () => [...statsKeys.index, 'leaderboard'] as const,
  leaderboard: () => [...statsKeys.leaderboardIndex()] as const,

  userStatsIndex: () => [...statsKeys.index, 'users'] as const,
  userStats: (userId: string) => [...statsKeys.userStatsIndex(), userId] as const,
};

export function useUserStats(userId?: string) {
  return useFetch(statsKeys.userStats(userId!), () => statsService.getUserStats(userId!), {
    enabled: !!userId,
  });
}

export function useLeaderboard() {
  return useFetch(statsKeys.leaderboard(), () => statsService.getLeaderboard());
}
