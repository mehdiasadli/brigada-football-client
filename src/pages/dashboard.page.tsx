import { Title, Grid, Text, Group, Box, Stack, rem } from '@mantine/core';
import DashboardQuickActions from '../components/dashboard/dashboard-quick-actions';
import { DashboardStats } from '../components/dashboard/dashboard-stats';
import DashboardCharts from '../components/dashboard/dashboard-charts';

export function DashboardPage() {
  return (
    <Stack gap='xl'>
      {/* Header */}
      <Group justify='space-between' align='center'>
        <Box>
          <Title
            order={1}
            size='h1'
            style={{
              background: 'linear-gradient(135deg, var(--mantine-color-blue-6), var(--mantine-color-green-6))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Admin Dashboard
          </Title>
          <Text c='dimmed' size='lg' mt={rem(4)}>
            Manage your soccer platform
          </Text>
        </Box>

        <Group gap='xs'></Group>
      </Group>

      {/* Stats Cards */}
      <DashboardStats />

      <Grid>
        {/* Performance Overview */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <DashboardCharts />
        </Grid.Col>

        {/* Quick Actions */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <DashboardQuickActions />
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
