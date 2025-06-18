import { useInfinite } from '../../hooks/use-infinite';
import { commentsService } from './comments.service';

export const commentsKeys = {
  index: ['comments'] as const,

  ofPostIndex: () => [...commentsKeys.index, 'post'] as const,
  ofPost: (postId: string) => [...commentsKeys.ofPostIndex(), postId] as const,
};

export function useCommentsOfPost(postId: string) {
  return useInfinite({
    enabled: !!postId,
    queryKey: commentsKeys.ofPost(postId),
    queryFn: (page) =>
      commentsService.getCommentsOfPost(postId, {
        page,
        limit: 20,
      }),
  });
}
