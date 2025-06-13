import { Container, Stack } from '@mantine/core';
import { useFeed } from '../api/feed/feed.queries';
import InfiniteList from '../components/infinite-list';
import type { FeedMatchResponse, FeedPostResponse, GetFeedResponse } from '../api/feed/feed.responses';
import FeedPostCard from '../components/feed-post-card';
import FeedMatchCard from '../components/feed-match-card';

export default function HomePage() {
  const result = useFeed();

  return (
    <Container size='md'>
      <Stack>
        <InfiniteList
          result={result}
          cols={1}
          render={(item) => {
            if (isMatch(item)) {
              return <FeedMatchCard match={item} />;
            }

            if (isPost(item)) {
              return <FeedPostCard post={item} />;
            }

            return null;
          }}
        />
      </Stack>
    </Container>
  );
}

function isMatch(item: GetFeedResponse): item is FeedMatchResponse {
  return 'creatorId' in item;
}

function isPost(item: GetFeedResponse): item is FeedPostResponse {
  return 'authorId' in item;
}
