import type { UpdateTeamSchema } from '../../schemas/teams.schema';
import { Api } from '../define-api';
import type { FindOneTeamResponse } from './teams.response';

const api = Api.create('/teams');

export const teamsService = {
  findOne: async (id: string) => await api.get<FindOneTeamResponse>(`/${id}`),
  updateTeam: async (data: { id: string; updateTeamSchema: UpdateTeamSchema }) =>
    await api.put<FindOneTeamResponse, UpdateTeamSchema>(`/${data.id}`, data.updateTeamSchema),
};
