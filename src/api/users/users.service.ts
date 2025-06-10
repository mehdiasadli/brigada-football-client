import type { UserSchema } from '../../schemas/entities/user.entity';
import type { PaginatedResult } from '../../schemas/query.schema';
import type { PaginationSchema } from '../../schemas/query.schema';
import type { OrderSchema } from '../../schemas/query.schema';
import type { SearchSchema } from '../../schemas/query.schema';
import { Api } from '../define-api';

const api = Api.create('/users');

export const usersService = {
  findAll: async (pagination: PaginationSchema, order: OrderSchema, search: SearchSchema) =>
    await api.get<PaginatedResult<UserSchema>>('/', {
      params: { ...pagination, ...order, ...search },
    }),
  findOne: async (id: string) => await api.get<UserSchema>(`/${id}`),
  findOneWithUsername: async (username: string) =>
    await api.get<UserSchema & { emailVerified: boolean }>(`/with-username/${username}`),
  searchForMatch: async (query: string, excludeIds: string[] = []) =>
    await api.get<UserSchema[]>('/search/players', {
      params: { query, excludeIds },
    }),
};
