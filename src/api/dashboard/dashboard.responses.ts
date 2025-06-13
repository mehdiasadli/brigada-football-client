export type GetDashboardStatsResponse = {
  usersStats: {
    totalUsers: number;
    usersInThisMonth: number;
    usersInLastMonth: number;
  };
  venuesStats: {
    totalVenues: number;
    activeVenues: number;
  };
  matchesStats: {
    totalMatches: number;
    completedMatchesInThisMonth: number;
    completedMatchesInLastMonth: number;
  };
  postsStats: {
    totalPosts: number;
    postsInThisMonth: number;
    postsInLastMonth: number;
  };
};

export type GetDashboardChartsResponse = {
  users: {
    month: number;
    usersCreatedCount: number;
    usersWhichHaveCreatedMatch: number;
    usersWhichHavePlayedMatch: number;
  }[];
  matches: {
    month: number;
    matchesCreatedCount: number;
    matchesCompletedCount: number;
    matchesPendingCount: number;
  }[];
  posts: {
    month: number;
    postsCreatedCount: number;
    activePostsCount: number;
  }[];
};
