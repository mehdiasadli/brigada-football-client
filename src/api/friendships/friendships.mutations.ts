import { useQueryClient } from '@tanstack/react-query';
import { useMutate } from '../../hooks/use-mutate';
import { friendshipsService } from './friendships.service';
import { userKeys } from '../users/users.queries';
import { FriendshipStatus } from '../../schemas/entities/friendship.entity';
import type { GetProfileResponse } from '../users/users.responses';
import type { SuccessResponse } from '../define-api';

export function useSendFriendshipRequest(username: string) {
  const queryClient = useQueryClient();

  return useMutate(friendshipsService.sendFriendshipRequest, {
    showOnSuccess: `You sent a friendship request to ${username}`,
    showOnError: true,
    async onMutate() {
      await queryClient.cancelQueries({ queryKey: userKeys.detail(username) });
      const prevData = queryClient.getQueryData(userKeys.detail(username));

      queryClient.setQueryData(userKeys.detail(username), (old: SuccessResponse<GetProfileResponse>) => {
        if (!old) return old;

        const newData = {
          ...old.data,
          friendship: {
            id: old.data.friendship?.id,
            status: FriendshipStatus.enum.PENDING,
            side: 'requester',
          },
        };

        return {
          ...old,
          data: newData,
        };
      });

      return { prevData };
    },
    onError(_, _1, ctx) {
      queryClient.setQueryData(userKeys.detail(username), ctx?.prevData);
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(username) });
    },
  });
}

export function useCancelFriendshipRequest(username: string) {
  const queryClient = useQueryClient();

  return useMutate(friendshipsService.cancelFriendshipRequest, {
    showOnSuccess: `You canceled your friendship request with ${username}`,
    showOnError: true,
    async onMutate(friendshipId) {
      await queryClient.cancelQueries({ queryKey: userKeys.detail(username) });
      const prevData = queryClient.getQueryData(userKeys.detail(username));

      queryClient.setQueryData(userKeys.detail(username), (old: SuccessResponse<GetProfileResponse>) => {
        if (!old) return old;

        return {
          ...old,
          data: {
            ...old.data,
            friendship: {
              id: friendshipId,
              status: FriendshipStatus.enum.CANCELED,
              side: 'requester',
            },
          },
        };
      });

      return { prevData };
    },
    onError(_, _1, ctx) {
      queryClient.setQueryData(userKeys.detail(username), ctx?.prevData);
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(username) });
    },
  });
}

export function useRejectFriendshipRequest(username: string) {
  const queryClient = useQueryClient();

  return useMutate(friendshipsService.rejectFriendshipRequest, {
    showOnSuccess: `You rejected ${username}`,
    showOnError: true,
    async onMutate(friendshipId) {
      await queryClient.cancelQueries({ queryKey: userKeys.detail(username) });
      const prevData = queryClient.getQueryData(userKeys.detail(username));

      queryClient.setQueryData(userKeys.detail(username), (old: SuccessResponse<GetProfileResponse>) => {
        if (!old) return old;

        return {
          ...old,
          data: {
            ...old.data,
            friendship: {
              id: friendshipId,
              status: FriendshipStatus.enum.REJECTED,
              side: 'receiver',
            },
          },
        };
      });

      return { prevData };
    },
    onError(_, _1, ctx) {
      queryClient.setQueryData(userKeys.detail(username), ctx?.prevData);
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(username) });
    },
  });
}

export function useAcceptFriendshipRequest(username: string) {
  const queryClient = useQueryClient();

  return useMutate(friendshipsService.acceptFriendshipRequest, {
    showOnSuccess: `You are now friends with ${username}`,
    showOnError: true,
    async onMutate(friendshipId) {
      await queryClient.cancelQueries({ queryKey: userKeys.detail(username) });
      const prevData = queryClient.getQueryData(userKeys.detail(username));

      queryClient.setQueryData(userKeys.detail(username), (old: SuccessResponse<GetProfileResponse>) => {
        if (!old) return old;

        return {
          ...old,
          data: {
            ...old.data,
            friendship: {
              id: friendshipId,
              status: FriendshipStatus.enum.ACCEPTED,
              side: 'receiver',
            },
          },
        };
      });

      return { prevData };
    },
    onError(_, _1, ctx) {
      queryClient.setQueryData(userKeys.detail(username), ctx?.prevData);
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(username) });
    },
  });
}
