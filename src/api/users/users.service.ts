import type { UserRole, UserSchema } from '../../schemas/entities/user.entity';
import type { PaginatedResult } from '../../schemas/query.schema';
import type { PaginationSchema } from '../../schemas/query.schema';
import type { OrderSchema } from '../../schemas/query.schema';
import type { SearchSchema } from '../../schemas/query.schema';
import { Api } from '../define-api';
import type { GetProfileResponse } from './users.responses';

const api = Api.create('/users');

export const usersService = {
  findAll: async (pagination: PaginationSchema, order: OrderSchema, search: SearchSchema) =>
    await api.get<PaginatedResult<UserSchema & { activity: number }>>('/', {
      params: { ...pagination, ...order, ...search },
    }),
  findOne: async (id: string) => await api.get<UserSchema>(`/${id}`),
  findOneWithUsername: async (username: string) => await api.get<GetProfileResponse>(`/with-username/${username}`),
  searchForMatch: async (query: string, excludeIds: string[] = []) =>
    await api.get<UserSchema[]>('/search/players', {
      params: { query, excludeIds },
    }),
  updateRole: async (data: UpdateRoleData) =>
    await api.put<UserSchema, Omit<UpdateRoleData, 'userId'>>(`/update-role/${data.userId}`, {
      role: data.role,
    }),
  delete: async (id: string) => await api.delete<UserSchema>(`/${id}`),
  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);

    return await api.put<UserSchema, FormData>('/avatar/upload', formData);
  },
  deleteAvatar: async () => await api.delete<UserSchema>('/avatar/delete'),
};

type UpdateRoleData = {
  userId: string;
  role: (typeof UserRole.options)[number];
};
