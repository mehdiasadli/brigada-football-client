import type { CreateCommentSchema } from '../../schemas/comment.schema';
import type { CommentSchema } from '../../schemas/entities/comment.entity';
import type { PaginatedResult, PaginationSchema } from '../../schemas/query.schema';
import { Api } from '../define-api';
import type { GetCommentsOfPostResponse } from './comments.responses';

const api = Api.create('/comments');

export const commentsService = {
  getCommentsOfPost: async (postId: string, paginationSchema: PaginationSchema) =>
    await api.get<PaginatedResult<GetCommentsOfPostResponse>>(`/${postId}`, {
      params: {
        ...paginationSchema,
      },
    }),
  create: async (data: { postId: string; createCommentSchema: CreateCommentSchema }) =>
    await api.post<CommentSchema, CreateCommentSchema>(`/${data.postId}`, data.createCommentSchema),
  delete: async (commentId: string) => await api.delete(`/${commentId}`),
};
