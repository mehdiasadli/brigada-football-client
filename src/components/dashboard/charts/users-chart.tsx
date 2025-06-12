/* eslint-disable @typescript-eslint/no-explicit-any */
import { LineChart } from '@mantine/charts';
import type { GetDashboardChartsResponse } from '../../../api/dashboard/dashboard.responses';
import { useEffect, useState } from 'react';
import { Card, Text, Group, ThemeIcon, Stack, Box } from '@mantine/core';
import { IconUsers, IconTrophy, IconUserPlus } from '@tabler/icons-react';

interface ChartDataPoint {
  month: string;
  'Total Users': number;
  'Match Creators': number;
  'Match Players': number;
}

const getMonthName = (monthNumber: number): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[monthNumber - 1] || '';
};

interface UsersChartProps {
  data: GetDashboardChartsResponse['users'];
}

export default function UsersChart({ data }: UsersChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    if (data && data.length > 0) {
      const transformedData = data.map((item) => ({
        month: getMonthName(item.month),
        'Total Users': item.usersCreatedCount,
        'Match Creators': item.usersWhichHaveCreatedMatch,
        'Match Players': item.usersWhichHavePlayedMatch,
      }));
      setChartData(transformedData);
    }
  }, [data]);

  // Calculate totals for summary cards
  const totals = data?.reduce(
    (acc, curr) => ({
      totalUsers: acc.totalUsers + curr.usersCreatedCount,
      matchCreators: acc.matchCreators + curr.usersWhichHaveCreatedMatch,
      matchPlayers: acc.matchPlayers + curr.usersWhichHavePlayedMatch,
    }),
    { totalUsers: 0, matchCreators: 0, matchPlayers: 0 }
  ) || { totalUsers: 0, matchCreators: 0, matchPlayers: 0 };

  return (
    <Stack gap='lg'>
      {/* Summary Cards */}

      {/* Line Chart */}
      <Card shadow='sm' padding='lg' radius='md' style={{ position: 'relative' }}>
        <Group justify='space-between' mb='lg'>
          <Box>
            <Text size='lg' fw={600}>
              User Registration Trends
            </Text>
            <Text size='sm' c='dimmed'>
              Monthly user creation and engagement over the last 12 months
            </Text>
          </Box>
        </Group>

        {chartData.length > 0 ? (
          <LineChart
            h={350}
            data={chartData}
            dataKey='month'
            series={[
              {
                name: 'Total Users',
                color: 'blue.6',
              },
              {
                name: 'Match Creators',
                color: 'green.6',
              },
              {
                name: 'Match Players',
                color: 'orange.6',
              },
            ]}
            curveType='monotone'
            fillOpacity={0.8}
            gridAxis='xy'
            withLegend
            legendProps={{
              verticalAlign: 'bottom',
              height: 50,
              iconType: 'rect',
              wrapperStyle: {
                paddingTop: '20px',
              },
            }}
            tooltipAnimationDuration={200}
            withTooltip
            tooltipProps={{
              content: ({ label, payload }) => {
                if (!payload || payload.length === 0) return null;

                return (
                  <Card shadow='md' padding='sm' radius='md' style={{ minWidth: 200 }}>
                    <Text size='sm' fw={600} mb='xs'>
                      {label}
                    </Text>
                    <Stack gap='xs'>
                      {payload.map((item: any) => (
                        <Group key={item.dataKey} justify='space-between' gap='sm'>
                          <Group gap='xs'>
                            <Box
                              w={12}
                              h={12}
                              style={{
                                backgroundColor: item.color,
                                borderRadius: 2,
                              }}
                            />
                            <Text size='xs'>{item.name}</Text>
                          </Group>
                          <Text size='xs' fw={600}>
                            {item.value?.toLocaleString()}
                          </Text>
                        </Group>
                      ))}
                    </Stack>
                  </Card>
                );
              },
            }}
            style={{
              fontSize: '12px',
            }}
          />
        ) : (
          <Box ta='center' py='xl'>
            <Text c='dimmed'>No data available to display</Text>
          </Box>
        )}
      </Card>

      <Group grow>
        <Card shadow='sm' padding='md' radius='md' style={{ border: '1px solid var(--mantine-color-gray-2)' }}>
          <Group gap='sm'>
            <ThemeIcon color='blue' variant='light' size='lg'>
              <IconUsers size={20} />
            </ThemeIcon>
            <Box>
              <Text size='xl' fw={700} c='blue'>
                {totals.totalUsers.toLocaleString()}
              </Text>
              <Text size='sm' c='dimmed'>
                Total Users Created
              </Text>
            </Box>
          </Group>
        </Card>

        <Card shadow='sm' padding='md' radius='md' style={{ border: '1px solid var(--mantine-color-gray-2)' }}>
          <Group gap='sm'>
            <ThemeIcon color='green' variant='light' size='lg'>
              <IconUserPlus size={20} />
            </ThemeIcon>
            <Box>
              <Text size='xl' fw={700} c='green'>
                {totals.matchCreators.toLocaleString()}
              </Text>
              <Text size='sm' c='dimmed'>
                Active Match Creators
              </Text>
            </Box>
          </Group>
        </Card>

        <Card shadow='sm' padding='md' radius='md' style={{ border: '1px solid var(--mantine-color-gray-2)' }}>
          <Group gap='sm'>
            <ThemeIcon color='orange' variant='light' size='lg'>
              <IconTrophy size={20} />
            </ThemeIcon>
            <Box>
              <Text size='xl' fw={700} c='orange'>
                {totals.matchPlayers.toLocaleString()}
              </Text>
              <Text size='sm' c='dimmed'>
                Active Match Players
              </Text>
            </Box>
          </Group>
        </Card>
      </Group>
    </Stack>
  );
}
