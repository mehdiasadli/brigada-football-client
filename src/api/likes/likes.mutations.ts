import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { useMutate } from '../../hooks/use-mutate';
import { likesService } from './likes.service';
import { feedKeys } from '../feed/feed.queries';
import type { SuccessResponse } from '../define-api';
import type { PaginatedResult } from '../../schemas/query.schema';
import { isMatch, type FeedPostResponse, type GetFeedResponse } from '../feed/feed.responses';
import { useUserStore } from '../../stores/user.store';
import { postsKeys } from '../posts/posts.queries';
import { commentsKeys } from '../comments/comments.queries';
import type { GetCommentsOfPostResponse } from '../comments/comments.responses';

export function useCommentLike(postId: string) {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user)!;

  return useMutate(likesService.likeComment, {
    showOnError: true,
    async onMutate(commentId) {
      await queryClient.cancelQueries({ queryKey: commentsKeys.ofPost(postId) });

      const prevComments = queryClient.getQueryData(commentsKeys.ofPost(postId));

      queryClient.setQueryData(
        commentsKeys.ofPost(postId),
        (old?: InfiniteData<SuccessResponse<PaginatedResult<GetCommentsOfPostResponse>>>) => {
          if (!old) return old;

          const newData = { ...old, pages: [...old.pages] };

          if (newData.pages.length > 0) {
            newData.pages[0] = {
              ...newData.pages[0],
              data: {
                ...newData.pages[0].data,
                items: newData.pages[0].data.items.map((item) => {
                  if (item.id !== commentId) return item;
                  const like = item.likes.find((like) => like.userId === user.id);

                  if (like) {
                    return {
                      ...item,
                      likes: item.likes.filter((like) => like.userId !== user.id),
                    };
                  }

                  return {
                    ...item,
                    likes: [...item.likes, { userId: user.id }],
                  };
                }),
              },
            };
          }

          return newData;
        }
      );

      return { prevComments };
    },
    onError(_, _1, ctx) {
      if (ctx?.prevComments) {
        queryClient.setQueryData(commentsKeys.ofPost(postId), ctx.prevComments);
      }
    },
    onSettled(_, _1, postId) {
      queryClient.invalidateQueries({ queryKey: commentsKeys.ofPost(postId) });
    },
  });
}

export function usePostLike() {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user)!;

  return useMutate(likesService.likePost, {
    showOnError: true,
    async onMutate(postId) {
      await queryClient.cancelQueries({ queryKey: feedKeys.feed() });
      await queryClient.cancelQueries({ queryKey: postsKeys.details(postId) });

      const prevFeed = queryClient.getQueryData(feedKeys.feed());
      const prevPost = queryClient.getQueryData(postsKeys.details(postId));

      queryClient.setQueriesData({ queryKey: postsKeys.details(postId) }, (old?: SuccessResponse<FeedPostResponse>) => {
        if (!old) return old;
        const item = old.data;

        if (item.id !== postId) return item;
        const like = item.likes.find((like) => like.userId === user.id);

        if (like) {
          return {
            ...old,
            data: {
              ...item,
              likes: item.likes.filter((like) => like.userId !== user.id),
            },
          };
        }

        return {
          ...old,
          data: {
            ...item,
            likes: [...item.likes, { userId: user.id }],
          },
        };
      });

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
                items: newData.pages[0].data.items.map((item) => {
                  if (isMatch(item)) {
                    return item;
                  }

                  if (item.id !== postId) return item;
                  const like = item.likes.find((like) => like.userId === user.id);

                  if (like) {
                    return {
                      ...item,
                      likes: item.likes.filter((like) => like.userId !== user.id),
                    };
                  }

                  return {
                    ...item,
                    likes: [...item.likes, { userId: user.id }],
                  };
                }),
              },
            };
          }

          return newData;
        }
      );

      return { prevFeed, prevPost };
    },
    onError(_, postId, ctx) {
      if (ctx?.prevFeed) {
        queryClient.setQueryData(feedKeys.feed(), ctx.prevFeed);
      }

      if (ctx?.prevPost) {
        queryClient.setQueryData(postsKeys.details(postId), ctx.prevPost);
      }
    },
    onSettled(_, _1, postId) {
      queryClient.invalidateQueries({ queryKey: feedKeys.feed() });
      queryClient.invalidateQueries({ queryKey: postsKeys.details(postId) });
    },
  });
}
