import { z } from 'zod';

export const pollSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  postId: z.string().uuid(),
  content: z.string(),
  maxVotes: z.number().int().positive(),
  isAnonymous: z.boolean(),
});

export type PollSchema = z.infer<typeof pollSchema>;
