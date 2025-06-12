import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { useMutate } from '../../hooks/use-mutate';
import { matchesKeys } from './matches.queries';
import { matchesService } from './matches.service';
import type { PaginatedResult } from '../../schemas/query.schema';
import type { FindAllMatchesResponse, FindOneMatchResponse } from './matches.responses';
import type { SuccessResponse } from '../define-api';
import { useUserStore } from '../../stores/user.store';
import { randId } from '../../utils/rand-id';
import { MatchStatus } from '../../schemas/entities/match.entity';

export function useCreateMatch() {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user)!;

  return useMutate(matchesService.createMatch, {
    showOnError: true,
    showOnSuccess: 'Match created successfully',
    redirectOnSuccess: ({ data }) => (data.match.status === MatchStatus.enum.PENDING ? '/fixture' : '/results'),
    async onMutate(vars) {
      await queryClient.cancelQueries({ queryKey: matchesKeys.listIndex() });
      const prevMatches = queryClient.getQueryData(matchesKeys.listIndex());

      queryClient.setQueriesData(
        { queryKey: matchesKeys.listIndex() },
        (old?: InfiniteData<SuccessResponse<PaginatedResult<FindAllMatchesResponse>>>) => {
          if (!old) return old;

          const newData = {
            ...old,
            pages: [...old.pages],
          };

          const newMatchId = randId();

          if (newData.pages.length > 0) {
            newData.pages[0] = {
              ...newData.pages[0],
              data: {
                ...newData.pages[0].data,
                meta: {
                  ...newData.pages[0].data.meta,
                  totalItems: newData.pages[0].data.meta.totalItems + 1,
                },
                items: [
                  ...newData.pages[0].data.items,
                  {
                    ...vars,
                    id: newMatchId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    creatorId: user.id,
                    creator: {
                      username: user.username,
                      firstName: user.firstName,
                      lastName: user.lastName,
                      avatar: user.avatar,
                    },
                    teams: [
                      {
                        id: randId(),
                        name: vars.team1.name,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        matchId: newMatchId,
                        players: [],
                      },
                      {
                        id: randId(),
                        name: vars.team2.name,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        matchId: newMatchId,
                        players: [],
                      },
                    ],
                  },
                ],
              },
            };
          }

          return newData;
        }
      );

      return { prevMatches };
    },
    onError(_, _1, ctx) {
      if (ctx?.prevMatches) {
        queryClient.setQueryData(matchesKeys.listIndex(), ctx.prevMatches);
      }
    },
    onSuccess({ data }) {
      queryClient.invalidateQueries({ queryKey: matchesKeys.listIndex() });
      queryClient.invalidateQueries({ queryKey: matchesKeys.detail(data.match.id) });
    },
  });
}

export function useUpdateMatch() {
  const queryClient = useQueryClient();

  return useMutate(matchesService.updateMatch, {
    showOnError: true,
    showOnSuccess: 'Match updated successfully',
    redirectOnSuccess: ({ data }) => (data.status === MatchStatus.enum.PENDING ? '/fixture' : '/results'),
    async onMutate(vars) {
      const matchId = vars.id;

      await queryClient.cancelQueries({ queryKey: matchesKeys.listIndex() });
      const prevMatches = queryClient.getQueryData(matchesKeys.listIndex());

      queryClient.setQueriesData(
        { queryKey: matchesKeys.listIndex() },
        (old?: InfiniteData<SuccessResponse<PaginatedResult<FindAllMatchesResponse>>>) => {
          if (!old) return old;

          const newData = {
            ...old,
            pages: [...old.pages],
          };

          if (newData.pages.length > 0) {
            newData.pages[0] = {
              ...newData.pages[0],
              data: {
                ...newData.pages[0].data,
                items: newData.pages[0].data.items.map((item) =>
                  item.id === matchId ? { ...item, ...vars.updateMatchSchema } : item
                ),
              },
            };
          }

          return newData;
        }
      );

      return { prevMatches };
    },
    onError(_, _1, ctx) {
      if (ctx?.prevMatches) {
        queryClient.setQueryData(matchesKeys.listIndex(), ctx.prevMatches);
      }
    },
    onSettled(_, _1, vars) {
      queryClient.invalidateQueries({ queryKey: matchesKeys.listIndex() });
      queryClient.invalidateQueries({ queryKey: matchesKeys.detail(vars.id) });
    },
  });
}

