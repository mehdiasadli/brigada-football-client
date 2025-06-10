import { NumberInput, type NumberInputProps, rem, ThemeIcon, Box, Text } from '@mantine/core';
import { IconHandGrab } from '@tabler/icons-react';
import type { UseFormReturnType } from '@mantine/form';

interface AssistsInputProps {
  form: UseFormReturnType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  numberInputProps?: NumberInputProps;
  field: string;
  compact?: boolean;
}

export default function AssistsInput({ form, numberInputProps, field, compact = false }: AssistsInputProps) {
  const fieldPath = field.split('.');
  const currentValue = fieldPath.reduce((obj, key) => obj?.[key], form.getValues()) || 0;

  return (
    <Box
      style={{
        backgroundColor: 'white',
        borderRadius: rem(12),
        border: '2px solid var(--mantine-color-violet-2)',
        padding: compact ? rem(12) : rem(16),
        transition: 'all 0.2s ease',
      }}
    >
      {!compact && (
        <Box mb='sm' style={{ textAlign: 'center' }}>
          <ThemeIcon size={32} radius='xl' color='violet' variant='light' mx='auto' mb='xs'>
            <IconHandGrab size={16} />
          </ThemeIcon>
          <Text size='xs' fw={700} c='violet.7' tt='uppercase'>
            Assists Made
          </Text>
        </Box>
      )}

      <NumberInput
        placeholder='0'
        min={0}
        max={20}
        size={compact ? 'sm' : 'lg'}
        styles={{
          input: {
            borderRadius: rem(8),
            border: 'none',
            backgroundColor: 'var(--mantine-color-violet-0)',
            fontSize: compact ? rem(16) : rem(20),
            fontWeight: 700,
            textAlign: 'center',
            color: 'var(--mantine-color-violet-8)',
            '&:focus': {
              backgroundColor: 'var(--mantine-color-violet-1)',
              boxShadow: '0 0 0 2px var(--mantine-color-violet-3)',
            },
          },
          controls: {
            borderColor: 'transparent',
          },
          control: {
            backgroundColor: 'var(--mantine-color-violet-1)',
            borderColor: 'transparent',
            color: 'var(--mantine-color-violet-7)',
            '&:hover': {
              backgroundColor: 'var(--mantine-color-violet-2)',
            },
          },
        }}
        {...form.getInputProps(field)}
        {...numberInputProps}
      />

      {currentValue > 0 && (
        <Text size='xs' ta='center' mt='xs' c='violet.6' fw={600}>
          {currentValue === 1 ? '1 Assist' : `${currentValue} Assists`}
        </Text>
      )}
    </Box>
  );
}
