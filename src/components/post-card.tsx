import { Group, Card, Text, Badge, ActionIcon, Stack, Box, Menu } from '@mantine/core';
import { IconTrash, IconDots, IconEye, IconCalendar, IconPin } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import type { PostsResponse } from '../api/feed/feed.responses';
import { useDeletePost } from '../api/posts/posts.mutations';
import { modals } from '@mantine/modals';
import dayjs from 'dayjs';
import { useUserStore } from '../stores/user.store';
import { UserRole } from '../schemas/entities/user.entity';

interface PostCardProps {
  post: PostsResponse;
}

export default function PostCard({ post }: PostCardProps) {
  const mutation = useDeletePost();
  const currentUser = useUserStore((state) => state.user)!;

  const isSuperAdmin = currentUser.role === UserRole.enum.SUPER_ADMIN;
  const authorRole = post.author.role;
  const isOwnPost = currentUser.id === post.author.id;

  const canDeletePost =
    isOwnPost ||
    (authorRole !== UserRole.enum.SUPER_ADMIN && authorRole !== UserRole.enum.ADMIN) ||
    (isSuperAdmin && authorRole !== UserRole.enum.SUPER_ADMIN);

  const openDeleteModal = () =>
    modals.openConfirmModal({
      title: 'Delete Post',
      children: 'Are you sure you want to delete this post? This action cannot be undone.',
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: {
        color: 'red',
        loading: mutation.isPending,
        variant: 'filled',
      },
      cancelProps: { variant: 'light' },
      zIndex: 10000,
      onConfirm: () => {
        mutation.mutate(post.id);
        modals.closeAll();
      },
    });

  return (
    <Card shadow='sm' padding='lg' radius='md' style={{ border: '1px solid var(--mantine-color-gray-2)' }}>
      <Card.Section p='md' pb='xs'>
        <Group justify='space-between' align='flex-start'>
          <Box style={{ flex: 1 }}>
            <Group gap='xs' mb='xs'>
              <Text size='lg' fw={600} lineClamp={1}>
                Posted by {post.author.firstName} {post.author.lastName}
              </Text>
            </Group>

            <Group gap='xs' mb='xs'>
              {post.poll && (
                <Badge variant='dot' color='green' size='xs'>
                  Poll
                </Badge>
              )}
              <Text size='sm' c='dimmed' lineClamp={2}>
                {post.content}
              </Text>
            </Group>
          </Box>

          <Menu shadow='md' width={200}>
            <Menu.Target>
              <ActionIcon variant='subtle' color='gray'>
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item component={Link} to={`/posts/c/${post.id}`} leftSection={<IconEye size={14} />}>
                View Post
              </Menu.Item>
              {canDeletePost && (
                <Menu.Item leftSection={<IconTrash size={14} />} color='red' onClick={openDeleteModal}>
                  Delete Post
                </Menu.Item>
              )}
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Card.Section>

      <Box>
        <Text size='sm' fw={500} mb='xs'>
          Post Information
        </Text>
        <Stack gap='xs'>
          <Group gap='xs'>
            <IconCalendar size={12} color='var(--mantine-color-gray-6)' />
            <Text size='xs' c='dimmed'>
              {dayjs(post.createdAt).format('DD.MM.YYYY HH:mm')}
            </Text>
          </Group>
          <Group gap='xs'>
            <IconEye size={12} color='var(--mantine-color-gray-6)' />
            <Text size='xs' c='dimmed'>
              {post.visibility}
            </Text>
          </Group>
          <Group gap='xs'>
            <IconPin size={12} color='var(--mantine-color-gray-6)' />
            <Text size='xs' c='dimmed'>
              {post.isPinned ? 'Pinned' : 'Not pinned'}
            </Text>
          </Group>
        </Stack>
      </Box>

      <Stack gap='md' mt='md'>
        {/* Features */}
        <Box mt={'md'}>
          <Text size='sm' fw={500} mb='xs'>
            Stats
          </Text>
          <Group gap='xs'>
            <Badge variant='dot' color='blue' size='xs'>
              {post.likes.length} likes
            </Badge>
            <Badge variant='dot' color='blue' size='xs'>
              {post._count.comments} comments
            </Badge>
          </Group>
        </Box>
      </Stack>
    </Card>
  );
}
