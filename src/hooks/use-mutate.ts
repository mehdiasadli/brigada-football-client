import {
  useMutation,
  useQueryClient,
  type MutationFunction,
  type QueryKey,
  type UseMutationOptions,
} from '@tanstack/react-query';
import type { ApiError } from '../api/api-error';
import type { NotificationData } from '@mantine/notifications';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';

type AdditionalMutateOptions<TData = unknown, TVariables = void, TContext = unknown> = {
  showOnError?:
    | React.ReactNode
    | true
    | ((error: ApiError, variables: TVariables, context: TContext) => React.ReactNode);
  showOnSuccess?: React.ReactNode | true | ((data: TData, variables: TVariables, context: TContext) => React.ReactNode);
  errorToastOptions?: NotificationData;
  successToastOptions?: NotificationData;
  redirectOnSuccess?: string | ((data: TData, variables: TVariables, context: TContext) => string);
  redirectOnError?: string | ((error: ApiError, variables: TVariables, context: TContext) => string);
  redirectOnSettled?:
    | string
    | ((data: TData | undefined, error: ApiError | null, variables: TVariables, context: TContext) => string);
  refetchOnSuccess?: QueryKey[] | ((data: TData, variables: TVariables, context: TContext) => QueryKey[]);
  refetchOnError?: QueryKey[] | ((error: ApiError, variables: TVariables, context: TContext) => QueryKey[]);
  refetchOnSettled?:
    | QueryKey[]
    | ((data: TData | undefined, error: ApiError | null, variables: TVariables, context: TContext) => QueryKey[]);
};

export type UseMutateOptions<TData = unknown, TVariables = void, TContext = unknown> = Omit<
  UseMutationOptions<TData, ApiError, TVariables, TContext>,
  'mutationFn'
> &
  AdditionalMutateOptions<TData, TVariables, TContext>;

export function useMutate<TData = unknown, TVariables = void, TContext = unknown>(
  mutationFn: MutationFunction<TData, TVariables>,
  options?: UseMutateOptions<TData, TVariables, TContext>
) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    showOnError = true,
    showOnSuccess,
    errorToastOptions,
    successToastOptions,
    redirectOnSuccess,
    redirectOnError,
    redirectOnSettled,
    refetchOnSuccess,
    refetchOnError,
    refetchOnSettled,
    ...rest
  } = options ?? {};

  return useMutation({
    ...rest,
    onError(error, variables, context) {
      rest.onError?.(error, variables, context);

      if (showOnError) {
        if (showOnError instanceof Function) {
          notifications.show({
            title: 'Error',
            message: showOnError(error, variables, context as TContext),
            color: 'red',
            ...errorToastOptions,
          });
        } else {
          notifications.show({
            title: 'Error',
            message: showOnError === true ? error.message : showOnError,
            color: 'red',
            ...errorToastOptions,
          });
        }
      }

      if (refetchOnError) {
        if (refetchOnError instanceof Function) {
          refetchOnError(error, variables, context as TContext).forEach((queryKey) => {
            queryClient.refetchQueries({ queryKey });
          });
        } else {
          refetchOnError.forEach((queryKey) => {
            queryClient.refetchQueries({ queryKey });
          });
        }
      }

      if (redirectOnError) {
        if (redirectOnError instanceof Function) {
          navigate(redirectOnError(error, variables, context as TContext));
        } else {
          navigate(redirectOnError);
        }
      }
    },
    onSuccess(data, variables, context) {
      rest.onSuccess?.(data, variables, context);

      if (showOnSuccess) {
        if (showOnSuccess instanceof Function) {
          notifications.show({
            title: 'Success',
            message: showOnSuccess(data, variables, context as TContext),
            color: 'green',
            ...successToastOptions,
          });
        } else {
          notifications.show({
            title: 'Success',
            message: showOnSuccess === true ? 'Success' : showOnSuccess,
            color: 'green',
            ...successToastOptions,
          });
        }
      }

      if (refetchOnSuccess) {
        if (refetchOnSuccess instanceof Function) {
          refetchOnSuccess(data, variables, context as TContext).forEach((queryKey) => {
            queryClient.refetchQueries({ queryKey });
          });
        } else {
          refetchOnSuccess.forEach((queryKey) => {
            queryClient.refetchQueries({ queryKey });
          });
        }
      }

      if (redirectOnSuccess) {
        if (redirectOnSuccess instanceof Function) {
          navigate(redirectOnSuccess(data, variables, context as TContext));
        } else {
          navigate(redirectOnSuccess);
        }
      }
    },
    onSettled(data, error, variables, context) {
      rest.onSettled?.(data, error, variables, context);

      if (refetchOnSettled) {
        if (refetchOnSettled instanceof Function) {
          refetchOnSettled(data, error, variables, context as TContext).forEach((queryKey) => {
            queryClient.refetchQueries({ queryKey });
          });
        } else {
          refetchOnSettled.forEach((queryKey) => {
            queryClient.refetchQueries({ queryKey });
          });
        }
      }

      if (redirectOnSettled) {
        if (redirectOnSettled instanceof Function) {
          navigate(redirectOnSettled(data, error, variables, context as TContext));
        } else {
          navigate(redirectOnSettled);
        }
      }
    },

    mutationFn,
  });
}
