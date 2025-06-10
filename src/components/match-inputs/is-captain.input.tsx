import { Switch, type SwitchProps, Group, Text, Box, rem, ThemeIcon } from '@mantine/core';
import { IconCrown } from '@tabler/icons-react';
import type { UseFormReturnType } from '@mantine/form';

interface IsCaptainInputProps {
  field: string;
  form: UseFormReturnType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  switchProps?: SwitchProps;
  compact?: boolean;
}

export default function IsCaptainInput({ form, switchProps, field, compact = false }: IsCaptainInputProps) {
  const fieldPath = field.split('.');
  const isCaptain = fieldPath.reduce((obj, key) => obj?.[key], form.getValues());

  if (compact) {
    return (
      <Group gap='xs' align='center' wrap='nowrap'>
        <ThemeIcon
          size={24}
          radius='xl'
          color={isCaptain ? 'yellow' : 'gray'}
          variant={isCaptain ? 'filled' : 'light'}
          style={{ transition: 'all 0.2s ease' }}
        >
          <IconCrown size={12} />
        </ThemeIcon>
        <Switch
          size='sm'
          color='yellow'
          styles={{
            track: {
              backgroundColor: isCaptain ? undefined : 'var(--mantine-color-gray-2)',
              borderColor: 'transparent',
            },
            label: {
              fontSize: rem(12),
              fontWeight: 600,
              color: 'var(--mantine-color-gray-7)',
            },
          }}
          {...form.getInputProps(field, { type: 'checkbox' })}
          {...switchProps}
        />
      </Group>
    );
  }

  return (
    <Box
      style={{
        backgroundColor: isCaptain ? 'var(--mantine-color-yellow-0)' : 'var(--mantine-color-gray-0)',
        borderRadius: rem(12),
        padding: rem(16),
        border: `2px solid ${isCaptain ? 'var(--mantine-color-yellow-3)' : 'var(--mantine-color-gray-3)'}`,
        transition: 'all 0.3s ease',
      }}
    >
      <Group align='center' gap='md'>
        <ThemeIcon
          size={40}
          radius='xl'
          color={isCaptain ? 'yellow' : 'gray'}
          variant={isCaptain ? 'gradient' : 'light'}
          gradient={{ from: 'yellow', to: 'orange' }}
        >
          <IconCrown size={20} />
        </ThemeIcon>

        <Box style={{ flex: 1 }}>
          <Text size='sm' fw={700} c={isCaptain ? 'yellow.8' : 'gray.7'} mb={2}>
            TEAM CAPTAIN
          </Text>
          <Switch
            label='Make this player the team captain'
            size='md'
            color='yellow'
            styles={{
              label: {
                fontSize: rem(13),
                color: 'var(--mantine-color-gray-6)',
              },
            }}
            {...form.getInputProps(field, { type: 'checkbox' })}
            {...switchProps}
          />
        </Box>
      </Group>
    </Box>
  );
}
