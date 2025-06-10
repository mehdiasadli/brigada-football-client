import { useQueryClient } from '@tanstack/react-query';
import { useMutate } from '../../hooks/use-mutate';
import { teamsService } from './teams.service';
import { teamsKeys } from './teams.queries';
import { matchesKeys } from '../matches/matches.queries';
import type { FindOneMatchResponse } from '../matches/matches.responses';
import type { FindOneTeamResponse } from './teams.response';
import type { SuccessResponse } from '../define-api';

export function useUpdateTeam(matchId: string) {
  const queryClient = useQueryClient();

  return useMutate(teamsService.updateTeam, {
    showOnError: true,
    showOnSuccess: 'Team updated successfully',
    redirectOnSuccess: (data) => {
      return `/matches/edit/${data.data.matchId}`;
    },
    async onMutate(vars) {
      const teamId = vars.id;

      await queryClient.cancelQueries({ queryKey: teamsKeys.details(teamId) });
      // both team and match data should be updated
      const prevTeam = queryClient.getQueryData(teamsKeys.details(teamId)) as SuccessResponse<FindOneTeamResponse>;
      const prevMatch = queryClient.getQueryData(matchesKeys.detail(matchId)) as SuccessResponse<FindOneMatchResponse>;

      queryClient.setQueriesData(
        { queryKey: matchesKeys.detail(matchId) },
        (old?: SuccessResponse<FindOneMatchResponse>) => {
          if (!old) return old;

          const newData: SuccessResponse<FindOneMatchResponse> = {
            ...old,
            data: {
              ...old.data,
              teams: old.data.teams.map((team) =>
                team.id === teamId
                  ? {
                      ...team,
                      name: vars.updateTeamSchema.name || team.name,
                      players: vars.updateTeamSchema.players.map((player) => ({
                        ...player,
                        user: null,
                      })),
                    }
                  : team
              ),
            },
          };

          return newData;
        }
      );

      queryClient.setQueriesData(
        { queryKey: teamsKeys.details(teamId) },
        (old?: SuccessResponse<FindOneTeamResponse>) => {
          if (!old) return old;

          const newData: SuccessResponse<FindOneTeamResponse> = {
            ...old,
            data: {
              ...old.data,
              name: vars.updateTeamSchema.name || old.data.name,
              players: vars.updateTeamSchema.players.map((player) => {
                const existingPlayer = old.data.players.find((p) => p.id === player.id);
                return {
                  ...existingPlayer,
                  ...player,
                  createdAt: existingPlayer?.createdAt || new Date(),
                  updatedAt: new Date(),
                  teamId: old.data.id,
                };
              }),
            },
          };

          return newData;
        }
      );

      return { prevTeam, prevMatch };
    },
    onError(_, _1, ctx) {
      if (ctx?.prevTeam) {
        queryClient.setQueryData(teamsKeys.details(ctx.prevTeam.data.id), ctx.prevTeam);
      }

      if (ctx?.prevMatch) {
        queryClient.setQueryData(matchesKeys.detail(ctx.prevMatch.data.id), ctx.prevMatch);
      }
    },
    onSettled(_, _1, vars) {
      queryClient.invalidateQueries({ queryKey: teamsKeys.details(vars.id) });
      queryClient.invalidateQueries({ queryKey: matchesKeys.detail(matchId) });
      queryClient.invalidateQueries({ queryKey: matchesKeys.listIndex() });
    },
  });
}