export function useCompleteMatch(match: FindOneMatchResponse) {
  const queryClient = useQueryClient();

  return useMutate(matchesService.completeMatch, {
    showOnError: true,
    showOnSuccess: 'Match updated successfully',
    redirectOnSuccess: () => '/results',
    // handle optimistic update
    async onMutate(vars) {
      const matchId = vars.id;

      await queryClient.cancelQueries({ queryKey: matchesKeys.listIndex() });
      const prevMatches = queryClient.getQueryData(matchesKeys.listIndex());

      queryClient.setQueriesData(
        { queryKey: matchesKeys.listIndex() },
        (old?: InfiniteData<SuccessResponse<PaginatedResult<FindAllMatchesResponse>>>) => {
          if (!old) return old;

          const newData: InfiniteData<SuccessResponse<PaginatedResult<FindAllMatchesResponse>>> = {
            ...old,
            pages: [...old.pages],
          };

          if (newData.pages.length > 0) {
            newData.pages[0] = {
              ...newData.pages[0],
              data: {
                ...newData.pages[0].data,
                items: newData.pages[0].data.items.map((item) => {
                  if (item.id === matchId) {
                    return {
                      ...match,
                      ...item,
                      ...vars.completeMatchSchema,
                      status: MatchStatus.enum.COMPLETED,
                      teams: vars.completeMatchSchema.teams.map((team, index) => ({
                        ...item.teams[index],
                        ...team,
                        players: team.players.map((player) => {
                          const existingPlayer = item.teams[index].players.find((p) => p.id === player.id);
                          return {
                            ...existingPlayer,
                            ...player,
                            createdAt: existingPlayer?.createdAt || new Date(),
                            updatedAt: new Date(),
                            teamId: item.teams[index].id,
                            user: existingPlayer?.user || null,
                          };
                        }),
                      })),
                    };
                  }

                  return item;
                }),
              },
            };
          }

          return newData;
        }
      );

      return { prevMatches };
    },
    onError(_, _1, ctx) {
      if (ctx?.prevMatches) {
        queryClient.setQueryData(matchesKeys.listIndex(), ctx.prevMatches);
      }
    },
    onSettled(_, _1, vars) {
      queryClient.invalidateQueries({ queryKey: matchesKeys.listIndex() });
      queryClient.invalidateQueries({ queryKey: matchesKeys.detail(vars.id) });
    },
  });
}

export function useDeleteMatch() {
  const queryClient = useQueryClient();

  return useMutate(matchesService.deleteMatch, {
    showOnError: true,
    showOnSuccess: 'Match deleted successfully',
    redirectOnSuccess: ({ data }) => (data.status === MatchStatus.enum.PENDING ? '/fixture' : '/results'),
    async onMutate(matchId) {
      await queryClient.cancelQueries({ queryKey: matchesKeys.listIndex() });
      const prevMatches = queryClient.getQueryData(matchesKeys.listIndex());

      queryClient.setQueriesData(
        { queryKey: matchesKeys.listIndex() },
        (old?: InfiniteData<SuccessResponse<PaginatedResult<FindAllMatchesResponse>>>) => {
          if (!old) return old;

          const newData = {
            ...old,
            pages: [...old.pages],
          };

          if (newData.pages.length > 0) {
            newData.pages[0] = {
              ...newData.pages[0],
              data: {
                ...newData.pages[0].data,
                items: newData.pages[0].data.items.filter((item) => item.id !== matchId),
                meta: {
                  ...newData.pages[0].data.meta,
                  totalItems: newData.pages[0].data.meta.totalItems - 1,
                },
              },
            };
          }

          return newData;
        }
      );

      return { prevMatches };
    },
    onError(_, _1, ctx) {
      if (ctx?.prevMatches) {
        queryClient.setQueryData(matchesKeys.listIndex(), ctx.prevMatches);
      }
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: matchesKeys.listIndex() });
    },
  });
}
