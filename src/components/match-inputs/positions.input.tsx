import { MultiSelect, type MultiSelectProps, rem, ThemeIcon, Box, Text, Group } from '@mantine/core';
import { IconRun } from '@tabler/icons-react';
import type { UseFormReturnType } from '@mantine/form';
import { PlayerPosition } from '../../schemas/entities/player.entity';

interface PositionsInputProps {
  form: UseFormReturnType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  multiSelectProps?: MultiSelectProps;
  field: string;
}

export default function PositionsInput({ form, multiSelectProps, field }: PositionsInputProps) {
  const fieldPath = field.split('.');
  const selectedPositions = fieldPath.reduce((obj, key) => obj?.[key], form.getValues()) || [];

  return (
    <Box>
      <Group align='center' gap='sm' mb='sm'>
        <ThemeIcon size={20} radius='xl' color='teal' variant='light'>
          <IconRun size={12} />
        </ThemeIcon>
        <Text size='sm' fw={700} c='gray.7' tt='uppercase'>
          Playing Positions
        </Text>
      </Group>

      <MultiSelect
        placeholder='Select player positions'
        leftSection={<IconRun size={18} />}
        data={PlayerPosition.options.map((option) => ({
          value: option,
          label: option.charAt(0).toUpperCase() + option.slice(1).toLowerCase(),
        }))}
        styles={{
          input: {
            borderRadius: rem(12),
            border: '2px solid var(--mantine-color-teal-2)',
            backgroundColor: 'white',
            fontSize: rem(14),
            fontWeight: 500,
            '&:focus': {
              borderColor: 'var(--mantine-color-teal-5)',
              boxShadow: '0 0 0 2px var(--mantine-color-teal-1)',
              transform: 'translateY(-1px)',
            },
            '&::placeholder': {
              color: 'var(--mantine-color-gray-5)',
              fontStyle: 'italic',
            },
            transition: 'all 0.2s ease',
          },
          pill: {
            backgroundColor: 'var(--mantine-color-teal-6)',
            color: 'white',
            fontWeight: 600,
            fontSize: rem(12),
            borderRadius: rem(6),
          },
          dropdown: {
            borderRadius: rem(12),
            border: '2px solid var(--mantine-color-teal-2)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
          },
          option: {
            borderRadius: rem(6),
            fontWeight: 500,
            '&[data-selected]': {
              backgroundColor: 'var(--mantine-color-teal-1)',
              color: 'var(--mantine-color-teal-8)',
            },
          },
        }}
        size='md'
        maxValues={3}
        clearable
        searchable
        {...form.getInputProps(field)}
        {...multiSelectProps}
      />

      {selectedPositions.length > 0 && (
        <Text size='xs' c='teal.6' mt='xs' fw={500}>
          {selectedPositions.length === 1 ? '1 position selected' : `${selectedPositions.length} positions selected`}
        </Text>
      )}
    </Box>
  );
}
