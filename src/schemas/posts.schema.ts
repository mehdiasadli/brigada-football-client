import type { z } from 'zod';
import { postSchema } from './entities/post.entity';

export const createPostSchema = postSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  authorId: true,
});

export type CreatePostSchema = z.infer<typeof createPostSchema>;
