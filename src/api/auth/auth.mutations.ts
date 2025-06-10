import { useTokenStore } from '../../stores/token.store';
import { authService } from './auth.service';
import { useMutate } from '../../hooks/use-mutate';
import { useUserStore } from '../../stores/user.store';

export function useLogin() {
  const userStore = useUserStore();
  const tokenStore = useTokenStore();

  return useMutate(authService.login, {
    redirectOnSuccess: '/',
    showOnError: true,
    onSuccess: ({ data }) => {
      const { accessToken, ...user } = data;

      tokenStore.setToken(accessToken);
      userStore.setUser(user);
    },
  });
}

export function useLogout() {
  const tokenStore = useTokenStore();
  const userStore = useUserStore();

  return function () {
    tokenStore.removeToken();
    userStore.removeUser();
  };
}

export function useRegister() {
  return useMutate(authService.register, {
    redirectOnSuccess: (data) => `/auth/verify-email?email=${encodeURIComponent(data.data.email)}`,
    showOnError: true,
    showOnSuccess: 'Check your email address before logging in',
  });
}

export function useForgotPassword() {
  return useMutate(authService.forgotPassword, {
    redirectOnSuccess: '/auth',
    showOnError: true,
    showOnSuccess: "Password reset email sent. Check your email and spam folder if you don't see it.",
  });
}

export function useResetPassword() {
  return useMutate(authService.resetPassword, {
    redirectOnSuccess: '/auth',
    showOnError: true,
    showOnSuccess: 'Password reset successfully. You can now login with your new password.',
  });
}

export function useResendVerificationEmail() {
  return useMutate(authService.resendVerificationEmail, {
    showOnError: true,
    showOnSuccess: 'Verification email resent successfully. Check your email.',
  });
}
