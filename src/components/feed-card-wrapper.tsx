import { Card, Group, Stack, ThemeIcon } from '@mantine/core';
import UserPanel, { type TPublicUser } from './user-panel';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { PostVisibility } from '../schemas/entities/post.entity';
import { IconLock, IconPin, IconUsers, IconWorld } from '@tabler/icons-react';
import { Tooltip } from '@mantine/core';

dayjs.extend(relativeTime);

const visibilityMap = {
  [PostVisibility.enum.PUBLIC]: {
    Icon: IconWorld,
    color: 'blue',
    label: 'Public',
  },
  [PostVisibility.enum.PRIVATE]: {
    Icon: IconLock,
    color: 'red',
    label: 'Private',
  },
  [PostVisibility.enum.FRIENDS]: {
    Icon: IconUsers,
    color: 'green',
    label: 'Friends',
  },
};

interface FeedCardWrapperProps {
  children: React.ReactNode;
  author: TPublicUser;
  createdAt: Date;
  visibility?: (typeof PostVisibility.options)[number];
  isPinned?: boolean;
}

export default function FeedCardWrapper({ children, author, createdAt, visibility, isPinned }: FeedCardWrapperProps) {
  const VisibilityData = visibility ? visibilityMap[visibility] : undefined;

  return (
    <Card
      shadow='lg'
      radius='xl'
      p='xl'
      withBorder
      style={{
        background: 'linear-gradient(135deg, white 0%, var(--mantine-color-gray-0) 100%)',
        border: '2px solid var(--mantine-color-gray-2)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      <Stack gap='lg'>
        {/* Creator section */}
        <Group>
          <UserPanel user={author} description={(user) => `@${user.username} • ${dayjs(createdAt).fromNow()}`} />
          <Group gap='xs'>
            {VisibilityData && (
              <Tooltip label={VisibilityData.label}>
                <ThemeIcon size='md' radius='xl' color={VisibilityData.color} variant='subtle'>
                  <VisibilityData.Icon size={14} />
                </ThemeIcon>
              </Tooltip>
            )}
            {isPinned && (
              <Tooltip label='Pinned'>
                <ThemeIcon size='xs' radius='xl' color={'gray'} variant='subtle'>
                  <IconPin />
                </ThemeIcon>
              </Tooltip>
            )}
          </Group>
        </Group>

        {children}
      </Stack>
    </Card>
  );
}
