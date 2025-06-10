import type { MatchSchema } from '../../schemas/entities/match.entity';
import type { CompleteMatchSchema, CreateMatchSchema, UpdateMatchSchema } from '../../schemas/matches.schema';
import type { OrderSchema, PaginatedResult, PaginationSchema } from '../../schemas/query.schema';
import { Api } from '../define-api';
import type { FindAllMatchesResponse, FindOneMatchResponse } from './matches.responses';

const api = Api.create('/matches');

export const matchesService = {
  createMatch: async (match: CreateMatchSchema) =>
    await api.post<{ match: MatchSchema }, CreateMatchSchema>('/', match),
  updateMatch: async (data: { id: string; updateMatchSchema: UpdateMatchSchema }) =>
    await api.put<MatchSchema, UpdateMatchSchema>(`/${data.id}`, data.updateMatchSchema),
  findAll: async (pagination: PaginationSchema, order: OrderSchema, filters: { status?: MatchSchema['status'] }) =>
    await api.get<PaginatedResult<FindAllMatchesResponse>>('/', {
      params: { ...pagination, ...order, ...filters },
    }),
  findOne: async (matchId: string) => await api.get<FindOneMatchResponse>(`/${matchId}`),
  deleteMatch: async (matchId: string) => await api.delete<MatchSchema>(`/${matchId}`),
  completeMatch: async (data: { id: string; completeMatchSchema: CompleteMatchSchema }) =>
    await api.post<FindAllMatchesResponse, CompleteMatchSchema>(`/${data.id}/complete`, data.completeMatchSchema),
};
