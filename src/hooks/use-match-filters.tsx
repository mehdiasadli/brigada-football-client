import {
  ActionIcon,
  Group,
  Select,
  Tooltip,
  type ActionIconProps,
  type GroupProps,
  type SelectProps,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowDown, IconArrowUp } from '@tabler/icons-react';

interface UseMatchFilterOptions {
  defaultOrderDirection?: 'asc' | 'desc';
  defaultOrderBy?: string;
  defaultLimit?: number;
  orderFields?: {
    value: string;
    label: string;
  }[];
}

export function useMatchFilters(options: UseMatchFilterOptions = {}) {
  const {
    defaultOrderDirection = 'desc',
    defaultOrderBy = 'createdAt',
    defaultLimit = 10,
    orderFields = [
      {
        value: 'createdAt',
        label: 'By creation time',
      },
    ],
  } = options;

  const form = useForm({
    initialValues: {
      orderBy: defaultOrderBy,
      orderDir: defaultOrderDirection,
      limit: defaultLimit,
    },
  });

  function SelectOrderField({ selectProps }: { selectProps: SelectProps }) {
    return (
      <Select
        label='Sort by'
        placeholder='Select sorting option'
        {...selectProps}
        data={orderFields.map((field) => ({ value: field.value, label: field.label }))}
        {...form.getInputProps('orderBy')}
      />
    );
  }

  function OrderDirectionInput({ actionIconProps }: { actionIconProps: ActionIconProps }) {
    return (
      <Tooltip label={`Sort items ${form.getValues().orderDir === 'asc' ? 'ascending' : 'descending'}`}>
        <ActionIcon
          size='lg'
          variant='light'
          {...actionIconProps}
          onClick={() => {
            form.setFieldValue('orderDir', form.getValues().orderDir === 'asc' ? 'desc' : 'asc');
          }}
        >
          {form.getValues().orderDir === 'asc' ? <IconArrowUp /> : <IconArrowDown />}
        </ActionIcon>
      </Tooltip>
    );
  }

  function GroupFilters({
    groupProps,
    selectOrderFieldProps,
    orderDirectionInputProps,
  }: {
    groupProps: GroupProps;
    selectOrderFieldProps: SelectProps;
    orderDirectionInputProps: ActionIconProps;
  }) {
    return (
      <Group align='flex-end' {...groupProps}>
        <SelectOrderField selectProps={selectOrderFieldProps} />
        <OrderDirectionInput actionIconProps={orderDirectionInputProps} />
      </Group>
    );
  }

  return {
    SelectOrderField,
    OrderDirectionInput,
    GroupFilters,
    form,
  };
}
