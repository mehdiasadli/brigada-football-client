import type { CommentSchema } from '../../schemas/entities/comment.entity';
import type { UserSchema } from '../../schemas/entities/user.entity';

export type GetCommentsOfPostResponse = CommentSchema & {
  likes: { userId: string }[];
  author: Pick<UserSchema, 'id' | 'firstName' | 'lastName' | 'username' | 'avatar'>;
};
