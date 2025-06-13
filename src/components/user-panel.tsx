import { Stack, Text, ThemeIcon, type AvatarProps, type GroupProps, type TextProps } from '@mantine/core';
import { Avatar, Group } from '@mantine/core';
import type { TUserRole } from '../schemas/entities/user.entity';
import { IconCrown } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

interface UserPanelProps extends GroupProps {
  user: {
    id?: string;
    firstName: string;
    lastName: string;
    avatar?: string | null;
    username: string;
    role?: TUserRole;
  };
  withRoleIcon?: boolean;
  withUsername?: boolean;
  withAvatar?: boolean;
  asLink?: boolean;
  description?: string;
  // styles

  avatarProps?: AvatarProps;
  nameProps?: TextProps;
  descriptionProps?: TextProps;
}

export default function UserPanel({
  user,
  withRoleIcon = false,
  withUsername = true,
  withAvatar = true,
  asLink = true,
  description,
  avatarProps,
  nameProps,
  descriptionProps,
  ...props
}: UserPanelProps) {
  const { style, ...restProps } = props;

  return (
    <Group
      style={{
        color: 'inherit',
        textDecoration: 'none',
        ...style,
      }}
      gap={'xs'}
      {...restProps}
      renderRoot={asLink ? (props) => <Link {...props} to={`/users/${user.username}`} /> : undefined}
    >
      {withAvatar && (
        <Avatar
          size='md'
          radius='xl'
          src={user?.avatar}
          style={{
            border: '2px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          }}
          {...avatarProps}
        >
          {user.firstName[0].toUpperCase()}
        </Avatar>
      )}

      <Stack gap={0}>
        <Group gap={'xs'}>
          <Text size='sm' fw={600} {...nameProps}>
            {user.firstName} {user.lastName}
          </Text>
          {withRoleIcon && user.role && user.role !== 'USER' && (
            <ThemeIcon size={16} radius='xl' color='yellow' variant='filled'>
              <IconCrown size={10} />
            </ThemeIcon>
          )}
        </Group>
        {description ? (
          <Text size='xs' c='gray.5' {...descriptionProps}>
            {description}
          </Text>
        ) : withUsername ? (
          <Text size='xs' c='gray.5' {...descriptionProps}>
            @{user.username}
          </Text>
        ) : null}
      </Stack>
    </Group>
  );
}
