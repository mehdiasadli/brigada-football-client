import { useState } from 'react';
import { useParams } from 'react-router-dom';
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
  const [comments, setComments] = useState<Comment[]>([
    // Mock comments for demo
    {
      id: '1',
      content:
        'Great post! Really enjoyed reading about your match experience. The atmosphere must have been incredible! ⚽',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      editedAt: null,
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      postId: postId,
      authorId: 'user1',
      author: {
        id: 'user1',
        firstName: 'Alex',
        lastName: 'Johnson',
        username: 'alexj',
        avatar: null,
      },
      likes: [{ userId: 'user2' }, { userId: 'user3' }],
    },
    {
      id: '2',
      content: 'I was there too! What an amazing game. The second half was absolutely thrilling.',
      createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      editedAt: new Date(Date.now() - 30 * 60 * 1000), // edited 30 minutes ago
      updatedAt: new Date(Date.now() - 30 * 60 * 1000),
      postId: postId,
      authorId: 'user2',
      author: {
        id: 'user2',
        firstName: 'Maria',
        lastName: 'Garcia',
        username: 'mariag',
        avatar: null,
      },
      likes: [{ userId: 'user1' }],
    },
    {
      id: '3',
      content: 'Thanks for sharing! Looking forward to the next match 🔥',
      createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      editedAt: null,
      updatedAt: new Date(Date.now() - 15 * 60 * 1000),
      postId: postId,
      authorId: 'user3',
      author: {
        id: 'user3',
        firstName: 'David',
        lastName: 'Smith',
        username: 'davidsmith',
        avatar: null,
      },
      likes: [],
    },
  ]);

  const addComment = (content: string) => {
    const newComment: Comment = {
      id: `temp-${Date.now()}`,
      content,
      createdAt: new Date(),
      editedAt: null,
      updatedAt: new Date(),
      postId: postId,
      authorId: 'current-user', // Replace with actual current user ID
      author: {
        id: 'current-user',
        firstName: 'John', // Replace with actual current user data
        lastName: 'Doe',
        username: 'johndoe',
        avatar: null,
      },
      likes: [],
    };

    setComments((prev) => [newComment, ...prev]);
    console.log('Added comment:', newComment);
  };

  const updateComment = (commentId: string, newContent: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              content: newContent,
              editedAt: new Date(),
              updatedAt: new Date(),
            }
          : comment
      )
    );
    console.log('Updated comment:', commentId, newContent);
  };

  const deleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    console.log('Deleted comment:', commentId);
  };

  const toggleCommentLike = (commentId: string, userId: string) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          const isLiked = comment.likes.some((like) => like.userId === userId);
          return {
            ...comment,
            likes: isLiked ? comment.likes.filter((like) => like.userId !== userId) : [...comment.likes, { userId }],
          };
        }
        return comment;
      })
    );
    console.log('Toggled like for comment:', commentId);
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
            display='none'
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
                    {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
                  </Text>
                </Group>
              </Group>

              <Divider />

              {/* Add Comment */}
              <AddComment onSubmit={addComment} />

              {/* Comments List */}
              <CommentList
                comments={comments}
                onUpdate={updateComment}
                onDelete={deleteComment}
                onToggleLike={toggleCommentLike}
              />
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
