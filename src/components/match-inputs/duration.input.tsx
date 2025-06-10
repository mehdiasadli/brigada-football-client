import { NumberInput, type NumberInputProps, ThemeIcon, Group, Text, rem, Box } from '@mantine/core';
import { IconClock, IconStopwatch } from '@tabler/icons-react';
import type { UseFormReturnType } from '@mantine/form';

interface DurationInputProps {
  form: UseFormReturnType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  numberInputProps?: NumberInputProps;
  field?: string;
}

export default function DurationInput({ form, numberInputProps, field = 'duration' }: DurationInputProps) {
  const currentValue = form.getValues()[field] || 60;

  return (
    <Box>
      <Group align='center' gap='sm' mb='sm'>
        <ThemeIcon size={20} radius='xl' color='orange' variant='light'>
          <IconStopwatch size={12} />
        </ThemeIcon>
        <Text size='sm' fw={700} c='gray.7' tt='uppercase'>
          Match Duration
        </Text>
      </Group>

      <NumberInput
        placeholder='90'
        description='Total match time in minutes'
        min={15}
        max={360}
        leftSection={<IconClock size={18} />}
        rightSectionProps={{
          style: {
            marginRight: rem(10),
          },
        }}
        rightSection={
          <Text size='xs' c='gray.5' fw={500}>
            min
          </Text>
        }
        styles={{
          input: {
            borderRadius: rem(12),
            border: '2px solid var(--mantine-color-orange-2)',
            backgroundColor: 'white',
            fontSize: rem(14),
            fontWeight: 500,
            paddingLeft: rem(45),
            paddingRight: rem(35),
            '&:focus': {
              borderColor: 'var(--mantine-color-orange-5)',
              boxShadow: '0 0 0 2px var(--mantine-color-orange-1)',
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.2s ease',
          },
          description: {
            fontSize: rem(12),
            color: 'var(--mantine-color-gray-6)',
            marginTop: rem(4),
          },
          controls: {
            borderColor: 'transparent',
          },
          control: {
            backgroundColor: 'var(--mantine-color-orange-1)',
            borderColor: 'transparent',
            color: 'var(--mantine-color-orange-7)',
            '&:hover': {
              backgroundColor: 'var(--mantine-color-orange-2)',
            },
          },
        }}
        size='md'
        {...form.getInputProps(field)}
        {...numberInputProps}
      />

      {currentValue && currentValue !== 0 && (
        <Text size='xs' c='orange.6' mt='xs' fw={500}>
          {currentValue >= 60 ? 'Full match' : currentValue >= 30 ? 'Half match' : 'Short match'}
        </Text>
      )}
    </Box>
  );
}
