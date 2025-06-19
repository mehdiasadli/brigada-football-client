/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
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
  NumberInput,
  TextInput,
  SimpleGrid,
  Badge,
  Collapse,
  Alert,
} from '@mantine/core';
import {
  IconWorld,
  IconLock,
  IconPin,
  IconSend,
  IconArrowLeft,
  IconSparkles,
  IconEdit,
  IconTrash,
  IconPlus,
  IconEye,
  IconEyeOff,
  IconAlertCircle,
  IconBallFootball,
  IconCheck,
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
  const [attachPoll, setAttachPoll] = useState(false);

  const form = useForm<CreatePostSchema>({
    initialValues: {
      content: '',
      images: [],
      isPinned: false,
      visibility: PostVisibility.enum.PUBLIC,
      poll: null,
    },
    validate: zodResolver(createPostSchema),
    onValuesChange(values) {
      if (values.poll) {
        const optionsCount = values.poll.options.length;

        if (values.poll.maxVotes > optionsCount) {
          values.poll.maxVotes = optionsCount;
        }
      }
    },
  });
  const mutation = useCreatePost();

  const onSubmit = form.onSubmit((values) => {
    mutation.mutate(values);
  });

  useEffect(() => {
    if (attachPoll) {
      form.setFieldValue('poll', {
        content: '',
        isAnonymous: true,
        maxVotes: 1,
        options: [{ content: 'Option 1', image: null }],
      });
    } else {
      form.setFieldValue('poll', null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attachPoll]);

  const selectedVisibility = visibilityMap[form.getValues().visibility as keyof typeof visibilityMap];

  const addPollOption = () => {
    const currentOptions = form.getValues().poll?.options || [];
    form.setFieldValue('poll.options', [
      ...currentOptions,
      { content: `Option ${currentOptions.length + 1}`, image: null },
    ]);
  };

  const removePollOption = (index: number) => {
    const currentOptions = form.getValues().poll?.options || [];
    if (currentOptions.length > 1) {
      const newOptions = currentOptions.filter((_, i) => i !== index);
      form.setFieldValue('poll.options', newOptions);
    }
  };

  const pollOptions = form.getValues().poll?.options || [];

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

          {/* Poll Toggle */}
          <Paper
            shadow='sm'
            p='lg'
            radius='lg'
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
              border: '1px solid var(--mantine-color-gray-2)',
            }}
          >
            <Group justify='space-between' align='center'>
              <Group gap='sm'>
                <ThemeIcon
                  size='md'
                  variant='light'
                  color={attachPoll ? 'green' : 'gray'}
                  style={{
                    transform: attachPoll ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <IconCheck size={16} />
                </ThemeIcon>
                <Box>
                  <Text size='md' fw={600} c='gray.8'>
                    Add a Poll
                  </Text>
                  <Text size='sm' c='dimmed'>
                    Let your community vote on football-related questions
                  </Text>
                </Box>
              </Group>

              <Switch
                size='lg'
                color='green'
                checked={attachPoll}
                onChange={(event) => setAttachPoll(event.currentTarget.checked)}
                styles={{
                  track: {
                    cursor: 'pointer',
                  },
                }}
              />
            </Group>
          </Paper>

          {/* Poll Section */}
          <Collapse in={attachPoll}>
            <Paper
              shadow='sm'
              p='lg'
              radius='lg'
              style={{
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.02) 0%, rgba(20, 184, 166, 0.02) 100%)',
                border: '1px solid rgba(34, 197, 94, 0.1)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative football pattern */}
              <Box
                style={{
                  position: 'absolute',
                  top: rem(-30),
                  right: rem(-30),
                  width: rem(60),
                  height: rem(60),
                  background: 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)',
                  borderRadius: '50%',
                  pointerEvents: 'none',
                }}
              />

              <Stack gap='xl'>
                {/* Poll Header */}
                <Group gap='sm' align='center'>
                  <ThemeIcon size='md' radius='xl' variant='gradient' gradient={{ from: 'green.6', to: 'teal.6' }}>
                    <IconBallFootball size={16} />
                  </ThemeIcon>
                  <Box>
                    <Text size='lg' fw={600} c='gray.8'>
                      Create Poll
                    </Text>
                    <Text size='sm' c='dimmed'>
                      Ask your community to vote on football topics
                    </Text>
                  </Box>
                </Group>

                {/* Poll Content */}
                <Stack gap='md'>
                  <Text size='md' fw={500} c='gray.8'>
                    Poll Question
                  </Text>
                  <Textarea
                    placeholder='What do you think about the upcoming match? Who will win the championship? Share your poll question...'
                    minRows={3}
                    maxRows={6}
                    autosize
                    {...form.getInputProps('poll.content')}
                    styles={{
                      input: {
                        fontSize: rem(16),
                        lineHeight: 1.6,
                        border: '1px solid var(--mantine-color-gray-3)',
                        borderRadius: rem(8),
                        '&:focus': {
                          borderColor: 'var(--mantine-color-green-5)',
                        },
                      },
                    }}
                  />
                </Stack>

                {/* Poll Settings */}
                <Stack gap='md'>
                  <Text size='md' fw={500} c='gray.8'>
                    Poll Settings
                  </Text>

                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='md'>
                    <Card
                      shadow='sm'
                      p='md'
                      radius='lg'
                      style={{
                        background: 'var(--mantine-color-gray-0)',
                        border: '1px solid var(--mantine-color-gray-2)',
                      }}
                    >
                      <Stack gap='sm'>
                        <Group gap='xs' align='center'>
                          <ThemeIcon size='sm' variant='light' color='blue'>
                            <IconCheck size={12} />
                          </ThemeIcon>
                          <Text size='sm' fw={500} c='gray.8'>
                            Max Votes per User
                          </Text>
                        </Group>
                        <NumberInput
                          placeholder='1'
                          min={1}
                          max={10}
                          {...form.getInputProps('poll.maxVotes')}
                          styles={{
                            input: {
                              border: '1px solid var(--mantine-color-gray-3)',
                              borderRadius: rem(8),
                              '&:focus': {
                                borderColor: 'var(--mantine-color-blue-5)',
                              },
                            },
                          }}
                        />
                        <Text size='xs' c='dimmed'>
                          How many options can each user vote for?
                        </Text>
                      </Stack>
                    </Card>

                    <Card
                      shadow='sm'
                      p='md'
                      radius='lg'
                      style={{
                        background: 'var(--mantine-color-gray-0)',
                        border: '1px solid var(--mantine-color-gray-2)',
                      }}
                    >
                      <Stack gap='sm'>
                        <Group gap='xs' align='center'>
                          <ThemeIcon size='sm' variant='light' color='orange'>
                            {form.getValues().poll?.isAnonymous ? <IconEyeOff size={12} /> : <IconEye size={12} />}
                          </ThemeIcon>
                          <Text size='sm' fw={500} c='gray.8'>
                            Anonymous Voting
                          </Text>
                        </Group>
                        <Switch
                          {...form.getInputProps('poll.isAnonymous', { type: 'checkbox' })}
                          color='orange'
                          disabled
                          styles={{
                            track: {
                              cursor: 'pointer',
                            },
                          }}
                        />
                        <Text size='xs' c='dimmed'>
                          Hide voter identities in results (Currently not implemented)
                        </Text>
                      </Stack>
                    </Card>
                  </SimpleGrid>
                </Stack>

                {/* Poll Options */}
                <Stack gap='md'>
                  <Group justify='space-between' align='center'>
                    <Text size='md' fw={500} c='gray.8'>
                      Poll Options
                    </Text>
                    <Badge variant='light' color='green' size='sm'>
                      {pollOptions.length} options
                    </Badge>
                  </Group>

                  {pollOptions.length < 2 && (
                    <Alert
                      icon={<IconAlertCircle size={16} />}
                      title='Minimum Options Required'
                      color='orange'
                      variant='light'
                      radius='md'
                    >
                      You need at least 2 options for a valid poll. Add more options below.
                    </Alert>
                  )}

                  <Stack gap='md'>
                    {pollOptions.map((_, index) => (
                      <Card
                        key={index}
                        shadow='sm'
                        p='md'
                        radius='lg'
                        style={{
                          background: 'white',
                          border: '1px solid var(--mantine-color-gray-2)',
                          position: 'relative',
                        }}
                      >
                        <Group gap='md' align='center'>
                          <ThemeIcon
                            size='sm'
                            variant='light'
                            color='green'
                            style={{
                              flexShrink: 0,
                            }}
                          >
                            <Text size='xs' fw={600}>
                              {index + 1}
                            </Text>
                          </ThemeIcon>

                          <TextInput
                            placeholder={`Option ${index + 1}`}
                            {...form.getInputProps(`poll.options.${index}.content`)}
                            style={{ flex: 1 }}
                            styles={{
                              input: {
                                border: '1px solid var(--mantine-color-gray-3)',
                                borderRadius: rem(8),
                                '&:focus': {
                                  borderColor: 'var(--mantine-color-green-5)',
                                },
                              },
                            }}
                          />

                          {pollOptions.length > 1 && (
                            <ActionIcon
                              variant='light'
                              color='red'
                              onClick={() => removePollOption(index)}
                              style={{
                                flexShrink: 0,
                              }}
                            >
                              <IconTrash size={14} />
                            </ActionIcon>
                          )}
                        </Group>
                      </Card>
                    ))}

                    <Button
                      variant='light'
                      color='green'
                      leftSection={<IconPlus size={16} />}
                      onClick={addPollOption}
                      disabled={pollOptions.length >= 10}
                      style={{
                        border: '2px dashed var(--mantine-color-green-3)',
                        background: 'rgba(34, 197, 94, 0.05)',
                      }}
                    >
                      Add Option
                    </Button>

                    {pollOptions.length >= 10 && (
                      <Text size='xs' c='dimmed' ta='center'>
                        Maximum 10 options allowed
                      </Text>
                    )}
                  </Stack>
                </Stack>
              </Stack>
            </Paper>
          </Collapse>

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
              disabled={!form.getValues().content.trim() || (attachPoll && pollOptions.length < 2)}
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
