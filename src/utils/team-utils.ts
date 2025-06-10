import { getPlayerScorePoints } from './get-player-score-points';

export function getTeamStats(team: {
  players: {
    goals: number;
  }[];
}) {
  return team.players.reduce(
    (acc, player) => ({
      goals: acc.goals + player.goals,
    }),
    { goals: 0 }
  );
}

export function sortPlayers(team: {
  players: {
    isCaptain: boolean;
    goals: number;
    assists: number;
  }[];
}) {
  return {
    ...team,
    players: [...team.players].sort((a, b) => {
      if (a.isCaptain && !b.isCaptain) return -1;
      if (!a.isCaptain && b.isCaptain) return 1;

      return getPlayerScorePoints(b.goals, b.assists) - getPlayerScorePoints(a.goals, a.assists);
    }),
  };
}
