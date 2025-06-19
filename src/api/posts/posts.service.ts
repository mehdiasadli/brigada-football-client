import type { PollOptionSchema } from '../../schemas/entities/poll-option.entity';
import type { PollSchema } from '../../schemas/entities/poll.entity';
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
  create: (data: CreatePostSchema) =>
    api.post<
      PostSchema & {
        poll?: PollSchema;
      },
      CreatePostSchema
    >('/', data),
  getOne: (postId: string) => api.get<GetOnePostResponse>(`/${postId}`),
  delete: (postId: string) => api.delete(`/${postId}`),
  getPostsOfUser: (userId: string, paginationDto: PaginationSchema) =>
    api.get<PaginatedResult<GetPostsOfUserResponse>>(`/user/${userId}`, {
      params: {
        ...paginationDto,
      },
    }),
};

export type GetPostsOfUserResponse = FeedPostResponse & {
  poll: Pick<PollSchema, 'id' | 'content'> & {
    _count: { options: number };
  };
};

export type GetOnePostResponse = FeedPostResponse & {
  poll: Pick<PollSchema, 'id' | 'content' | 'isAnonymous' | 'maxVotes'> & {
    options: (Pick<PollOptionSchema, 'id' | 'content' | 'image'> & {
      _count: { votes: number };
      votes: { userId: string }[];
    })[];
    userVotes: string[]; // option ids
  };
};
