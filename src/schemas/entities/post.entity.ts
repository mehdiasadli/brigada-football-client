import { z } from 'zod';

export const PostVisibility = z.enum(['PUBLIC', 'PRIVATE', 'FRIENDS'], {
  required_error: 'Visibility is required',
  invalid_type_error: 'Visibility must be a string',
  message: 'Visibility must be one of the following: PUBLIC, PRIVATE, FRIENDS',
  description: 'Visibility must be one of the following: PUBLIC, PRIVATE, FRIENDS',
});

export const postSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  editedAt: z.coerce.date().nullish(),
  content: z.string(),
  images: z.array(z.string()),
  isPinned: z.boolean().default(false),
  authorId: z.string().uuid(),
  visibility: PostVisibility,
});

export type PostSchema = z.infer<typeof postSchema>;
