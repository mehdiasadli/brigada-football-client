import { z } from 'zod';
import { createUserSchema } from './users.schema';
import { userSchema } from './entities/user.entity';

export const loginSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .min(1, {
      message: 'Email is required',
    }),
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .min(1, {
      message: 'Password is required',
    }),
});

export const registerSchema = createUserSchema
  .merge(
    z.object({
      confirmPassword: z
        .string({
          required_error: 'Confirm password is required',
          invalid_type_error: 'Confirm password must be a string',
        })
        .min(1, {
          message: 'Confirm password is required',
        }),
    })
  )
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      });

      return z.NEVER;
    }
  });

export const forgotPasswordSchema = userSchema.pick({
  email: true,
});

export const resendVerificationSchema = userSchema.pick({
  email: true,
});

export const verifyEmailSchema = z.object({
  token: z.string({
    required_error: 'Token is required',
    invalid_type_error: 'Token must be a string',
  }),
});

export const resetPasswordSchema = verifyEmailSchema
  .merge(
    createUserSchema
      .pick({
        password: true,
      })
      .merge(
        z.object({
          confirmPassword: z.string({
            required_error: 'Confirm password is required',
            invalid_type_error: 'Confirm password must be a string',
          }),
        })
      )
  )
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      });

      return z.NEVER;
    }
  });

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type VerifyEmailSchema = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationSchema = z.infer<typeof resendVerificationSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
