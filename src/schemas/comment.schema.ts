import type { z } from 'zod';
import { commentSchema } from './entities/comment.entity';

export const createCommentSchema = commentSchema.omit({
  id: true,
  createdAt: true,
  editedAt: true,
  updatedAt: true,
  authorId: true,
  postId: true,
});

export const updateCommentSchema = commentSchema.omit({
  id: true,
  createdAt: true,
  editedAt: true,
  updatedAt: true,
  authorId: true,
  postId: true,
});

export type CreateCommentSchema = z.infer<typeof createCommentSchema>;
export type UpdateCommentSchema = z.infer<typeof updateCommentSchema>;
