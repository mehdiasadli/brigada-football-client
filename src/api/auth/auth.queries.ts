import { useFetch } from '../../hooks/use-fetch';
import { authService } from './auth.service';

export const authKeys = {
  index: ['auth'] as const,

  verifyIndex: () => [...authKeys.index, 'verification'] as const,
  verify: (token: string, email: string) => [...authKeys.verifyIndex(), token, email] as const,
};

export function useVerifyEmail(token: string = '', email: string = '') {
  return useFetch(authKeys.verify(token, email), () => authService.verifyEmail(token, email), {
    enabled: !!token && !!email,
  });
}
