/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useForm } from '@mantine/form';
import { createPostSchema, type CreatePostSchema } from '../schemas/posts.schema';
import { zodResolver } from 'mantine-form-zod-resolver';
import {
  Container,
  Paper,
  Title,
  Textarea,
  Switch,
  Button,
  Group,
  Text,
  ThemeIcon,
  Box,
  Stack,
  SegmentedControl,
  rem,
  Card,
  Avatar,
  Divider,
  ActionIcon,
} from '@mantine/core';
import {
  IconWorld,
  IconLock,
  // IconUsers,
  IconPin,
  IconSend,
  IconArrowLeft,
  IconSparkles,
  IconEdit,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { PostVisibility } from '../schemas/entities/post.entity';
import { useUserStore } from '../stores/user.store';
import { useCreatePost } from '../api/posts/posts.mutations';

const visibilityMap = {
  [PostVisibility.enum.PUBLIC]: {
    Icon: IconWorld,
    color: 'blue',
    label: 'Public',
    description: 'Anyone can see this post',
  },
  [PostVisibility.enum.PRIVATE]: {
    Icon: IconLock,
    color: 'red',
    label: 'Private',
    description: 'Only you can see this post',
  },
  // [PostVisibility.enum.FRIENDS]: {
  //   Icon: IconUsers,
  //   color: 'green',
  //   label: 'Friends',
  //   description: 'Only your friends can see this post',
  // },
};

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const currentUser = useUserStore((state) => state.user)!;

  const form = useForm<CreatePostSchema>({
    initialValues: {
      content: '',
      images: [],
      isPinned: false,
      visibility: PostVisibility.enum.PUBLIC,
    },
    validate: zodResolver(createPostSchema),
  });
  const mutation = useCreatePost();

  const onSubmit = form.onSubmit((values) => {
    mutation.mutate(values);
  });

  const selectedVisibility = visibilityMap[form.getValues().visibility as keyof typeof visibilityMap];

  return (
    <Container size='md' py='xl'>
      {/* Header */}
      <Box mb='xl'>
        <Group justify='space-between' align='center' mb='md'>
          <Group gap='sm'>
            <ActionIcon
              size='lg'
              variant='subtle'
              color='gray'
              onClick={() => navigate(-1)}
              style={{
                transition: 'all 0.2s ease',
              }}
            >
              <IconArrowLeft size={20} />
            </ActionIcon>

            <Box>
              <Group gap='xs' align='center'>
                <ThemeIcon size='md' radius='xl' variant='gradient' gradient={{ from: 'green.6', to: 'teal.6' }}>
                  <IconEdit size={16} />
                </ThemeIcon>

                <Title order={2} size='h1' c='gray.8'>
                  Create Post
                </Title>
              </Group>

              <Text size='sm' c='dimmed' mt={rem(4)}>
                Share your football thoughts with the community
              </Text>
            </Box>
          </Group>
        </Group>

        {/* Author Preview */}
        <Card
          shadow='sm'
          padding='md'
          radius='lg'
          style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.03) 0%, rgba(20, 184, 166, 0.03) 100%)',
            border: '1px solid rgba(34, 197, 94, 0.1)',
          }}
        >
          <Group gap='sm'>
            <Avatar
              size='md'
              src={currentUser.avatar}
              alt='Your avatar'
              style={{
                border: '2px solid var(--mantine-color-green-3)',
              }}
            >
              {currentUser.username.charAt(0).toUpperCase()}
            </Avatar>

            <Box style={{ flex: 1 }}>
              <Text size='sm' fw={600} c='gray.8'>
                {currentUser.firstName} {currentUser.lastName}
              </Text>

              <Group gap='xs' align='center'>
                <selectedVisibility.Icon size={12} color={`var(--mantine-color-${selectedVisibility.color}-6)`} />
                <Text size='xs' c='dimmed'>
                  {selectedVisibility.label}
                </Text>

                {form.getValues().isPinned && (
                  <>
                    <Text size='xs' c='dimmed'>
                      •
                    </Text>
                    <IconPin size={12} color='var(--mantine-color-orange-6)' />
                    <Text size='xs' c='orange.6' fw={500}>
                      Pinned
                    </Text>
                  </>
                )}
              </Group>
            </Box>
          </Group>
        </Card>
      </Box>

      {/* Main Form */}
      <form onSubmit={onSubmit}>
        <Stack gap='xl'>
          {/* Content Input */}
          <Paper
            shadow='sm'
            p='lg'
            radius='lg'
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
              border: '1px solid var(--mantine-color-gray-2)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Decorative elements */}
            <Box
              style={{
                position: 'absolute',
                top: rem(-50),
                right: rem(-50),
                width: rem(100),
                height: rem(100),
                background: 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none',
              }}
            />

            <Stack gap='md'>
              <Group justify='space-between' align='center'>
                <Text size='lg' fw={600} c='gray.8'>
                  What's on your mind?
                </Text>

                <ThemeIcon
                  size='sm'
                  variant='light'
                  color='green'
                  style={{
                    animation: form.getValues().content ? 'pulse 2s ease-in-out infinite' : 'none',
                  }}
                >
                  <IconSparkles size={12} />
                </ThemeIcon>
              </Group>

              <Textarea
                placeholder='Share your football experience, match highlights, training tips, or anything soccer-related...'
                minRows={6}
                maxRows={12}
                autosize
                {...form.getInputProps('content')}
                styles={{
                  input: {
                    fontSize: rem(16),
                    lineHeight: 1.6,
                    border: 'none',
                    background: 'transparent',
                    resize: 'none',
                    '&:focus': {
                      outline: 'none',
                    },
                  },
                }}
              />

              {/* Character count */}
              <Group justify='space-between' align='center'>
                <Text size='xs' c='dimmed'>
                  Express yourself freely
                </Text>

                <Text size='xs' c={form.getValues().content.length > 280 ? 'red' : 'dimmed'}>
                  {form.getValues().content.length} characters
                </Text>
              </Group>
            </Stack>
          </Paper>

          {/* Visibility Settings */}
          <Paper shadow='sm' p='lg' radius='lg'>
            <Stack gap='md'>
              <Group gap='xs' align='center'>
                <ThemeIcon size='sm' variant='light' color='blue'>
                  <IconWorld size={12} />
                </ThemeIcon>
                <Text size='md' fw={600} c='gray.8'>
                  Who can see this post?
                </Text>
              </Group>

              <SegmentedControl
                value={form.getValues().visibility}
                onChange={(value) => form.setFieldValue('visibility', value as any)}
                color='white'
                data={Object.entries(visibilityMap).map(([key, config]) => ({
                  value: key,
                  label: (
                    <Group gap='xs' justify='center'>
                      <config.Icon size={16} />
                      <Text size='sm'>{config.label}</Text>
                    </Group>
                  ),
                }))}
                fullWidth
                size='md'
                radius='lg'
                styles={{
                  root: {
                    background: 'var(--mantine-color-gray-1)',
                  },
                  control: {
                    border: 'none',
                  },
                  indicator: {
                    background: `linear-gradient(135deg, var(--mantine-color-${selectedVisibility.color}-5) 0%, var(--mantine-color-${selectedVisibility.color}-6) 100%)`,
                    boxShadow: `0 2px 8px var(--mantine-color-${selectedVisibility.color}-3)`,
                  },
                }}
              />

              <Text size='sm' c='dimmed' ta='center'>
                {selectedVisibility.description}
              </Text>
            </Stack>
          </Paper>

          {/* Pin Option */}
          <Paper shadow='sm' p='lg' radius='lg'>
            <Group justify='space-between' align='center'>
              <Group gap='sm'>
                <ThemeIcon
                  size='md'
                  variant='light'
                  color='orange'
                  style={{
                    transform: form.getValues().isPinned ? 'rotate(25deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                  }}
                >
                  <IconPin size={16} />
                </ThemeIcon>

                <Box>
                  <Text size='md' fw={600} c='gray.8'>
                    Pin to Profile
                  </Text>
                  <Text size='sm' c='dimmed'>
                    This post will appear at the top of your profile
                  </Text>
                </Box>
              </Group>

              <Switch
                size='lg'
                color='orange'
                {...form.getInputProps('isPinned', { type: 'checkbox' })}
                styles={{
                  track: {
                    cursor: 'pointer',
                  },
                }}
              />
            </Group>
          </Paper>

          <Divider />

          {/* Submit Button */}
          <Group justify='space-between' align='center'>
            <Text size='sm' c='dimmed'>
              Ready to share with the community?
            </Text>

            <Button
              type='submit'
              size='lg'
              radius='xl'
              loading={mutation.isPending}
              disabled={!form.getValues().content.trim()}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                background:
                  'linear-gradient(135deg, var(--mantine-color-green-6) 0%, var(--mantine-color-teal-6) 100%)',
                border: 'none',
                boxShadow: isHovered ? '0 8px 25px rgba(34, 197, 94, 0.4)' : '0 4px 15px rgba(34, 197, 94, 0.3)',
                transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                minWidth: rem(140),
                position: 'relative',
                overflow: 'hidden',
              }}
              leftSection={
                <IconSend
                  size={18}
                  style={{
                    transform: isHovered ? 'translateX(2px)' : 'translateX(0)',
                    transition: 'transform 0.3s ease',
                  }}
                />
              }
            >
              <Text size='sm' fw={600} c='white'>
                {mutation.isPending ? 'Publishing...' : 'Publish Post'}
              </Text>

              {/* Animated shine effect */}
              <Box
                style={{
                  position: 'absolute',
                  top: 0,
                  left: isHovered ? '100%' : '-100%',
                  width: '50%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  transition: 'left 0.6s ease',
                  pointerEvents: 'none',
                  transform: 'skewX(-20deg)',
                }}
              />
            </Button>
          </Group>
        </Stack>
      </form>

      <style>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }
      `}</style>
    </Container>
  );
}
