import type { UserSchema } from '../../schemas/entities/user.entity';

export type UserStatsResponse = {
  userId: string;
  totalGoals: number;
  totalAssists: number;
  matchesPlayed: number;
  matchesCreated: number;
  totalRatingCount: number;
  averageRating: number | null;
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
  activity: number;
};

export type LeaderboardResponse = {
  topScorers: {
    user: UserSchema;
    goals: number;
    averageGoals: number;
  }[];
  topAssisters: {
    user: UserSchema;
    assists: number;
    averageAssists: number;
  }[];
  topRatedPlayers: {
    user: UserSchema;
    rating: number;
  }[];
  topActivePlayers: {
    user: UserSchema;
    matches: number;
  }[];
};
