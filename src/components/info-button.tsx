import { ActionIcon, type ActionIconProps } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconInfoCircle } from '@tabler/icons-react';
import type React from 'react';

interface InfoButtonProps extends ActionIconProps {
  title?: string;
  text: React.ReactNode;
  iconSize?: number;
}

export default function InfoButton({ title, text, iconSize = 16, ...props }: InfoButtonProps) {
  const openModal = () =>
    modals.open({
      title,
      children: <InfoModal text={text} />,
    });

  return (
    <ActionIcon variant='subtle' color='gray' size='sm' onClick={openModal} {...props}>
      <IconInfoCircle size={iconSize} />
    </ActionIcon>
  );
}

interface InfoModalProps {
  text: React.ReactNode;
}

function InfoModal({ text }: InfoModalProps) {
  return <div>{text}</div>;
}
