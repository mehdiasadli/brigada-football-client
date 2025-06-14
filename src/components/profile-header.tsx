import { Avatar, Badge, Box, Group, Paper, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { IconCalendar, IconCrown, IconMapPin, IconUsers } from '@tabler/icons-react';
import dayjs from 'dayjs';
import type { GetProfileResponse } from '../api/users/users.responses';
import type { UserRole } from '../schemas/entities/user.entity';
// import FriendshipButton from './friendship-button';
// import { useUserStore } from '../stores/user.store';

interface ProfileHeaderProps {
  user: GetProfileResponse;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  // const currentUser = useUserStore((state) => state.user)!;

  const getRoleColor = (role: (typeof UserRole.options)[number]) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'red';
      case 'ADMIN':
        return 'orange';
      case 'MODERATOR':
        return 'yellow';
      default:
        return 'blue';
    }
  };

  const getRoleLabel = (role: (typeof UserRole.options)[number]) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Admin';
      case 'ADMIN':
        return 'Admin';
      case 'MODERATOR':
        return 'Moderator';
      default:
        return 'User';
    }
  };

  return (
    <Paper
      shadow='xl'
      radius='xl'
      p='lg'
      style={{
        background: 'linear-gradient(135deg, var(--mantine-color-blue-6) 0%, var(--mantine-color-indigo-6) 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '300px',
          height: '150px',
          background:
            "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='3'/%3E%3Cpath d='M20 0v40M0 20h40'/%3E%3C/g%3E%3C/svg%3E\")",
          opacity: 0.3,
        }}
      />

      <Group align='center' gap='xl'>
        {/* Avatar */}
        <Box style={{ position: 'relative' }}>
          <Avatar
            src={user.avatar}
            size={120}
            radius='xl'
            style={{
              border: '4px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            <Text size='xl' fw={700}>
              {user.firstName[0]}
              {user.lastName[0]}
            </Text>
          </Avatar>
        </Box>

        {/* User Info */}
        <Stack gap='sm' style={{ flex: 1 }}>
          <Group align='center' gap='md'>
            <Title order={2} fw={900}>
              {user.firstName} {user.lastName}
            </Title>
            <Badge
              variant='white'
              color={getRoleColor(user.role)}
              size='lg'
              leftSection={user.role !== 'USER' ? <IconCrown size={12} /> : <IconUsers size={12} />}
            >
              {getRoleLabel(user.role)}
            </Badge>
          </Group>

          <Text size='lg' opacity={0.9} fw={500}>
            @{user.username}
          </Text>

          <Group gap='lg'>
            <Group gap='xs'>
              <ThemeIcon
                size={20}
                radius='xl'
                color='white'
                variant='white'
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                <IconMapPin size={12} />
              </ThemeIcon>
              <Text size='sm' opacity={0.9}>
                {user.placeOfBirth}
              </Text>
            </Group>

            <Group gap='xs'>
              <ThemeIcon
                size={20}
                radius='xl'
                color='white'
                variant='white'
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                <IconCalendar size={12} />
              </ThemeIcon>
              <Text size='sm' opacity={0.9}>
                Joined {dayjs(user.createdAt).format('MMMM YYYY')}
              </Text>
            </Group>
          </Group>
        </Stack>

        {/* {user.id !== currentUser.id && (
          <Box ml='auto'>
            <FriendshipButton friendship={user.friendship} username={user.username} userId={user.id} />
          </Box>
        )} */}
      </Group>
    </Paper>
  );
}
