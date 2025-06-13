import { z } from 'zod';

export const FriendshipStatus = z.enum(['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELED', 'BLOCKED'], {
  required_error: 'Status is required',
  invalid_type_error: 'Status must be a string',
});

export const friendshipSchema = z.object({
  id: z.string(),
  status: FriendshipStatus,
  points: z.number().int().min(0),
  receiverId: z.string().uuid(),
  requesterId: z.string().uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type FriendshipSchema = z.infer<typeof friendshipSchema>;
