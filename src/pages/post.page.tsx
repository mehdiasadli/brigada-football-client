import { useParams, useSearchParams } from 'react-router-dom';
import {
  Container,
  Stack,
  Box,
  Affix,
  Transition,
  ActionIcon,
  Paper,
  rem,
  Text,
  Group,
  ThemeIcon,
  Divider,
} from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';
import { IconArrowUp, IconMessageCircle, IconUsers } from '@tabler/icons-react';
import { usePost } from '../api/posts/posts.queries';
import ErrorComponent from '../components/error-component';
import LoadingComponent from '../components/loading-component';
import FeedPostCard from '../components/feed-post-card';
import AddComment from '../components/add-comment';
import CommentList from '../components/comment-list';

// Mock comment type based on your specification
export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  editedAt: Date | null;
  updatedAt: Date;
  postId: string;
  authorId: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatar: string | null;
  };
  likes: { userId: string }[];
}

export default function PostPage() {
  const { postId } = useParams() as { postId: string };
  const { data: post, error: postError } = usePost(postId);
  const [scroll] = useWindowScroll();
  const [searchParams] = useSearchParams();

  const isAutoFocusOnComment = searchParams.get('add-comment') === 'true';

  const updateComment = (commentId: string, newContent: string) => {
    // setComments((prev) =>
    //   prev.map((comment) =>
    //     comment.id === commentId
    //       ? {
    //           ...comment,
    //           content: newContent,
    //           editedAt: new Date(),
    //           updatedAt: new Date(),
    //         }
    //       : comment
    //   )
    // );
    console.log('Updated comment:', commentId, newContent);
  };

  if (postError) {
    return <ErrorComponent error={postError} />;
  }

  if (!post || !post.data) {
    return <LoadingComponent />;
  }

  return (
    <Box style={{ minHeight: '100vh', background: 'var(--mantine-color-gray-0)' }}>
      <Container size='md' py='xl'>
        <Stack gap='xl'>
          {/* Post Card */}
          <FeedPostCard post={post.data} detail />

          {/* Comments Section */}
          <Paper
            shadow='lg'
            radius='xl'
            p='xl'
            style={{
              background: 'linear-gradient(135deg, white 0%, var(--mantine-color-gray-0) 100%)',
              border: '2px solid var(--mantine-color-gray-2)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Decorative header */}
            <Box
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: rem(4),
                background: 'linear-gradient(90deg, var(--mantine-color-green-6) 0%, var(--mantine-color-teal-6) 100%)',
              }}
            />

            <Stack gap='lg'>
              {/* Comments Header */}
              <Group justify='space-between' align='center'>
                <Group gap='sm'>
                  <ThemeIcon size='lg' radius='xl' variant='gradient' gradient={{ from: 'blue.6', to: 'cyan.6' }}>
                    <IconMessageCircle size={20} />
                  </ThemeIcon>

                  <Box>
                    <Text size='lg' fw={700} c='gray.8'>
                      Comments
                    </Text>
                    <Text size='sm' c='dimmed'>
                      Join the conversation
                    </Text>
                  </Box>
                </Group>

                <Group gap='xs'>
                  <ThemeIcon size='md' variant='light' color='blue'>
                    <IconUsers size={14} />
                  </ThemeIcon>
                  <Text size='sm' fw={600} c='blue.6'>
                    {post.data._count.comments} {post.data._count.comments === 1 ? 'comment' : 'comments'}
                  </Text>
                </Group>
              </Group>

              <Divider />

              {/* Add Comment */}
              <AddComment postId={postId} autoFocus={isAutoFocusOnComment} />

              {/* Comments List */}
              <CommentList postId={postId} onUpdate={updateComment} />
            </Stack>
          </Paper>
        </Stack>
      </Container>

      {/* Scroll to Top Button */}
      <Affix position={{ bottom: rem(100), right: rem(20) }}>
        <Transition transition='slide-up' mounted={scroll.y > 400}>
          {(transitionStyles) => (
            <ActionIcon
              size='xl'
              radius='xl'
              style={{
                ...transitionStyles,
                background:
                  'linear-gradient(135deg, var(--mantine-color-green-6) 0%, var(--mantine-color-teal-6) 100%)',
                boxShadow: '0 8px 25px rgba(34, 197, 94, 0.4)',
              }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <IconArrowUp size={18} color='white' />
            </ActionIcon>
          )}
        </Transition>
      </Affix>
    </Box>
  );
}
