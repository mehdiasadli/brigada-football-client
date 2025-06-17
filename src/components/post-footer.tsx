import { useState } from 'react';
import { Group, ActionIcon, Text, Box, Divider, Tooltip, Menu } from '@mantine/core';
import {
  IconHeart,
  IconHeartFilled,
  IconMessageCircle,
  // IconBookmark,
  // IconBookmarkFilled,
  IconDots,
  IconTrash,
} from '@tabler/icons-react';
import type { FeedPostResponse } from '../api/feed/feed.responses';
import { useUserStore } from '../stores/user.store';
import { Link } from 'react-router-dom';
import { useLike } from '../api/likes/likes.mutations';
import { useDeletePost } from '../api/posts/posts.mutations';
import { modals } from '@mantine/modals';
import ShareMenu from './share-menu';

interface PostFooterProps {
  post: FeedPostResponse;
  detail?: boolean;
}

export default function PostFooter({ post, detail = false }: PostFooterProps) {
  const user = useUserStore((state) => state.user)!;
  const isAuthor = post.author.id === user.id;

  // Mock state - replace with real API calls later
  const [isLiked, setIsLiked] = useState(post.likes.some((like) => like.userId === user.id));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  // const [isBookmarked, setIsBookmarked] = useState(false);
  const [commentsCount] = useState(post._count.comments);

  const likeMutation = useLike();
  const deleteMutation = useDeletePost();

  const openDeleteModal = () =>
    modals.openConfirmModal({
      title: 'Delete Post',
      children: 'Are you sure you want to delete this post? This action cannot be undone.',
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: {
        color: 'red',
        loading: deleteMutation.isPending,
        variant: 'filled',
      },
      cancelProps: { variant: 'light' },
      zIndex: 10000,
      onConfirm: () => {
        deleteMutation.mutate(post.id);
        modals.closeAll();
      },
    });

  // Animation states
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [isCommentHovered, setIsCommentHovered] = useState(false);

  const handleLike = async () => {
    if (isLikeAnimating) return;

    setIsLikeAnimating(true);

    // Optimistic update
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    likeMutation.mutate(post.id);
    setTimeout(() => setIsLikeAnimating(false), 300);
  };

  // const handleBookmark = () => {
  //   setIsBookmarked(!isBookmarked);
  //   console.log('Toggle bookmark for post:', post.id);

  //   notifications.show({
  //     title: isBookmarked ? 'Removed from saves' : 'Saved!',
  //     message: isBookmarked ? 'Post removed from your saves' : 'Post saved to your collection',
  //     color: isBookmarked ? 'orange' : 'blue',
  //     autoClose: 2000,
  //   });
  // };

  return (
    <Box>
      <Divider
        my='md'
        style={{
          background: 'linear-gradient(90deg, transparent 0%, var(--mantine-color-gray-3) 50%, transparent 100%)',
          height: '1px',
          border: 'none',
        }}
      />

      <Group justify='space-between' align='center'>
        {/* Left section - Like and Comment */}
        <Group gap='lg'>
          {/* Like Button */}
          <Tooltip label={isLiked ? 'Unlike this post' : 'Like this post'} position='top' withArrow>
            <Group gap='xs' style={{ cursor: 'pointer' }} onClick={handleLike}>
              <ActionIcon
                size='lg'
                radius='xl'
                variant={isLiked ? 'filled' : 'subtle'}
                color={isLiked ? 'red' : 'gray'}
                style={{
                  background: isLiked
                    ? 'linear-gradient(135deg, var(--mantine-color-red-5) 0%, var(--mantine-color-pink-5) 100%)'
                    : 'transparent',
                  transform: isLikeAnimating ? 'scale(1.3) rotate(15deg)' : 'scale(1) rotate(0deg)',
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  boxShadow: isLiked ? '0 4px 15px rgba(239, 68, 68, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
                onMouseEnter={(e) => {
                  if (!isLiked) {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.background = 'var(--mantine-color-red-0)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLiked) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {isLiked ? (
                  <IconHeartFilled
                    size={18}
                    style={{
                      animation: isLikeAnimating ? 'heartbeat 0.6s ease-in-out' : 'none',
                    }}
                  />
                ) : (
                  <IconHeart size={18} />
                )}
              </ActionIcon>

              {likesCount > 0 && (
                <Text
                  size='sm'
                  fw={600}
                  c={isLiked ? 'red.6' : 'gray.6'}
                  style={{
                    transition: 'all 0.3s ease',
                    transform: isLikeAnimating ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  {likesCount}
                </Text>
              )}
            </Group>
          </Tooltip>

          {/* Comment Button */}
          {!detail && (
            <Tooltip label='Comment on this post' position='top' withArrow>
              <Group
                display='none'
                component={Link}
                // @ts-expect-error - Mantine error
                to={`/posts/c/${post.id}`}
                gap='xs'
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setIsCommentHovered(true)}
                onMouseLeave={() => setIsCommentHovered(false)}
              >
                <ActionIcon
                  size='lg'
                  radius='xl'
                  variant='subtle'
                  color='blue'
                  style={{
                    transform: isCommentHovered ? 'scale(1.1) rotate(-5deg)' : 'scale(1) rotate(0deg)',
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    background: isCommentHovered ? 'var(--mantine-color-blue-0)' : 'transparent',
                  }}
                >
                  <IconMessageCircle
                    size={18}
                    style={{
                      transform: isCommentHovered ? 'scale(1.1)' : 'scale(1)',
                      transition: 'transform 0.3s ease',
                    }}
                  />
                </ActionIcon>

                {commentsCount > 0 && (
                  <Text size='sm' fw={600} c='blue.6'>
                    {commentsCount}
                  </Text>
                )}
              </Group>
            </Tooltip>
          )}
        </Group>

        {/* Right section - Share and More */}
        <Group gap='xs'>
          {/* Bookmark Button */}
          {/* <Tooltip label={isBookmarked ? 'Remove from saves' : 'Save post'} position='top' withArrow>
            <ActionIcon
              size='lg'
              radius='xl'
              variant={isBookmarked ? 'filled' : 'subtle'}
              color={isBookmarked ? 'orange' : 'gray'}
              onClick={handleBookmark}
              style={{
                background: isBookmarked
                  ? 'linear-gradient(135deg, var(--mantine-color-orange-5) 0%, var(--mantine-color-yellow-5) 100%)'
                  : 'transparent',
                transition: 'all 0.3s ease',
                boxShadow: isBookmarked ? '0 4px 15px rgba(251, 146, 60, 0.3)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (!isBookmarked) {
                  e.currentTarget.style.background = 'var(--mantine-color-orange-0)';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isBookmarked) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              {isBookmarked ? <IconBookmarkFilled size={18} /> : <IconBookmark size={18} />}
            </ActionIcon>
          </Tooltip> */}

          {/* Share Menu */}
          <ShareMenu
            label='Share this post'
            copyLink={`${window.location.origin}/posts/c/${post.id}`}
            copyMessage='Post link copied to clipboard'
            sharePath={`/posts/c/${post.id}`}
            shareText={`Check out this post by ${post.author.firstName} ${post.author.lastName}`}
          />

          {/* Author Menu */}
          {isAuthor && (
            <Menu shadow='lg' width={160} position='top-end' withArrow>
              <Menu.Target>
                <ActionIcon
                  size='lg'
                  radius='xl'
                  variant='subtle'
                  color='gray'
                  style={{
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--mantine-color-gray-1)';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <IconDots size={18} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item leftSection={<IconTrash size={16} />} color='red' onClick={openDeleteModal}>
                  Delete post
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </Group>

      <style>{`
        @keyframes heartbeat {
          0% { transform: scale(1); }
          25% { transform: scale(1.3); }
          50% { transform: scale(1.1); }
          75% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>
    </Box>
  );
}
