import {
  Rating,
  Stack,
  Text,
  Box,
  rem,
  ThemeIcon,
  type RatingProps,
  type TextProps,
  type BoxProps,
} from '@mantine/core';
import { IconStar, IconTrophy } from '@tabler/icons-react';
import type { UseFormReturnType } from '@mantine/form';

interface RatingInputProps {
  form: UseFormReturnType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  ratingProps?: RatingProps;
  field: string;
  textProps?: TextProps;
  compact?: boolean;
  containerProps?: BoxProps;
}

export default function RatingInput({ form, ratingProps, containerProps, field, compact = false }: RatingInputProps) {
  const fieldPath = field.split('.');
  const currentRating = fieldPath.reduce((obj, key) => obj?.[key], form.getValues());

  const getRatingText = (rating: number) => {
    if (rating >= 9) return 'World Class';
    if (rating >= 8) return 'Excellent';
    if (rating >= 7) return 'Very Good';
    if (rating >= 6) return 'Good';
    if (rating >= 5) return 'Average';
    if (rating >= 4) return 'Below Average';
    if (rating >= 3) return 'Poor';
    return 'Needs Improvement';
  };

  const { style, ...rest } = containerProps ?? {};

  return (
    <Box
      style={{
        backgroundColor: 'white',
        borderRadius: rem(12),
        border: '2px solid var(--mantine-color-yellow-2)',
        padding: compact ? rem(12) : rem(16),
        transition: 'all 0.2s ease',
        ...style,
      }}
      {...rest}
    >
      {!compact && (
        <Box mb='sm' style={{ textAlign: 'center' }}>
          <ThemeIcon size={32} radius='xl' color='yellow' variant='light' mx='auto' mb='xs'>
            <IconTrophy size={16} />
          </ThemeIcon>
          <Text size='xs' fw={700} c='yellow.7' tt='uppercase'>
            Match Rating
          </Text>
        </Box>
      )}

      <Stack gap='sm' align='center'>
        <Box
          style={{
            backgroundColor: 'var(--mantine-color-yellow-0)',
            borderRadius: rem(8),
            padding: rem(12),
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Rating
            {...form.getInputProps(field)}
            count={10}
            size={compact ? 'sm' : 'md'}
            color='yellow'
            emptySymbol={<IconStar size={compact ? 16 : 20} />}
            {...ratingProps}
          />
        </Box>

        {currentRating > 0 && (
          <Stack gap={2} align='center'>
            <Text size={compact ? 'sm' : 'lg'} fw={800} c='yellow.8'>
              {currentRating}/10
            </Text>
            <Text size='xs' fw={600} c='yellow.6' ta='center'>
              {getRatingText(currentRating)}
            </Text>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
