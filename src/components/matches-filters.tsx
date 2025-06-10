import { Button, Group, Select, Stack } from '@mantine/core';
import { useMatchFiltersStore } from '../stores/match-filters.store';
import { useForm } from '@mantine/form';
import { IconFilter } from '@tabler/icons-react';

export default function MatchesFilters() {
  const { sortBy, sortDir, setSortBy, setSortDir } = useMatchFiltersStore();

  const form = useForm({
    initialValues: {
      sortBy,
      sortDir,
    },
  });

  const onSubmit = form.onSubmit((values) => {
    setSortBy(values.sortBy);
    setSortDir(values.sortDir);
  });

  return (
    <form onSubmit={onSubmit}>
      <Stack>
        <Group grow>
          <Select
            label='Sort by'
            description='Sort the matches by created at or start time'
            data={[
              { value: 'createdAt', label: 'Created at' },
              { value: 'startTime', label: 'Start time' },
            ]}
            {...form.getInputProps('sortBy')}
          />
          <Select
            label='Sort direction'
            description='Sort the matches by ascending or descending'
            data={[
              { value: 'asc', label: 'Ascending' },
              { value: 'desc', label: 'Descending' },
            ]}
            {...form.getInputProps('sortDir')}
          />
        </Group>
        <Group justify='flex-end'>
          <Button type='submit' leftSection={<IconFilter size={16} />}>
            Apply filters
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
