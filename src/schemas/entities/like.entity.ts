import { z } from 'zod';

export const LikeType = z.enum(['POST', 'COMMENT'], {
  required_error: 'Like type is required',
  invalid_type_error: 'Invalid like type',
  description: 'The type of like',
  message: 'Invalid like type',
});

export const likeSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  userId: z.string().uuid(),
  postId: z.string().uuid().nullable(),
  commentId: z.string().uuid().nullable(),
  type: LikeType,
});

export type LikeSchema = z.infer<typeof likeSchema>;
