import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { useMutate } from '../../hooks/use-mutate';
import { usersService } from './users.service';
import { userKeys } from './users.queries';
import type { SuccessResponse } from '../define-api';
import type { PaginatedResult } from '../../schemas/query.schema';
import type { UserSchema } from '../../schemas/entities/user.entity';
import { useUserStore } from '../../stores/user.store';
import { feedKeys } from '../feed/feed.queries';
import { postsKeys } from '../posts/posts.queries';

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutate(usersService.updateRole, {
    showOnError: true,
    showOnSuccess: 'User role updated successfully',
    async onMutate(vars) {
      await queryClient.cancelQueries({ queryKey: userKeys.listIndex() });
      const prevUsers = queryClient.getQueryData(userKeys.listIndex());

      queryClient.setQueriesData(
        { queryKey: userKeys.listIndex() },
        (old?: InfiniteData<SuccessResponse<PaginatedResult<UserSchema>>>) => {
          if (!old) return old;

          const newData = {
            ...old,
            pages: [...old.pages],
          };

          if (newData.pages.length > 0) {
            newData.pages[0] = {
              ...newData.pages[0],
              data: {
                ...newData.pages[0].data,
                items: newData.pages[0].data.items.map((item) =>
                  item.id === vars.userId ? { ...item, role: vars.role } : item
                ),
              },
            };
          }

          return newData;
        }
      );

      return { prevUsers };
    },
    onError(_, _1, ctx) {
      if (ctx?.prevUsers) {
        queryClient.setQueryData(userKeys.listIndex(), ctx.prevUsers);
      }
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: userKeys.listIndex() });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutate(usersService.delete, {
    showOnError: true,
    showOnSuccess: 'User deleted successfully',
    async onMutate(userId) {
      await queryClient.cancelQueries({ queryKey: userKeys.listIndex() });
      const prevUsers = queryClient.getQueryData(userKeys.listIndex());

      queryClient.setQueriesData(
        { queryKey: userKeys.listIndex() },
        (old?: InfiniteData<SuccessResponse<PaginatedResult<UserSchema>>>) => {
          if (!old) return old;

          const newData = {
            ...old,
            pages: [...old.pages],
          };

          if (newData.pages.length > 0) {
            newData.pages[0] = {
              ...newData.pages[0],
              data: {
                ...newData.pages[0].data,
                meta: {
                  ...newData.pages[0].data.meta,
                  totalItems: newData.pages[0].data.meta.totalItems - 1,
                },
                items: newData.pages[0].data.items.filter((item) => item.id !== userId),
              },
            };
          }

          return newData;
        }
      );

      return { prevUsers };
    },
    onError(_, _1, ctx) {
      if (ctx?.prevUsers) {
        queryClient.setQueryData(userKeys.listIndex(), ctx.prevUsers);
      }
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: userKeys.listIndex() });
    },
  });
}

export function useUploadAvatar() {
  const userStore = useUserStore();

  return useMutate(usersService.uploadAvatar, {
    showOnError: true,
    showOnSuccess: 'Avatar uploaded successfully',
    refetchOnSuccess: ({ data }) => [userKeys.detail(data.username), feedKeys.feed(), postsKeys.ofUser(data.username)],
    onSuccess({ data }) {
      console.log('refetching: ', [userKeys.detail(data.username), feedKeys.feed(), postsKeys.ofUser(data.username)]);
      userStore.setUser(data);
    },
  });
}

export function useDeleteAvatar() {
  return useMutate(usersService.deleteAvatar, {
    showOnError: true,
    showOnSuccess: 'Avatar deleted successfully',
  });
}
