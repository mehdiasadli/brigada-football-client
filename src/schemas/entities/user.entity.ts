import z from 'zod';
import { nameSchema } from '../_common.schema';
import { passwordSpecialChars, regexes } from '../../resources/regexes';

export const UserRole = z.enum(['ADMIN', 'MODERATOR', 'USER', 'SUPER_ADMIN'], {
  required_error: 'Role is required',
  invalid_type_error: 'Role must be a string',
  message: 'Invalid role',
});

export type TUserRole = (typeof UserRole.options)[number];

export const Gender = z.enum(['MALE', 'FEMALE', 'OTHER'], {
  required_error: 'Gender is required',
  invalid_type_error: 'Gender must be a string',
  message: 'Invalid gender',
});

export const userSchema = z.object({
  id: z
    .string({
      required_error: 'Id is required',
      invalid_type_error: 'Id must be a string',
    })
    .uuid({
      message: 'Invalid id',
    })
    .min(1, {
      message: 'Id is required',
    }),
  createdAt: z.coerce.date({
    required_error: 'Created at is required',
    invalid_type_error: 'Created at must be a date',
  }),
  updatedAt: z.coerce.date({
    required_error: 'Updated at is required',
    invalid_type_error: 'Updated at must be a date',
  }),
  deletedAt: z.coerce
    .date({
      required_error: 'Deleted at is required',
      invalid_type_error: 'Deleted at must be a date',
    })
    .nullish(),
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email({
      message: 'Invalid email',
    })
    .min(1, {
      message: 'Email is required',
    }),
  username: z
    .string({
      required_error: 'Username is required',
      invalid_type_error: 'Username must be a string',
    })
    .regex(regexes.users.username, {
      message: 'Invalid username',
    })
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .transform((val) => val.toLowerCase()),
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .regex(regexes.users.password, {
      message: `Invalid password. Password must include at least one lowercase letter, one uppercase letter, one number, and one special character. (${passwordSpecialChars})`,
    })
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password must be less than 32 characters'),
  firstName: nameSchema('First name').min(1, {
    message: 'First name is required',
  }),
  lastName: nameSchema('Last name').min(1, {
    message: 'Last name is required',
  }),
  avatar: z
    .string({
      required_error: 'Avatar is required',
      invalid_type_error: 'Avatar must be a string',
    })
    .url({
      message: 'Invalid avatar',
    })
    .nullish(),
  mobileNumber: z
    .string({
      required_error: 'Mobile number is required',
      invalid_type_error: 'Mobile number must be a string',
    })
    .regex(regexes.users.mobileNumber, {
      message: 'Invalid mobile number',
    })
    .min(1, {
      message: 'Mobile number is required',
    }),
  role: UserRole,
  dateOfBirth: z.coerce
    .date({
      required_error: 'Date of birth is required',
      invalid_type_error: 'Date of birth must be a date',
    })
    .refine(
      (val) => {
        const age = new Date().getFullYear() - val.getFullYear();
        return age >= 18 && age <= 100;
      },
      {
        message: 'Invalid date of birth',
      }
    ),
  gender: Gender,
  placeOfBirth: z
    .string({
      required_error: 'Place of birth is required',
      invalid_type_error: 'Place of birth must be a string',
    })
    .min(1, {
      message: 'Place of birth is required',
    }),
  emailVerifiedAt: z.coerce
    .date({
      required_error: 'Email verified at is required',
      invalid_type_error: 'Email verified at must be a date',
    })
    .nullish(),
  invalidPasswordAttempts: z
    .number({
      required_error: 'Invalid password attempts is required',
      invalid_type_error: 'Invalid password attempts must be a number',
    })
    .int({
      message: 'Invalid password attempts',
    }),
});

export type UserSchema = z.infer<typeof userSchema>;
