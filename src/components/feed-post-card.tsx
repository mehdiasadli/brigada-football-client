import { Card, Group, Text, Stack, ThemeIcon } from '@mantine/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import FeedCardWrapper from './feed-card-wrapper';
import { Link } from 'react-router-dom';
import PostFooter from './post-footer';
import PollCard from './poll-card';
import type { GetOnePostResponse } from '../api/posts/posts.service';
import { IconChartBar, IconList } from '@tabler/icons-react';

dayjs.extend(relativeTime);

interface FeedPostCard {
  post: GetOnePostResponse;
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
        {post.poll && (detail ? <PollCard poll={post.poll} /> : <SimplePollCard poll={post.poll} postId={post.id} />)}
        <PostFooter post={post} detail={detail} />
      </Stack>
    </FeedCardWrapper>
  );
}

function SimplePollCard({
  poll,
  postId,
}: {
  poll: { id: string; content: string; _count: { options: number } };
  postId: string;
}) {
  return (
    <Card
      component={Link}
      to={`/posts/c/${postId}`}
      withBorder
      radius='lg'
      p='md'
      style={{
        background: 'linear-gradient(135deg, var(--mantine-color-green-0) 0%, var(--mantine-color-teal-0) 100%)',
        border: '1px solid var(--mantine-color-teal-2)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Stack gap='xs'>
        <Group gap='sm' align='center'>
          <ThemeIcon size='md' radius='xl' variant='gradient' gradient={{ from: 'green.6', to: 'teal.6' }}>
            <IconChartBar size={16} />
          </ThemeIcon>
          <Text fw={600} size='sm' c='gray.8'>
            Poll
          </Text>
        </Group>

        <Text size='md' fw={500} c='gray.8'>
          {poll.content}
        </Text>

        <Group gap='xs'>
          <ThemeIcon size='sm' variant='light' color='teal'>
            <IconList size={12} />
          </ThemeIcon>
          <Text size='sm' c='dimmed'>
            {poll._count?.options ?? 0} options available
          </Text>
        </Group>
      </Stack>
    </Card>
  );
}
