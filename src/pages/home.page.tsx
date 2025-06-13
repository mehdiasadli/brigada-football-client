import { Container, Stack } from '@mantine/core';
import { useFeed } from '../api/feed/feed.queries';
import InfiniteList from '../components/infinite-list';
import { isMatch, isPost } from '../api/feed/feed.responses';
import FeedPostCard from '../components/feed-post-card';
import FeedMatchCard from '../components/feed-match-card';
import CreatePostButton from '../components/create-post-button';

export default function HomePage() {
  const result = useFeed();

  return (
    <Container size='md'>
      <Stack>
        <CreatePostButton onClick='/posts/create' />
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
