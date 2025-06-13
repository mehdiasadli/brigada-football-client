import { useState } from 'react';
import {
  Paper,
  Group,
  Avatar,
  Text,
  ActionIcon,
  Menu,
  Box,
  Badge,
  Textarea,
  Button,
  Tooltip,
  rem,
} from '@mantine/core';
import {
  IconHeart,
  IconHeartFilled,
  IconDots,
  IconEdit,
  IconTrash,
  IconFlag,
  IconCopy,
  IconCheck,
  IconX,
  IconClock,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { Comment } from '../pages/post.page';

dayjs.extend(relativeTime);

interface CommentCardProps {
  comment: Comment;
  currentUserId: string;
  onUpdate: (commentId: string, newContent: string) => void;
  onDelete: (commentId: string) => void;
  onToggleLike: (commentId: string, userId: string) => void;
}

export default function CommentCard({ comment, currentUserId, onUpdate, onDelete, onToggleLike }: CommentCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isOwnComment = comment.authorId === currentUserId;
  const isLiked = comment.likes.some((like) => like.userId === currentUserId);
  const likesCount = comment.likes.length;
  const isEdited = comment.editedAt !== null;

  const handleLike = async () => {
    if (isLikeAnimating) return;

    setIsLikeAnimating(true);

    try {
      await onToggleLike(comment.id, currentUserId);

      if (!isLiked) {
        notifications.show({
          title: '💙 Liked!',
          message: 'You liked this comment',
          color: 'blue',
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error(error);

      notifications.show({
        title: 'Error',
        message: 'Failed to update like',
        color: 'red',
      });
    } finally {
      setTimeout(() => setIsLikeAnimating(false), 300);
    }
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim() || editContent === comment.content || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await onUpdate(comment.id, editContent.trim());
      setIsEditing(false);

      notifications.show({
        title: '✅ Updated!',
        message: 'Comment updated successfully',
        color: 'green',
        autoClose: 2000,
      });
    } catch (error) {
      console.error(error);

      notifications.show({
        title: 'Error',
        message: 'Failed to update comment',
        color: 'red',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      await onDelete(comment.id);

      notifications.show({
        title: '🗑️ Deleted',
        message: 'Comment deleted successfully',
        color: 'orange',
        autoClose: 2000,
      });
    } catch (error) {
      console.error(error);

      notifications.show({
        title: 'Error',
        message: 'Failed to delete comment',
        color: 'red',
      });
    }
  };

  const handleCopyLink = () => {
    const commentUrl = `${window.location.href}#comment-${comment.id}`;
    navigator.clipboard.writeText(commentUrl);

    notifications.show({
      title: 'Link copied!',
      message: 'Comment link copied to clipboard',
      color: 'green',
      autoClose: 2000,
    });
  };

  const handleReport = () => {
    console.log('Report comment:', comment.id);
    notifications.show({
      title: 'Report submitted',
      message: 'Thank you for reporting this comment',
      color: 'blue',
      autoClose: 3000,
    });
  };

  return (
    <Paper
      id={`comment-${comment.id}`}
      p='lg'
      radius='lg'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: isOwnComment
          ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.02) 0%, rgba(20, 184, 166, 0.02) 100%)'
          : 'linear-gradient(135deg, white 0%, var(--mantine-color-gray-0) 100%)',
        border: isOwnComment ? '2px solid var(--mantine-color-green-2)' : '2px solid var(--mantine-color-gray-2)',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 8px 25px rgba(0, 0, 0, 0.1)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Own comment indicator */}
      {isOwnComment && (
        <Box
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: rem(3),
            background: 'linear-gradient(90deg, var(--mantine-color-green-6) 0%, var(--mantine-color-teal-6) 100%)',
          }}
        />
      )}

      <Group align='flex-start' gap='md'>
        {/* Avatar */}
        <Avatar
          size='md'
          src={comment.author.avatar}
          alt={`${comment.author.firstName} ${comment.author.lastName}`}
          style={{
            border: isOwnComment ? '3px solid var(--mantine-color-green-3)' : '3px solid var(--mantine-color-gray-3)',
            transition: 'border-color 0.3s ease',
          }}
        >
          {comment.author.firstName[0]}
          {comment.author.lastName[0]}
        </Avatar>

        {/* Content */}
        <Box style={{ flex: 1 }}>
          {/* Header */}
          <Group justify='space-between' align='center' mb='xs'>
            <Group gap='xs' align='center'>
              <Text size='sm' fw={600} c='gray.8'>
                {comment.author.firstName} {comment.author.lastName}
              </Text>

              <Text size='xs' c='dimmed'>
                @{comment.author.username}
              </Text>

              {isOwnComment && (
                <Badge
                  size='xs'
                  radius='xl'
                  variant='light'
                  color='green'
                  style={{
                    textTransform: 'none',
                  }}
                >
                  You
                </Badge>
              )}
            </Group>

            {/* Actions Menu */}
            <Menu shadow='lg' width={180} position='bottom-end' withArrow>
              <Menu.Target>
                <ActionIcon
                  size='sm'
                  variant='subtle'
                  color='gray'
                  style={{
                    opacity: isHovered ? 1 : 0.6,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <IconDots size={14} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item leftSection={<IconCopy size={14} />} onClick={handleCopyLink}>
                  Copy link
                </Menu.Item>

                {isOwnComment && (
                  <>
                    <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => setIsEditing(true)}>
                      Edit
                    </Menu.Item>

                    <Menu.Item leftSection={<IconTrash size={14} />} color='red' onClick={handleDelete}>
                      Delete
                    </Menu.Item>
                  </>
                )}

                {!isOwnComment && (
                  <Menu.Item leftSection={<IconFlag size={14} />} color='red' onClick={handleReport}>
                    Report
                  </Menu.Item>
                )}
              </Menu.Dropdown>
            </Menu>
          </Group>

          {/* Timestamp */}
          <Group gap='xs' mb='sm'>
            <IconClock size={12} color='var(--mantine-color-gray-5)' />
            <Text size='xs' c='dimmed'>
              {dayjs(comment.createdAt).fromNow()}
            </Text>

            {isEdited && (
              <>
                <Text size='xs' c='dimmed'>
                  •
                </Text>
                <Text size='xs' c='dimmed' style={{ fontStyle: 'italic' }}>
                  edited {dayjs(comment.editedAt).fromNow()}
                </Text>
              </>
            )}
          </Group>

          {/* Content */}
          {isEditing ? (
            <Box>
              <Textarea
                value={editContent}
                onChange={(event) => setEditContent(event.currentTarget.value)}
                minRows={2}
                maxRows={6}
                autosize
                placeholder='Edit your comment...'
                mb='sm'
                styles={{
                  input: {
                    fontSize: rem(14),
                    lineHeight: 1.5,
                  },
                }}
              />

              <Group gap='xs'>
                <Button
                  size='xs'
                  radius='xl'
                  onClick={handleSaveEdit}
                  loading={isSubmitting}
                  disabled={!editContent.trim() || editContent === comment.content}
                  style={{
                    background:
                      'linear-gradient(135deg, var(--mantine-color-green-6) 0%, var(--mantine-color-teal-6) 100%)',
                  }}
                  leftSection={<IconCheck size={12} />}
                >
                  Save
                </Button>

                <Button
                  size='xs'
                  radius='xl'
                  variant='subtle'
                  color='gray'
                  onClick={handleCancelEdit}
                  leftSection={<IconX size={12} />}
                >
                  Cancel
                </Button>
              </Group>
            </Box>
          ) : (
            <Text
              size='sm'
              style={{
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {comment.content}
            </Text>
          )}

          {/* Actions */}
          {!isEditing && (
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
          )}
        </Box>
      </Group>

      <style>{`
        @keyframes heartPulse {
          0% { transform: scale(1); }
          25% { transform: scale(1.3); }
          50% { transform: scale(1.1); }
          75% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>
    </Paper>
  );
}
