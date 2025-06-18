import { ActionIcon, Group, Text, Tooltip } from '@mantine/core';
import { IconHeart, IconHeartFilled } from '@tabler/icons-react';
import { useCommentLike } from '../api/likes/likes.mutations';
import { useUserStore } from '../stores/user.store';
import { useState } from 'react';
import type { GetCommentsOfPostResponse } from '../api/comments/comments.responses';

interface CommentActionsProps {
  postId: string;
  comment: GetCommentsOfPostResponse;
  isEditing: boolean;
}

export default function CommentActions({ postId, comment, isEditing }: CommentActionsProps) {
  const user = useUserStore((state) => state.user)!;
  const mutation = useCommentLike(postId);
  const [isLiked, setIsLiked] = useState(comment.likes.some((like) => like.userId === user.id));
  const [likesCount, setLikesCount] = useState(comment.likes.length);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);

  const handleLike = async () => {
    if (isLikeAnimating) return;

    setIsLikeAnimating(true);

    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    mutation.mutate(comment.id);
    setTimeout(() => setIsLikeAnimating(false), 300);
  };

  return (
    !isEditing && (
      <Group gap='lg' mt='md'>
        {/* Like Button */}
        <Tooltip label={isLiked ? 'Unlike comment' : 'Like comment'} position='top' withArrow>
          <Group gap='xs' style={{ cursor: 'pointer' }} onClick={handleLike}>
            <ActionIcon
              size='md'
              radius='xl'
              variant={isLiked ? 'filled' : 'subtle'}
              color={isLiked ? 'blue' : 'gray'}
              style={{
                background: isLiked
                  ? 'linear-gradient(135deg, var(--mantine-color-blue-5) 0%, var(--mantine-color-cyan-5) 100%)'
                  : 'transparent',
                transform: isLikeAnimating ? 'scale(1.2) rotate(10deg)' : 'scale(1) rotate(0deg)',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: isLiked ? '0 3px 12px rgba(59, 130, 246, 0.3)' : '0 1px 4px rgba(0, 0, 0, 0.1)',
              }}
              onMouseEnter={(e) => {
                if (!isLiked) {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.background = 'var(--mantine-color-blue-0)';
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
                  size={14}
                  style={{
                    animation: isLikeAnimating ? 'heartPulse 0.6s ease-in-out' : 'none',
                  }}
                />
              ) : (
                <IconHeart size={14} />
              )}
            </ActionIcon>

            {likesCount > 0 && (
              <Text
                size='xs'
                fw={600}
                c={isLiked ? 'blue.6' : 'gray.6'}
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
      </Group>
    )
  );
}
