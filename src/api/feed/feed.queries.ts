import { useInfinite } from '../../hooks/use-infinite';
import { feedService } from './feed.service';

export const feedKeys = {
  index: ['feed'] as const,

  feed: () => [...feedKeys.index] as const,
};

export function useFeed() {
  return useInfinite({
    queryKey: feedKeys.feed(),
    queryFn: (page) =>
      feedService.getFeed({
        limit: 15,
        page,
      }),
  });
}
