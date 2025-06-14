import type { FriendshipSchema } from '../../schemas/entities/friendship.entity';
import type { UserSchema } from '../../schemas/entities/user.entity';

export type FriendshipRequest = FriendshipSchema & {
  requester: Pick<UserSchema, 'id' | 'firstName' | 'lastName' | 'avatar' | 'username'>;
};
