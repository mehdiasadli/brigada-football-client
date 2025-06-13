import { Stack, Text } from '@mantine/core';
import type { FeedPostResponse } from '../api/feed/feed.responses';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import FeedCardWrapper from './feed-card-wrapper';
import { Link } from 'react-router-dom';
import PostFooter from './post-footer';

dayjs.extend(relativeTime);

interface FeedPostCard {
  post: FeedPostResponse;
  detail?: boolean;
}

export default function FeedPostCard({ post, detail = false }: FeedPostCard) {
  return (
    <FeedCardWrapper
      author={post.author}
      createdAt={post.createdAt}
      visibility={post.visibility}
      isPinned={post.isPinned}
    >
      <Stack>
        <Text component={detail ? undefined : Link} to={`/posts/c/${post.id}`}>
          {post.content}
        </Text>
        <PostFooter post={post} detail={detail} />
      </Stack>
    </FeedCardWrapper>
  );
}
