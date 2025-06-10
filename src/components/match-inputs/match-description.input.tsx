import { Textarea, type TextareaProps, ThemeIcon, Group, Text, rem, Box } from '@mantine/core';
import { IconFileText, IconEdit } from '@tabler/icons-react';
import type { UseFormReturnType } from '@mantine/form';

interface MatchDescriptionInputProps {
  form: UseFormReturnType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  textInputProps?: TextareaProps;
  field?: string;
}

export default function MatchDescriptionInput({
  form,
  textInputProps,
  field = 'description',
}: MatchDescriptionInputProps) {
  return (
    <Box>
      <Group align='center' gap='sm' mb='sm'>
        <ThemeIcon size={20} radius='xl' color='grape' variant='light'>
          <IconFileText size={12} />
        </ThemeIcon>
        <Text size='sm' fw={700} c='gray.7' tt='uppercase'>
          Match Description
        </Text>
      </Group>

      <Textarea
        placeholder="Describe the match (e.g., 'Premier League fixture', 'Friendly match', 'Championship final')"
        description='Optional details about this match'
        leftSection={<IconEdit size={18} />}
        autosize
        minRows={2}
        maxRows={4}
        styles={{
          input: {
            borderRadius: rem(12),
            border: '2px solid var(--mantine-color-grape-2)',
            backgroundColor: 'white',
            fontSize: rem(14),
            fontWeight: 400,
            paddingLeft: rem(45),
            '&:focus': {
              borderColor: 'var(--mantine-color-grape-5)',
              boxShadow: '0 0 0 2px var(--mantine-color-grape-1)',
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
        {...form.getInputProps(field)}
        {...textInputProps}
      />
    </Box>
  );
}
