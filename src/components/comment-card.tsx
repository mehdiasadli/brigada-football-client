import { useState } from 'react';
import { Paper, Group, Avatar, Text, ActionIcon, Menu, Box, Badge, Textarea, Button, rem } from '@mantine/core';
import { IconDots, IconTrash, IconCheck, IconX, IconClock } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { GetCommentsOfPostResponse } from '../api/comments/comments.responses';
import { Link } from 'react-router-dom';
import CommentActions from './comment-actions';
import { modals } from '@mantine/modals';
import { useDeleteComment } from '../api/comments/comments.mutations';

dayjs.extend(relativeTime);

interface CommentCardProps {
  comment: GetCommentsOfPostResponse;
  currentUserId: string;
  onUpdate: (commentId: string, newContent: string) => void;
}

export default function CommentCard({ comment, currentUserId, onUpdate }: CommentCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const deleteMutation = useDeleteComment(comment.postId);

  const isOwnComment = comment.authorId === currentUserId;
  const isAuthor = comment.authorId === currentUserId;
  const isEdited = comment.editedAt !== null;

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
    deleteMutation.mutate(comment.id);
  };

  const openDeleteModal = () =>
    modals.openConfirmModal({
      title: 'Delete comment',
      children: <Text>Are you sure you want to delete this comment?</Text>,
      labels: {
        confirm: 'Delete',
        cancel: 'Cancel',
      },
      onConfirm: handleDelete,
    });

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
        border: '2px solid var(--mantine-color-gray-2)',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 8px 25px rgba(0, 0, 0, 0.1)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
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
              <Text size='sm' fw={600} c='gray.8' component={Link} to={`/users/${comment.author.username}`}>
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

              {isAuthor && (
                <Badge size='xs' radius='xl' variant='light' color='blue'>
                  OP
                </Badge>
              )}
            </Group>

            {/* Actions Menu */}
            <Menu shadow='lg' width={180} position='bottom-end' withArrow>
              <Menu.Target>
                <ActionIcon
                  loading={deleteMutation.isPending}
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
                {/* <Menu.Item leftSection={<IconCopy size={14} />} onClick={handleCopyLink}>
                  Copy link
                </Menu.Item> */}

                {(isOwnComment || isAuthor) && (
                  <>
                    {/* <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => setIsEditing(true)}>
                      Edit
                    </Menu.Item> */}

                    <Menu.Item leftSection={<IconTrash size={14} />} color='red' onClick={openDeleteModal}>
                      Delete
                    </Menu.Item>
                  </>
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
          <CommentActions postId={comment.postId} comment={comment} isEditing={isEditing} />
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
