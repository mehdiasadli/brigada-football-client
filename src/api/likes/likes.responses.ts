import type { LikeSchema } from '../../schemas/entities/like.entity';
import type { UserSchema } from '../../schemas/entities/user.entity';
import type { PaginatedResult } from '../../schemas/query.schema';

export type LikeResponse =
  | {
      type: 'unliked';
    }
  | {
      type: 'liked';
      like: LikeSchema & {
        user: Pick<UserSchema, 'id' | 'firstName' | 'lastName' | 'username' | 'avatar'>;
      };
    };

export type GetLikesOfPostResponse = PaginatedResult<
  Pick<LikeSchema, 'id' | 'createdAt'> & {
    user: Pick<UserSchema, 'id' | 'firstName' | 'lastName' | 'username' | 'avatar'>;
  }
>;

export type GetLikesOfCommentResponse = PaginatedResult<
  Pick<LikeSchema, 'id' | 'createdAt'> & {
    user: Pick<UserSchema, 'id' | 'firstName' | 'lastName' | 'username' | 'avatar'>;
  }
>;
