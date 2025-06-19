import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { postsService } from './posts.service';
import { useUserStore } from '../../stores/user.store';
import { useMutate } from '../../hooks/use-mutate';
import { feedKeys } from '../feed/feed.queries';
import type { SuccessResponse } from '../define-api';
import type { PaginatedResult } from '../../schemas/query.schema';
import type { FeedPostResponse, GetFeedResponse } from '../feed/feed.responses';
import { randId } from '../../utils/rand-id';
import { postsKeys } from './posts.queries';

export function useCreatePost() {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user)!;

  return useMutate(postsService.create, {
    showOnError: true,
    showOnSuccess: 'Post created successfully',
    redirectOnSuccess: ({ data }) => `/posts/c/${data.id}`,
    async onMutate(vars) {
      await queryClient.cancelQueries({ queryKey: feedKeys.feed() });
      await queryClient.cancelQueries({ queryKey: postsKeys.ofUser(user.username) });

      const prevFeed = queryClient.getQueryData(feedKeys.feed());
      const prevUserPosts = queryClient.getQueryData(postsKeys.ofUser(user.username));

      const newPostId = randId();

      queryClient.setQueriesData(
        { queryKey: feedKeys.feed() },
        (old?: InfiniteData<SuccessResponse<PaginatedResult<GetFeedResponse>>>) => {
          if (!old) return old;

          const newData = { ...old, pages: [...old.pages] };

          if (newData.pages.length > 0) {
            newData.pages[0] = {
              ...newData.pages[0],
              data: {
                ...newData.pages[0].data,
                meta: {
                  ...newData.pages[0].data.meta,
                  totalItems: newData.pages[0].data.meta.totalItems + 1,
                },
                items: [
                  ...newData.pages[0].data.items,
                  {
                    ...vars,
                    id: newPostId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    _count: {
                      comments: 0,
                    },
                    likes: [],
                    attachements: [],
                    authorId: user.id,
                    author: {
                      id: user.id,
                      firstName: user.firstName,
                      lastName: user.lastName,
                      username: user.username,
                      avatar: user.avatar,
                    },
                    poll: {
                      id: randId(),
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      postId: newPostId,
                      content: vars.poll?.content ?? '',
                      maxVotes: vars.poll?.maxVotes ?? 0,
                      isAnonymous: vars.poll?.isAnonymous ?? false,
                    },
                  },
                ],
              },
            };
          }

          return newData;
        }
      );

      queryClient.setQueriesData(
        { queryKey: postsKeys.ofUser(user.username) },
        (old?: InfiniteData<SuccessResponse<PaginatedResult<FeedPostResponse>>>) => {
          if (!old) return old;

          const newData = { ...old, pages: [...old.pages] };

          if (newData.pages.length > 0) {
            newData.pages[0] = {
              ...newData.pages[0],
              data: {
                ...newData.pages[0].data,
                meta: {
                  ...newData.pages[0].data.meta,
                  totalItems: newData.pages[0].data.meta.totalItems + 1,
                },
                items: [
                  ...newData.pages[0].data.items,
                  {
                    ...vars,
                    id: newPostId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    _count: {
                      comments: 0,
                    },
                    likes: [],
                    attachements: [],
                    authorId: user.id,
                    author: {
                      id: user.id,
                      firstName: user.firstName,
                      lastName: user.lastName,
                      username: user.username,
                      avatar: user.avatar,
                    },
                    poll: {
                      id: randId(),
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      postId: newPostId,
                      content: vars.poll?.content ?? '',
                      maxVotes: vars.poll?.maxVotes ?? 0,
                      isAnonymous: vars.poll?.isAnonymous ?? false,
                    },
                  },
                ],
              },
            };
          }

          return newData;
        }
      );

      return { prevFeed, prevUserPosts };
    },
    onError(_, _1, ctx) {
      if (ctx?.prevFeed) {
        queryClient.setQueryData(feedKeys.feed(), ctx.prevFeed);
      }
      if (ctx?.prevUserPosts) {
        queryClient.setQueryData(postsKeys.ofUser(user.username), ctx.prevUserPosts);
      }
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: feedKeys.feed() });
      queryClient.invalidateQueries({ queryKey: postsKeys.ofUser(user.username) });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutate(postsService.delete, {
    showOnError: true,
    showOnSuccess: 'Post deleted successfully',
    async onMutate(postId) {
      await queryClient.cancelQueries({ queryKey: feedKeys.feed() });
      const prevFeed = queryClient.getQueryData(feedKeys.feed());

      queryClient.setQueriesData(
        { queryKey: feedKeys.feed() },
        (old?: InfiniteData<SuccessResponse<PaginatedResult<GetFeedResponse>>>) => {
          if (!old) return old;

          const newData = { ...old, pages: [...old.pages] };

          if (newData.pages.length > 0) {
            newData.pages[0] = {
              ...newData.pages[0],
              data: {
                ...newData.pages[0].data,
                meta: {
                  ...newData.pages[0].data.meta,
                  totalItems: newData.pages[0].data.meta.totalItems - 1,
                },
                items: newData.pages[0].data.items.filter((item) => item.id !== postId),
              },
            };
          }

          return newData;
        }
      );

      return { prevFeed };
    },
    onError(_, _1, ctx) {
      if (ctx?.prevFeed) {
        queryClient.setQueryData(feedKeys.feed(), ctx.prevFeed);
      }
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: feedKeys.feed() });
      queryClient.invalidateQueries({ queryKey: postsKeys.listIndex() });
    },
  });
}
