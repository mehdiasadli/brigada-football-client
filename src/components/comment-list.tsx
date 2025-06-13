import { useState } from 'react';
import { Stack, Text, Box, Button, Group, ThemeIcon, Paper, Pagination, Center, Skeleton } from '@mantine/core';
import {
  IconMessageCircle,
  IconSortDescending,
  IconSortAscending,
  IconClock,
  IconHeart,
  IconSparkles,
} from '@tabler/icons-react';
import CommentCard from './comment-card';
import type { Comment } from '../pages/post.page';

interface CommentListProps {
  comments: Comment[];
  onUpdate: (commentId: string, newContent: string) => void;
  onDelete: (commentId: string) => void;
  onToggleLike: (commentId: string, userId: string) => void;
  loading?: boolean;
}

type SortOption = 'newest' | 'oldest' | 'most-liked';

export default function CommentList({ comments, onUpdate, onDelete, onToggleLike, loading = false }: CommentListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const commentsPerPage = 10;
  const currentUserId = 'current-user'; // Replace with actual current user ID

  // Sort comments based on selected option
  const sortedComments = [...comments].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'most-liked':
        return b.likes.length - a.likes.length;
      default:
        return 0;
    }
  });

  // Paginate comments
  const totalPages = Math.ceil(sortedComments.length / commentsPerPage);
  const startIndex = (currentPage - 1) * commentsPerPage;
  const paginatedComments = sortedComments.slice(startIndex, startIndex + commentsPerPage);

  const handleSortChange = (newSort: SortOption) => {
    if (newSort === sortBy) return;

    setIsAnimating(true);
    setSortBy(newSort);
    setCurrentPage(1);

    setTimeout(() => setIsAnimating(false), 300);
  };

  const getSortIcon = (option: SortOption) => {
    switch (option) {
      case 'newest':
        return <IconSortDescending size={14} />;
      case 'oldest':
        return <IconSortAscending size={14} />;
      case 'most-liked':
        return <IconHeart size={14} />;
      default:
        return <IconClock size={14} />;
    }
  };

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'newest':
        return 'Newest First';
      case 'oldest':
        return 'Oldest First';
      case 'most-liked':
        return 'Most Liked';
      default:
        return 'Default';
    }
  };

  if (loading) {
    return (
      <Stack gap='md'>
        {Array.from({ length: 3 }).map((_, index) => (
          <Paper key={index} p='md' radius='lg' style={{ border: '1px solid var(--mantine-color-gray-2)' }}>
            <Group gap='md' align='flex-start'>
              <Skeleton height={40} width={40} radius='xl' />
              <Box style={{ flex: 1 }}>
                <Skeleton height={16} width='30%' mb='xs' />
                <Skeleton height={14} width='80%' mb='xs' />
                <Skeleton height={14} width='60%' />
              </Box>
            </Group>
          </Paper>
        ))}
      </Stack>
    );
  }

  if (comments.length === 0) {
    return (
      <Paper
        p='xl'
        radius='lg'
        ta='center'
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
          border: '2px dashed var(--mantine-color-blue-3)',
        }}
      >
        <ThemeIcon
          size='xl'
          radius='xl'
          variant='light'
          color='blue'
          mx='auto'
          mb='md'
          style={{
            animation: 'float 3s ease-in-out infinite',
          }}
        >
          <IconMessageCircle size={24} />
        </ThemeIcon>

        <Text size='lg' fw={600} c='gray.7' mb='xs'>
          No comments yet
        </Text>

        <Text size='sm' c='dimmed' mb='lg'>
          Be the first to share your thoughts about this post!
        </Text>

        <Group justify='center' gap='xs'>
          <IconSparkles size={16} color='var(--mantine-color-blue-5)' />
          <Text size='xs' c='blue.6' fw={500}>
            Start the conversation
          </Text>
          <IconSparkles size={16} color='var(--mantine-color-blue-5)' />
        </Group>

        <style>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
        `}</style>
      </Paper>
    );
  }

  return (
    <Stack gap='lg'>
      {/* Sort Controls */}
      <Paper
        p='md'
        radius='lg'
        style={{
          background: 'var(--mantine-color-gray-0)',
          border: '1px solid var(--mantine-color-gray-2)',
        }}
      >
        <Group justify='space-between' align='center'>
          <Group gap='xs'>
            <ThemeIcon size='sm' variant='light' color='blue'>
              <IconClock size={12} />
            </ThemeIcon>
            <Text size='sm' fw={600} c='gray.7'>
              Sort by:
            </Text>
          </Group>

          <Group gap='xs'>
            {(['newest', 'oldest', 'most-liked'] as SortOption[]).map((option) => (
              <Button
                key={option}
                size='xs'
                radius='xl'
                variant={sortBy === option ? 'filled' : 'subtle'}
                color={sortBy === option ? 'blue' : 'gray'}
                onClick={() => handleSortChange(option)}
                leftSection={getSortIcon(option)}
                style={{
                  transition: 'all 0.3s ease',
                  background:
                    sortBy === option
                      ? 'linear-gradient(135deg, var(--mantine-color-blue-6) 0%, var(--mantine-color-cyan-6) 100%)'
                      : 'transparent',
                  transform: sortBy === option ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                <Text size='xs' fw={500}>
                  {getSortLabel(option)}
                </Text>
              </Button>
            ))}
          </Group>
        </Group>
      </Paper>

      {/* Comments */}
      <Box
        style={{
          opacity: isAnimating ? 0.6 : 1,
          transform: isAnimating ? 'translateY(10px)' : 'translateY(0)',
          transition: 'all 0.3s ease',
        }}
      >
        <Stack gap='md'>
          {paginatedComments.map((comment, index) => (
            <Box
              key={comment.id}
              style={{
                animation: `slideInUp 0.4s ease-out ${index * 0.1}s both`,
              }}
            >
              <CommentCard
                comment={comment}
                currentUserId={currentUserId}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onToggleLike={onToggleLike}
              />
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <Center>
          <Paper
            p='sm'
            radius='lg'
            style={{
              background: 'var(--mantine-color-gray-0)',
              border: '1px solid var(--mantine-color-gray-2)',
            }}
          >
            <Pagination
              value={currentPage}
              onChange={setCurrentPage}
              total={totalPages}
              size='sm'
              radius='xl'
              color='blue'
              styles={{
                control: {
                  border: 'none',
                  '&[data-active]': {
                    background:
                      'linear-gradient(135deg, var(--mantine-color-blue-6) 0%, var(--mantine-color-cyan-6) 100%)',
                    color: 'white',
                  },
                },
              }}
            />
          </Paper>
        </Center>
      )}

      {/* Load More Info */}
      {comments.length > commentsPerPage && (
        <Center>
          <Text size='xs' c='dimmed' ta='center'>
            Showing {Math.min(startIndex + commentsPerPage, comments.length)} of {comments.length} comments
          </Text>
        </Center>
      )}

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Stack>
  );
}
