import type { VenueSchema } from '../../schemas/entities/venue.entity';
import type { OrderSchema, PaginatedResult, PaginationSchema } from '../../schemas/query.schema';
import type { CreateVenueSchema } from '../../schemas/venues.schema';
import { Api } from '../define-api';

const api = Api.create('/venues');

export const venuesService = {
  findMany: (pagination: PaginationSchema, order: OrderSchema) =>
    api.get<PaginatedResult<VenueSchema>>('/', {
      params: {
        ...pagination,
        ...order,
      },
    }),
  search: (query: string) =>
    api.get<VenueSchema[]>('/search', {
      params: {
        query,
      },
    }),
  venuesOnMap: () => api.get<VenueSchema[]>('/map'),
  create: (data: CreateVenueSchema) => api.post<VenueSchema, CreateVenueSchema>('/', data),
  delete: (id: string) => api.delete<void>(`/${id}`),
};
