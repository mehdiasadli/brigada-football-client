import { Api } from '../define-api';
import type { LeaderboardResponse, UserStatsResponse } from './stats.responses';

const api = Api.create('/stats');

export const statsService = {
  getUserStats: async (userId: string) => await api.get<UserStatsResponse>(`/users/${userId}`),
  getLeaderboard: async () => await api.get<LeaderboardResponse>(`/leaderboard`),
};
