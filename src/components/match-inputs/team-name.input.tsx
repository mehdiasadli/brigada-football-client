import { TextInput, type TextInputProps, rem, ThemeIcon } from '@mantine/core';
import { IconShield, IconEdit } from '@tabler/icons-react';
import type { UseFormReturnType } from '@mantine/form';

interface TeamNameInputProps {
  form: UseFormReturnType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  field: string;
  textInputProps?: TextInputProps;
}

export default function TeamNameInput({ form, textInputProps, field }: TeamNameInputProps) {
  return (
    <TextInput
      label='Team Name'
      placeholder='Enter your team name (e.g., Arsenal, Barcelona)'
      leftSection={
        <ThemeIcon size={20} radius='xl' color='blue' variant='light'>
          <IconShield size={12} />
        </ThemeIcon>
      }
      rightSection={<IconEdit size={16} color='var(--mantine-color-gray-5)' />}
      styles={{
        input: {
          borderRadius: rem(12),
          border: '2px solid var(--mantine-color-gray-3)',
          backgroundColor: 'white',
          fontSize: rem(15),
          fontWeight: 500,
          paddingLeft: rem(45),
          '&:focus': {
            borderColor: 'var(--mantine-color-blue-5)',
            boxShadow: '0 0 0 2px var(--mantine-color-blue-1)',
            transform: 'translateY(-1px)',
          },
          '&::placeholder': {
            color: 'var(--mantine-color-gray-5)',
            fontStyle: 'italic',
          },
          transition: 'all 0.2s ease',
        },
        label: {
          fontWeight: 700,
          fontSize: rem(14),
          color: 'var(--mantine-color-gray-8)',
          marginBottom: rem(8),
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        },
      }}
      {...form.getInputProps(field)}
      {...textInputProps}
    />
  );
}
