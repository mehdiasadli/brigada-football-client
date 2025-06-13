import type { FriendshipStatus } from '../../schemas/entities/friendship.entity';
import type { UserSchema } from '../../schemas/entities/user.entity';

export type FriendshipData = null | {
  id: string;
  status: (typeof FriendshipStatus.options)[number];
  side: 'requester' | 'receiver';
};

export type GetProfileResponse = UserSchema & {
  emailVerified: boolean;
  friendship: FriendshipData;
};
