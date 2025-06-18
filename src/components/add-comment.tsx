import { useState } from 'react';
import { Group, Avatar, Textarea, Button, Box, Text, ActionIcon, Tooltip, Paper, rem } from '@mantine/core';
import { IconSend, IconMoodSmile, IconPhoto, IconGif } from '@tabler/icons-react';
import { useCreateComment } from '../api/comments/comments.mutations';
import { useForm } from '@mantine/form';
import { createCommentSchema, type CreateCommentSchema } from '../schemas/comment.schema';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useUserStore } from '../stores/user.store';

interface AddCommentProps {
  postId: string;
  placeholder?: string;
  autoFocus?: boolean;
  maxLength?: number;
}

export default function AddComment({
  postId,
  placeholder = 'Share your thoughts about this post...',
  maxLength = 500,
  autoFocus = false,
}: AddCommentProps) {
  const mutation = useCreateComment();
  const form = useForm<CreateCommentSchema>({
    initialValues: {
      content: '',
    },
    validate: zodResolver(createCommentSchema),
  });
  const user = useUserStore((state) => state.user)!;

  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const onSubmit = form.onSubmit(
    (values) => {
      setIsFocused(false);

      mutation.mutate(
        {
          postId,
          createCommentSchema: values,
        },
        {
          onSuccess() {
            form.reset();
          },
        }
      );
    },
    (error) => {
      console.error(error);
    }
  );

  // const handleSubmit = async () => {
  //   if (!content.trim() || isSubmitting) return;

  //   setIsSubmitting(true);

  //   try {
  //     await onSubmit(content.trim());
  //     setContent('');
  //     setIsFocused(false);

  //     notifications.show({
  //       title: '⚽ Comment posted!',
  //       message: 'Your comment has been added successfully',
  //       color: 'green',
  //       autoClose: 3000,
  //     });
  //   } catch (error) {
  //     console.error(error);

  //     notifications.show({
  //       title: 'Error',
  //       message: 'Failed to post comment. Please try again.',
  //       color: 'red',
  //       autoClose: 3000,
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      onSubmit();
    }
  };

  const isOverLimit = form.getValues().content.length > maxLength;
  const remainingChars = maxLength - form.getValues().content.length;

  return (
    <form onSubmit={onSubmit}>
      <Paper
        radius='lg'
        p='md'
        style={{
          background: isFocused
            ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.02) 0%, rgba(20, 184, 166, 0.02) 100%)'
            : 'var(--mantine-color-gray-0)',
          border: isFocused ? '2px solid var(--mantine-color-green-3)' : '2px solid var(--mantine-color-gray-2)',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated background effect */}
        {isFocused && (
          <Box
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
              radial-gradient(circle at 20% 80%, rgba(34, 197, 94, 0.03) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(20, 184, 166, 0.03) 0%, transparent 50%)
            `,
              animation: 'pulse 3s ease-in-out infinite',
              zIndex: 0,
            }}
          />
        )}

        <Group align='flex-start' gap='md' style={{ position: 'relative', zIndex: 1 }}>
          {/* User Avatar */}
          <Avatar
            size='lg'
            src={user.avatar}
            alt='Your avatar'
            style={{
              border: isFocused ? '3px solid var(--mantine-color-green-4)' : '3px solid var(--mantine-color-gray-3)',
              transition: 'border-color 0.3s ease',
            }}
          >
            {user.firstName.charAt(0)}
            {user.lastName.charAt(0)}
          </Avatar>

          {/* Comment Input Area */}
          <Box style={{ flex: 1 }}>
            <Textarea
              placeholder={placeholder}
              {...form.getInputProps('content')}
              autoFocus={autoFocus}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                if (!form.getValues().content.trim()) setIsFocused(false);
              }}
              onKeyDown={handleKeyPress}
              minRows={isFocused ? 3 : 2}
              maxRows={6}
              autosize
              disabled={mutation.isPending}
              error={
                isOverLimit
                  ? `Comment is ${form.getValues().content.length - maxLength} characters over limit`
                  : undefined
              }
              styles={{
                input: {
                  fontSize: rem(14),
                  lineHeight: 1.5,
                  border: 'none',
                  background: 'transparent',
                  resize: 'none',
                  '&:focus': {
                    outline: 'none',
                  },
                  '&::placeholder': {
                    color: 'var(--mantine-color-gray-5)',
                    fontStyle: 'italic',
                  },
                },
              }}
            />

            {/* Action Bar */}
            {(isFocused || form.getValues().content.trim()) && (
              <Group justify='space-between' align='center' mt='sm'>
                {/* Left side - Tools */}
                <Group gap='xs'>
                  <Tooltip label='Add emoji (coming soon)' position='top'>
                    <ActionIcon
                      size='md'
                      variant='subtle'
                      disabled
                      color='gray'
                      // onClick={() => console.log('Open emoji picker')}
                      style={{
                        transition: 'all 0.2s ease',
                        opacity: 0.5,
                      }}
                    >
                      <IconMoodSmile size={16} />
                    </ActionIcon>
                  </Tooltip>

                  <Tooltip label='Add image (coming soon)' position='top'>
                    <ActionIcon
                      size='md'
                      variant='subtle'
                      color='gray'
                      disabled
                      style={{
                        opacity: 0.5,
                      }}
                    >
                      <IconPhoto size={16} />
                    </ActionIcon>
                  </Tooltip>

                  <Tooltip label='Add GIF (coming soon)' position='top'>
                    <ActionIcon
                      size='md'
                      variant='subtle'
                      color='gray'
                      disabled
                      style={{
                        opacity: 0.5,
                      }}
                    >
                      <IconGif size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Group>

                {/* Right side - Submit */}
                <Group gap='sm' align='center'>
                  {/* Character counter */}
                  <Text
                    size='xs'
                    c={isOverLimit ? 'red' : remainingChars < 50 ? 'orange' : 'dimmed'}
                    fw={remainingChars < 50 ? 600 : 400}
                  >
                    {remainingChars < 100 && `${remainingChars} left`}
                  </Text>

                  {/* Submit button */}
                  <Button
                    size='sm'
                    radius='xl'
                    disabled={!form.getValues().content.trim() || isOverLimit || mutation.isPending}
                    loading={mutation.isPending}
                    type='submit'
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{
                      background:
                        !form.getValues().content.trim() || isOverLimit
                          ? 'var(--mantine-color-gray-4)'
                          : 'linear-gradient(135deg, var(--mantine-color-green-6) 0%, var(--mantine-color-teal-6) 100%)',
                      border: 'none',
                      minWidth: rem(100),
                      boxShadow:
                        !form.getValues().content.trim() || isOverLimit
                          ? 'none'
                          : isHovered
                            ? '0 6px 20px rgba(34, 197, 94, 0.4)'
                            : '0 3px 10px rgba(34, 197, 94, 0.3)',
                      transform:
                        !form.getValues().content.trim() || isOverLimit
                          ? 'none'
                          : isHovered
                            ? 'translateY(-2px)'
                            : 'translateY(0)',
                      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                    leftSection={
                      <IconSend
                        size={14}
                        style={{
                          transform:
                            isHovered && form.getValues().content.trim() && !isOverLimit
                              ? 'translateX(2px)'
                              : 'translateX(0)',
                          transition: 'transform 0.3s ease',
                        }}
                      />
                    }
                  >
                    <Text size='xs' fw={600} c='white'>
                      {mutation.isPending ? 'Posting...' : 'Comment'}
                    </Text>

                    {/* Shine effect */}
                    {form.getValues().content.trim() && !isOverLimit && (
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
                    )}
                  </Button>
                </Group>
              </Group>
            )}

            {/* Helper text */}
            {isFocused && (
              <Text size='xs' c='dimmed' mt='xs' style={{ opacity: 0.8 }}>
                💡 Tip: Press Cmd+Enter (Mac) or Ctrl+Enter (Windows) to submit quickly
              </Text>
            )}
          </Box>
        </Group>

        <style>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
      </Paper>
    </form>
  );
}
