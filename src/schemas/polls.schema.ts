import { z } from 'zod';
import { pollSchema } from './entities/poll.entity';
import { createPollOptionSchema } from './poll-options.schema';

export const createPollSchema = pollSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    postId: true,
  })
  .extend({
    options: z.array(createPollOptionSchema),
  });

export type CreatePollSchema = z.infer<typeof createPollSchema>;
