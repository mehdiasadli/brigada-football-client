import { z } from 'zod';

export const commentSchema = z.object({
  id: z.string(),
  content: z.string(),
  createdAt: z.date(),
  editedAt: z.date().nullable(),
  updatedAt: z.date(),
  postId: z.string(),
  authorId: z.string(),
});

export type CommentSchema = z.infer<typeof commentSchema>;
