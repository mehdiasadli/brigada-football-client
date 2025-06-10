import { Select, type SelectProps, ThemeIcon, Group, Text, rem, Box } from '@mantine/core';
import { IconCloud, IconSun, IconCloudRain, IconSnowflake } from '@tabler/icons-react';
import type { UseFormReturnType } from '@mantine/form';
import { WeatherCondition } from '../../schemas/entities/match.entity';

interface WeatherConditionInputProps {
  form: UseFormReturnType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  selectProps?: SelectProps;
  field?: string;
}

const getWeatherIcon = (condition: string) => {
  switch (condition?.toLowerCase()) {
    case 'sunny':
      return <IconSun size={16} />;
    case 'cloudy':
      return <IconCloud size={16} />;
    case 'rainy':
      return <IconCloudRain size={16} />;
    case 'snowy':
      return <IconSnowflake size={16} />;
    default:
      return <IconCloud size={16} />;
  }
};

export default function WeatherConditionInput({
  form,
  selectProps,
  field = 'weatherCondition',
}: WeatherConditionInputProps) {
  return (
    <Box>
      <Group align='center' gap='sm' mb='sm'>
        <ThemeIcon size={20} radius='xl' color='cyan' variant='light'>
          <IconCloud size={12} />
        </ThemeIcon>
        <Text size='sm' fw={700} c='gray.7' tt='uppercase'>
          Weather Conditions
        </Text>
      </Group>

      <Select
        placeholder='Select match day weather'
        leftSection={getWeatherIcon(form.getValues()[field])}
        data={WeatherCondition.options.map((option) => ({
          value: option,
          label: option.charAt(0).toUpperCase() + option.slice(1).toLowerCase(),
        }))}
        styles={{
          input: {
            borderRadius: rem(12),
            border: '2px solid var(--mantine-color-cyan-2)',
            backgroundColor: 'white',
            fontSize: rem(14),
            fontWeight: 500,
            paddingLeft: rem(45),
            '&:focus': {
              borderColor: 'var(--mantine-color-cyan-5)',
              boxShadow: '0 0 0 2px var(--mantine-color-cyan-1)',
              transform: 'translateY(-1px)',
            },
            '&::placeholder': {
              color: 'var(--mantine-color-gray-5)',
              fontStyle: 'italic',
            },
            transition: 'all 0.2s ease',
          },
          dropdown: {
            borderRadius: rem(12),
            border: '2px solid var(--mantine-color-cyan-2)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
          },
        }}
        size='md'
        clearable
        {...form.getInputProps(field)}
        {...selectProps}
      />
    </Box>
  );
}
