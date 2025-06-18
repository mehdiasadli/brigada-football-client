import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { useMutate } from '../../hooks/use-mutate';
import { commentsKeys } from './comments.queries';
import { commentsService } from './comments.service';
import { useUserStore } from '../../stores/user.store';
import type { GetCommentsOfPostResponse } from './comments.responses';
import type { PaginatedResult } from '../../schemas/query.schema';
import type { SuccessResponse } from '../define-api';
import { randId } from '../../utils/rand-id';
import { postsKeys } from '../posts/posts.queries';
import type { FeedPostResponse } from '../feed/feed.responses';

export function useCreateComment() {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user)!;

  return useMutate(commentsService.create, {
    showOnError: true,
    showOnSuccess: 'Comment created successfully',
    async onMutate({ postId, createCommentSchema }) {
      await queryClient.cancelQueries({ queryKey: commentsKeys.ofPost(postId) });
      await queryClient.cancelQueries({ queryKey: postsKeys.details(postId) });

      const prevComments = queryClient.getQueryData(commentsKeys.ofPost(postId));
      const prevPost = queryClient.getQueryData(postsKeys.details(postId));

      queryClient.setQueriesData({ queryKey: postsKeys.details(postId) }, (old?: SuccessResponse<FeedPostResponse>) => {
        if (!old) return old;
        const item = old.data;

        if (item.id !== postId) return item;

        return {
          ...old,
          data: {
            ...item,
            _count: {
              ...item._count,
              comments: item._count.comments + 1,
            },
          },
        };
      });

      const newCommentId = randId();

      queryClient.setQueryData(
        commentsKeys.ofPost(postId),
        (old?: InfiniteData<SuccessResponse<PaginatedResult<GetCommentsOfPostResponse>>>) => {
          if (!old) return old;
          console.log('old', old);

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
                  {
                    ...createCommentSchema,
                    id: newCommentId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    editedAt: null,
                    postId,
                    authorId: user.id,
                    author: {
                      id: user.id,
                      firstName: user.firstName,
                      lastName: user.lastName,
                      username: user.username,
                      avatar: user.avatar,
                    },
                    likes: [],
                  },
                  ...newData.pages[0].data.items,
                ],
              },
            };
          }

          console.log('newData', newData);

          return newData;
        }
      );

      return { prevComments, prevPost };
    },
    onError(_, vars, ctx) {
      if (ctx?.prevComments) {
        queryClient.setQueryData(commentsKeys.ofPost(vars.postId), ctx.prevComments);
      }

      if (ctx?.prevPost) {
        queryClient.setQueryData(postsKeys.details(vars.postId), ctx.prevPost);
      }
    },
    onSettled(_, _1, vars) {
      queryClient.invalidateQueries({ queryKey: commentsKeys.ofPost(vars.postId) });
      queryClient.invalidateQueries({ queryKey: postsKeys.details(vars.postId) });
    },
  });
}

export function useDeleteComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutate(commentsService.delete, {
    showOnError: true,
    showOnSuccess: 'Comment deleted successfully',
    async onMutate(commentId) {
      await queryClient.cancelQueries({ queryKey: commentsKeys.ofPost(postId) });
      await queryClient.cancelQueries({ queryKey: postsKeys.details(postId) });

      const prevComments = queryClient.getQueryData(commentsKeys.ofPost(postId));
      const prevPost = queryClient.getQueryData(postsKeys.details(postId));

      queryClient.setQueriesData({ queryKey: postsKeys.details(postId) }, (old?: SuccessResponse<FeedPostResponse>) => {
        if (!old) return old;
        const item = old.data;

        if (item.id !== postId) return item;

        return {
          ...old,
          data: {
            ...item,
            _count: {
              ...item._count,
              comments: item._count.comments - 1,
            },
          },
        };
      });

      queryClient.setQueryData(
        commentsKeys.ofPost(postId),
        (old?: InfiniteData<SuccessResponse<PaginatedResult<GetCommentsOfPostResponse>>>) => {
          if (!old) return old;
          console.log('old', old);

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
                items: newData.pages[0].data.items.filter((item) => item.id !== commentId),
              },
            };
          }

          console.log('newData', newData);

          return newData;
        }
      );

      return { prevComments, prevPost };
    },
    onError(_, _1, ctx) {
      if (ctx?.prevComments) {
        queryClient.setQueryData(commentsKeys.ofPost(postId), ctx.prevComments);
      }

      if (ctx?.prevPost) {
        queryClient.setQueryData(postsKeys.details(postId), ctx.prevPost);
      }
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: commentsKeys.ofPost(postId) });
      queryClient.invalidateQueries({ queryKey: postsKeys.details(postId) });
    },
  });
}
