import type { UserSchema } from '../../schemas/entities/user.entity';

export type LoginResponse = Pick<
  UserSchema,
  'id' | 'email' | 'username' | 'firstName' | 'lastName' | 'createdAt' | 'role' | 'avatar'
> & {
  accessToken: string;
};

export type RegisterResponse = Pick<UserSchema, 'id' | 'email' | 'firstName' | 'lastName'> & {
  preferencesId: string;
};
