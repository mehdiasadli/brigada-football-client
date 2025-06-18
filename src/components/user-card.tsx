import { ActionIcon, Avatar, Badge, Box, Card, Group, Menu, Stack, Text } from '@mantine/core';
import { UserRole, type UserSchema } from '../schemas/entities/user.entity';
import { IconCalendar, IconDots, IconEye, IconLock, IconMail, IconTrash, IconUser } from '@tabler/icons-react';
import { useUserStore } from '../stores/user.store';
import { useDeleteUser, useUpdateUserRole } from '../api/users/users.mutations';
import { modals } from '@mantine/modals';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

interface UserCardProps {
  user: UserSchema;
}
type UserRole = (typeof UserRole.options)[number];

const updateRoleOptions = (currentUserRole: UserRole, targetUserRole: UserRole) => {
  if (currentUserRole === UserRole.enum.USER || currentUserRole === UserRole.enum.MODERATOR) return [];

  if (currentUserRole === UserRole.enum.ADMIN) {
    if (targetUserRole === UserRole.enum.USER) return [UserRole.enum.MODERATOR];
    if (targetUserRole === UserRole.enum.MODERATOR) return [UserRole.enum.USER];
    return [];
  }

  if (targetUserRole === UserRole.enum.SUPER_ADMIN) return [];

  return [UserRole.enum.USER, UserRole.enum.MODERATOR, UserRole.enum.ADMIN].filter((role) => role !== targetUserRole);
};

function calculateAge(birthDate: string | Date) {
  const date = new Date(birthDate);

  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age--;
  }
  return age;
}

export function UserCard({ user }: UserCardProps) {
  const currentUser = useUserStore((state) => state.user)!;
  const mutation = useUpdateUserRole();
  const deleteMutation = useDeleteUser();

  const canDelete = (userId: string, role: (typeof UserRole.options)[number]) => {
    if (userId === currentUser.id) return false;
    if (role === UserRole.enum.SUPER_ADMIN) return false;
    if (currentUser.role === UserRole.enum.SUPER_ADMIN) return true;
    return false;
  };

  const updateRole = (userId: string, role: UserRole) => {
    mutation.mutate({
      userId,
      role,
    });
  };

  const openDeleteModal = () =>
    modals.openConfirmModal({
      title: 'Delete User',
      children: `Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: {
        color: 'red',
        loading: mutation.isPending,
        variant: 'filled',
      },
      cancelProps: { variant: 'light' },
      zIndex: 10000,
      onConfirm: () => {
        deleteMutation.mutate(user.id);
        modals.closeAll();
      },
    });

  return (
    <Card shadow='sm' padding='lg' radius='md' style={{ border: '1px solid var(--mantine-color-gray-2)' }}>
      <Card.Section p='md' pb='xs'>
        <Group justify='space-between' align='flex-start'>
          <Box style={{ flex: 1 }}>
            <Group gap='xs' mb='xs'>
              <Avatar src={user.avatar} size='md' radius='xl' />
              <Text size='lg' fw={600} lineClamp={1}>
                {user.firstName} {user.lastName}
              </Text>
            </Group>

            <Group gap='xs' mb='xs'>
              <IconUser size={14} color='var(--mantine-color-gray-6)' />
              <Text size='sm' c='dimmed' lineClamp={1}>
                @{user.username}
              </Text>
            </Group>

            <Group gap='xs'>
              <Menu>
                <Menu.Target>
                  <Badge color={user.role === UserRole.enum.ADMIN ? 'blue' : 'green'} variant='light' size='xs'>
                    {user.role}
                  </Badge>
                </Menu.Target>

                <Menu.Dropdown>
                  {updateRoleOptions(currentUser.role, user.role).map((role) => (
                    <Menu.Item color='blue' onClick={() => updateRole(user.id, role)}>
                      Make {role}
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Box>

          <Menu shadow='md' width={200}>
            <Menu.Target>
              <ActionIcon variant='subtle' color='gray'>
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item component={Link} to={`/users/${user.username}`} leftSection={<IconEye size={14} />}>
                View Profile
              </Menu.Item>
              {canDelete(user.id, user.role) && (
                <Menu.Item leftSection={<IconTrash size={14} />} color='red' onClick={openDeleteModal}>
                  Delete User
                </Menu.Item>
              )}
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Card.Section>

      <Stack gap='md' mt='md'>
        {/* User information such as gender, age, etc. */}
        <Box>
          <Text size='sm' fw={500} mb='xs'>
            Account information
          </Text>

          <Stack gap='xs'>
            <Group gap='xs'>
              <IconMail size={12} color='var(--mantine-color-gray-6)' />
              <Text size='xs' c='dimmed'>
                {user.email} ({user.emailVerifiedAt ? 'Verified' : 'Unverified'})
              </Text>
            </Group>
            <Group gap='xs'>
              <IconLock size={12} color='var(--mantine-color-gray-6)' />
              <Text size='xs' c='dimmed'>
                {user.invalidPasswordAttempts} invalid password attempts
              </Text>
            </Group>
            <Group gap='xs'>
              <IconCalendar size={12} color='var(--mantine-color-gray-6)' />
              <Text size='xs' c='dimmed'>
                Created at {dayjs(user.createdAt).format('DD.MM.YYYY, HH:mm')}
              </Text>
            </Group>
          </Stack>
        </Box>

        {/* Personal Information */}
        <Box mt={'md'}>
          <Text size='sm' fw={500} mb='xs'>
            Personal Information
          </Text>
          <Group gap='xs'>
            <Badge variant='dot' color='blue' size='xs'>
              Gender: {user.gender}
            </Badge>
            <Badge variant='dot' color='blue' size='xs'>
              {calculateAge(user.dateOfBirth)} years old
            </Badge>
            <Badge variant='dot' color='blue' size='xs'>
              {user.placeOfBirth}
            </Badge>
          </Group>
        </Box>
      </Stack>
    </Card>
  );
}
