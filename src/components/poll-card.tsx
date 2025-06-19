import { useState } from 'react';
import { Card, Text, Stack, Group, ThemeIcon, Box, Progress, Badge, Button, rem, Alert, Divider } from '@mantine/core';
import { IconBallFootball, IconCheck, IconEyeOff, IconUsers, IconAlertCircle, IconCheckbox } from '@tabler/icons-react';
import { usePoleOptionVote } from '../api/poll-option-votes/poll-option-votes.mutations';
import type { GetOnePostResponse } from '../api/posts/posts.service';

interface PollCardProps {
  poll: NonNullable<GetOnePostResponse['poll']>;
  canVote?: boolean;
}

export default function PollCard({ poll, canVote = true }: PollCardProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(poll.userVotes || []);
  const [hasVoted, setHasVoted] = useState(!!poll.userVotes?.length);
  const mutation = usePoleOptionVote();

  const pollOptions = poll.options || [];
  const totalVotes = pollOptions.reduce((sum, option) => sum + (option._count?.votes || 0), 0);

  const handleOptionClick = (optionId: string) => {
    if (!canVote || hasVoted) return;

    setSelectedOptions((prev) => {
      if (poll.maxVotes === 1) {
        return [optionId];
      }

      if (prev.includes(optionId)) {
        return prev.filter((id) => id !== optionId);
      }

      if (prev.length >= poll.maxVotes) {
        return prev;
      }

      return [...prev, optionId];
    });
  };

  const handleVote = async () => {
    if (selectedOptions.length === 0 || hasVoted) return;

    try {
      await mutation.mutateAsync(selectedOptions);
      setHasVoted(true);
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  const getOptionPercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  const isOptionSelected = (optionId: string) => selectedOptions.includes(optionId);

  return (
    <Card
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
          top: rem(-20),
          right: rem(-20),
          width: rem(40),
          height: rem(40),
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      <Stack gap='lg'>
        {/* Poll Header */}
        <Group gap='sm' align='center'>
          <ThemeIcon size='md' radius='xl' variant='gradient' gradient={{ from: 'green.6', to: 'teal.6' }}>
            <IconBallFootball size={16} />
          </ThemeIcon>
          <Box style={{ flex: 1 }}>
            <Text size='md' fw={600} c='gray.8' mb={rem(4)}>
              {poll.content}
            </Text>
            <Group gap='xs' align='center'>
              <Badge variant='light' color='blue' size='xs'>
                {poll.maxVotes === 1 ? 'Single choice' : `${poll.maxVotes} choices`}
              </Badge>
              {poll.isAnonymous && (
                <Badge variant='light' color='orange' size='xs' leftSection={<IconEyeOff size={10} />}>
                  Anonymous
                </Badge>
              )}
              <Text size='xs' c='dimmed'>
                {totalVotes} votes
              </Text>
            </Group>
          </Box>
        </Group>

        <Divider />

        {/* Poll Options */}
        <Stack gap='md'>
          {pollOptions.map((option, index) => {
            const votes = option._count?.votes || 0;
            const percentage = getOptionPercentage(votes);
            const isSelected = isOptionSelected(option.id);
            const isVoted = hasVoted && poll.userVotes?.includes(option.id);

            return (
              <Card
                key={option.id}
                shadow='sm'
                p='md'
                radius='lg'
                style={{
                  background: isSelected ? 'rgba(34, 197, 94, 0.1)' : 'white',
                  border: isSelected
                    ? '2px solid var(--mantine-color-green-5)'
                    : '1px solid var(--mantine-color-gray-2)',
                  cursor: canVote && !hasVoted ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onClick={() => handleOptionClick(option.id)}
              >
                {/* Progress bar background */}
                {hasVoted && (
                  <Box
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(90deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) ${percentage}%, transparent ${percentage}%)`,
                      pointerEvents: 'none',
                    }}
                  />
                )}

                <Group gap='md' align='center' style={{ position: 'relative', zIndex: 1 }}>
                  {/* Option number/checkmark */}
                  <ThemeIcon
                    size='sm'
                    variant={isSelected ? 'filled' : 'light'}
                    color={isSelected ? 'green' : 'gray'}
                    style={{
                      flexShrink: 0,
                    }}
                  >
                    {isSelected ? (
                      <IconCheck size={12} />
                    ) : (
                      <Text size='xs' fw={600}>
                        {index + 1}
                      </Text>
                    )}
                  </ThemeIcon>

                  {/* Option content */}
                  <Box style={{ flex: 1 }}>
                    <Text size='sm' fw={500} c='gray.8' mb={rem(4)}>
                      {option.content}
                    </Text>

                    {hasVoted && (
                      <Group gap='xs' align='center'>
                        <Progress value={percentage} color='green' size='sm' style={{ flex: 1, maxWidth: rem(200) }} />
                        <Text size='xs' fw={600} c='green.7'>
                          {percentage}%
                        </Text>
                        <Text size='xs' c='dimmed'>
                          ({votes} votes)
                        </Text>
                      </Group>
                    )}
                  </Box>

                  {/* Vote indicator */}
                  {isVoted && (
                    <ThemeIcon
                      size='sm'
                      variant='light'
                      color='green'
                      style={{
                        flexShrink: 0,
                      }}
                    >
                      <IconCheck size={10} />
                    </ThemeIcon>
                  )}
                </Group>
              </Card>
            );
          })}
        </Stack>

        {/* Voting Actions */}
        {canVote && !hasVoted && (
          <Stack gap='sm'>
            <Alert icon={<IconAlertCircle size={16} />} title='Cast Your Vote' color='blue' variant='light' radius='md'>
              {poll.maxVotes === 1 ? 'Click on an option to vote' : `Select up to ${poll.maxVotes} options to vote`}
            </Alert>

            <Group justify='space-between' align='center'>
              <Text size='sm' c='dimmed'>
                {selectedOptions.length} of {poll.maxVotes} selected
              </Text>

              <Button
                size='sm'
                radius='lg'
                loading={mutation.isPending}
                disabled={selectedOptions.length === 0}
                onClick={handleVote}
                leftSection={<IconCheckbox size={14} />}
                style={{
                  background:
                    'linear-gradient(135deg, var(--mantine-color-green-6) 0%, var(--mantine-color-teal-6) 100%)',
                  border: 'none',
                }}
              >
                Vote
              </Button>
            </Group>
          </Stack>
        )}

        {/* Results Summary */}
        {hasVoted && (
          <Box
            style={{
              background: 'var(--mantine-color-gray-0)',
              borderRadius: rem(8),
              padding: rem(12),
            }}
          >
            <Group gap='xs' align='center' mb={rem(8)}>
              <IconUsers size={14} color='var(--mantine-color-gray-6)' />
              <Text size='sm' fw={500} c='gray.8'>
                Poll Results
              </Text>
            </Group>
            <Text size='xs' c='dimmed'>
              {totalVotes} people participated in this poll
              {poll.isAnonymous && ' • Votes are anonymous'}
            </Text>
          </Box>
        )}
      </Stack>
    </Card>
  );
}
