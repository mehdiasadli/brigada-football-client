import { z } from 'zod';
import { pollOptionSchema } from './entities/poll-option.entity';

export const createPollOptionSchema = pollOptionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  pollId: true,
});

export type CreatePollOptionSchema = z.infer<typeof createPollOptionSchema>;
