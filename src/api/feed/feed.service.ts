import type { PaginatedResult, PaginationSchema } from '../../schemas/query.schema';
import { Api } from '../define-api';
import type { GetFeedResponse } from './feed.responses';

const api = Api.create('/feed');

export const feedService = {
  getFeed: (paginationDto: PaginationSchema) =>
    api.get<PaginatedResult<GetFeedResponse>>('/', {
      params: {
        ...paginationDto,
      },
    }),
};
