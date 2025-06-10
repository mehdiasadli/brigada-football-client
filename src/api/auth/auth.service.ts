import { Api } from '../define-api';
import type {
  ForgotPasswordSchema,
  LoginSchema,
  RegisterSchema,
  ResendVerificationSchema,
  ResetPasswordSchema,
} from '../../schemas/auth.schema';
import type { LoginResponse, RegisterResponse } from './auth.responses';

const api = Api.create('/auth');

export const authService = {
  login: async (loginSchema: LoginSchema) => await api.post<LoginResponse, LoginSchema>('/login', loginSchema),
  register: async (registerSchema: RegisterSchema) =>
    await api.post<RegisterResponse, RegisterSchema>('/register', registerSchema),
  forgotPassword: async (forgotPasswordSchema: ForgotPasswordSchema) =>
    await api.post<boolean, ForgotPasswordSchema>('/forgot-password', forgotPasswordSchema),
  resetPassword: async (resetPasswordSchema: ResetPasswordSchema) =>
    await api.post<boolean, ResetPasswordSchema>('/reset-password', resetPasswordSchema),
  verifyEmail: async (token: string, email: string) =>
    await api.get<boolean>('/verify-email', {
      params: { token, email },
    }),
  resendVerificationEmail: async (resendVerificationSchema: ResendVerificationSchema) =>
    await api.post<boolean, ResendVerificationSchema>('/resend-verification-email', resendVerificationSchema),
};
