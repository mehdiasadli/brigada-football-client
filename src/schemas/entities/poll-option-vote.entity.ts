import { z } from 'zod';

export const pollOptionVoteSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  optionId: z.string().uuid(),
  userId: z.string().uuid(),
});

export type PollOptionVoteSchema = z.infer<typeof pollOptionVoteSchema>;
