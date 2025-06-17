import { ActionIcon, Avatar, Box, FileButton, Group, rem, Text } from '@mantine/core';
import type { GetProfileResponse } from '../api/users/users.responses';
import { modals } from '@mantine/modals';
import UploadAvatarModal from './upload-avatar-modal';
import { useUserStore } from '../stores/user.store';
import { IconCamera } from '@tabler/icons-react';
import { useState } from 'react';

interface ProfileAvatarProps {
  user: GetProfileResponse;
}

export default function ProfileAvatar({ user }: ProfileAvatarProps) {
  const currentUser = useUserStore((state) => state.user)!;
  const isOwnProfile = currentUser.id === user.id;
  const [, setFile] = useState<File | null>(null);

  const openUploadModal = (file: File | null) => {
    if (!file) return;

    modals.open({
      withCloseButton: false,
      children: <UploadAvatarModal file={file} clearFile={() => setFile(null)} />,
    });
  };

  return (
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

      {isOwnProfile && (
        <Group>
          <FileButton
            onChange={(file) => {
              setFile(file);
              openUploadModal(file);
            }}
            accept='image/png,image/jpeg,image/webp,image/jpg,image/gif'
          >
            {(props) => (
              <ActionIcon
                {...props}
                size='lg'
                radius='xl'
                variant='white'
                color='blue'
                style={{
                  position: 'absolute',
                  bottom: rem(-8),
                  right: rem(-8),
                  border: '3px solid var(--mantine-color-blue-6)',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <IconCamera size={18} />
              </ActionIcon>
            )}
          </FileButton>
        </Group>
      )}
    </Box>
  );
}
