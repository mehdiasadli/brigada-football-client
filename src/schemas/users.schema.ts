import { userSchema } from './entities/user.entity';
import type { z } from 'zod';

export const createUserSchema = userSchema.pick({
  email: true,
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  mobileNumber: true,
  dateOfBirth: true,
  placeOfBirth: true,
  gender: true,
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
