import { z } from 'zod';
import { postSchema } from './entities/post.entity';
import { createPollSchema } from './polls.schema';

export const createPostSchema = postSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    authorId: true,
  })
  .merge(
    z.object({
      poll: createPollSchema.nullish(),
    })
  );

export type CreatePostSchema = z.infer<typeof createPostSchema>;
