import type { PostSchema } from '../../schemas/entities/post.entity';
import type { CreatePostSchema } from '../../schemas/posts.schema';
import type { OrderSchema, PaginatedResult, PaginationSchema } from '../../schemas/query.schema';
import { Api } from '../define-api';
import type { FeedPostResponse, PostsResponse } from '../feed/feed.responses';

const api = Api.create('/posts');

export const postsService = {
  findMany: (paginationDto: PaginationSchema, orderDto: OrderSchema) =>
    api.get<PaginatedResult<PostsResponse>>('/', {
      params: {
        ...paginationDto,
        ...orderDto,
      },
    }),
  create: (data: CreatePostSchema) => api.post<PostSchema, CreatePostSchema>('/', data),
  getOne: (postId: string) => api.get<FeedPostResponse>(`/${postId}`),
  delete: (postId: string) => api.delete(`/${postId}`),
  getPostsOfUser: (userId: string, paginationDto: PaginationSchema) =>
    api.get<PaginatedResult<FeedPostResponse>>(`/user/${userId}`, {
      params: {
        ...paginationDto,
      },
    }),
};
