import { Button, Group, Image, Stack } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useUploadAvatar } from '../api/users/users.mutations';

interface UploadAvatarModalProps {
  file: File;
  clearFile: () => void;
}

export default function UploadAvatarModal({ file, clearFile }: UploadAvatarModalProps) {
  const imageUrl = URL.createObjectURL(file);
  const mutation = useUploadAvatar();

  const onAccept = () => {
    mutation.mutate(file, {
      onSuccess: () => {
        clearFile();
        modals.closeAll();
      },
    });
  };

  const onCancel = () => {
    clearFile();
    modals.closeAll();
  };

  return (
    <Stack gap='md'>
      <Image src={imageUrl} radius='md' height={200} fit='contain' />

      <Group justify='flex-end' gap='sm'>
        <Button variant='subtle' color='gray' onClick={onCancel}>
          Cancel
        </Button>
        <Button loading={mutation.isPending} onClick={onAccept}>
          Accept
        </Button>
      </Group>
    </Stack>
  );
}
