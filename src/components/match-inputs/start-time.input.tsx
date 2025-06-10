import { DateTimePicker, type DateTimePickerProps } from '@mantine/dates';
import { ThemeIcon, Group, Text, rem, Box } from '@mantine/core';
import { IconCalendarEvent, IconClock } from '@tabler/icons-react';
import type { UseFormReturnType } from '@mantine/form';
import { MatchStatus, type MatchSchema } from '../../schemas/entities/match.entity';

interface StartTimeInputProps {
  form: UseFormReturnType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  status: MatchSchema['status'];
  dateTimePickerProps?: DateTimePickerProps;
  field?: string;
}

export default function StartTimeInput({
  form,
  status,
  dateTimePickerProps,
  field = 'startTime',
}: StartTimeInputProps) {
  const isResult = status === MatchStatus.enum.COMPLETED;

  return (
    <Box>
      <Group align='center' gap='sm' mb='sm'>
        <ThemeIcon size={20} radius='xl' color={isResult ? 'green' : 'indigo'} variant='light'>
          <IconCalendarEvent size={12} />
        </ThemeIcon>
        <Text size='sm' fw={700} c='gray.7' tt='uppercase'>
          {isResult ? 'Match Date & Time' : 'Kick-off Time'}
        </Text>
      </Group>

      <DateTimePicker
        placeholder={isResult ? 'When was the match played?' : 'When will the match start?'}
        description={isResult ? 'Select the actual match date' : 'Schedule kick-off time'}
        valueFormat='D MMMM YYYY, HH:mm'
        leftSection={<IconClock size={18} />}
        minDate={
          status === MatchStatus.enum.PENDING ? new Date(new Date().setHours(new Date().getHours() + 1)) : undefined
        }
        maxDate={status === MatchStatus.enum.COMPLETED ? new Date() : undefined}
        styles={{
          input: {
            borderRadius: rem(12),
            border: `2px solid var(--mantine-color-${isResult ? 'green' : 'indigo'}-2)`,
            backgroundColor: 'white',
            fontSize: rem(14),
            fontWeight: 500,
            paddingLeft: rem(45),
            '&:focus': {
              borderColor: `var(--mantine-color-${isResult ? 'green' : 'indigo'}-5)`,
              boxShadow: `0 0 0 2px var(--mantine-color-${isResult ? 'green' : 'indigo'}-1)`,
              transform: 'translateY(-1px)',
            },
            '&::placeholder': {
              color: 'var(--mantine-color-gray-5)',
              fontStyle: 'italic',
            },
            transition: 'all 0.2s ease',
          },
          description: {
            fontSize: rem(12),
            color: 'var(--mantine-color-gray-6)',
            marginTop: rem(4),
          },
        }}
        size='md'
        clearable
        {...form.getInputProps(field)}
        {...dateTimePickerProps}
      />
    </Box>
  );
}
