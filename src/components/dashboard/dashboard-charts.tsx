import { Group, Stack, Tabs, Text } from '@mantine/core';
import { Card } from '@mantine/core';
import { useDashboardCharts } from '../../api/dashboard/dashboard.queries';
import ErrorComponent from '../error-component';
import LoadingComponent from '../loading-component';
import { useEffect, useState } from 'react';
import UsersChart from './charts/users-chart';

export default function DashboardCharts() {
  const { data: charts, error: chartsError } = useDashboardCharts();
  const [activeTab, setActiveTab] = useState<string | null>(null);

  useEffect(() => {
    if (charts && charts.data) {
      setActiveTab(Object.keys(charts.data)[0] || null);
    }
  }, [charts]);

  if (chartsError) {
    return <ErrorComponent error={chartsError} />;
  }

  if (!charts || !charts.data) {
    return <LoadingComponent />;
  }

  return (
    <Card shadow='sm' padding='lg' radius='md' h='100%'>
      <Tabs variant='pills' defaultValue='users' value={activeTab} onChange={setActiveTab}>
        <Stack>
          <Group justify='space-between' mb='lg'>
            <Text size='lg' fw={600}>
              Charts
            </Text>
            <Tabs.List>
              <Tabs.Tab value='users'>Users</Tabs.Tab>
            </Tabs.List>
          </Group>

          <Tabs.Panel value='users'>
            <UsersChart data={charts.data.users} />
          </Tabs.Panel>
        </Stack>
      </Tabs>
    </Card>
  );
}
