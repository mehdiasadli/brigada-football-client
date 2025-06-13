/* eslint-disable @typescript-eslint/no-explicit-any */
import { LineChart } from '@mantine/charts';
import type { GetDashboardChartsResponse } from '../../../api/dashboard/dashboard.responses';
import { useEffect, useState } from 'react';
import { Card, Text, Group, ThemeIcon, Stack, Box, SimpleGrid } from '@mantine/core';
import { IconTrophy, IconCalendarEvent, IconBallFootball } from '@tabler/icons-react';

interface ChartDataPoint {
  month: string;
  'Total Matches': number;
  'Completed Matches': number;
  'Pending Matches': number;
}

const getMonthName = (monthNumber: number): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[monthNumber - 1] || '';
};

interface MatchesChartProps {
  data: GetDashboardChartsResponse['matches'];
}

export default function MatchesChart({ data }: MatchesChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    if (data && data.length > 0) {
      const transformedData = data.map((item) => ({
        month: getMonthName(item.month),
        'Total Matches': item.matchesCreatedCount,
        'Completed Matches': item.matchesCompletedCount,
        'Pending Matches': item.matchesPendingCount,
      }));
      setChartData(transformedData);
    }
  }, [data]);

  // Calculate totals for summary cards
  const totals = data?.reduce(
    (acc, curr) => ({
      totalMatches: acc.totalMatches + curr.matchesCreatedCount,
      completedMatches: acc.completedMatches + curr.matchesCompletedCount,
      pendingMatches: acc.pendingMatches + curr.matchesPendingCount,
    }),
    { totalMatches: 0, completedMatches: 0, pendingMatches: 0 }
  ) || { totalMatches: 0, completedMatches: 0, pendingMatches: 0 };

  return (
    <Stack gap='lg'>
      {/* Summary Cards */}

      {/* Line Chart */}
      <Card shadow='sm' padding='lg' radius='md' style={{ position: 'relative' }}>
        <Group justify='space-between' mb='lg'>
          <Box>
            <Text size='lg' fw={600}>
              Match Creation Trends
            </Text>
            <Text size='sm' c='dimmed'>
              Monthly match creation and engagement over the last 12 months
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
                name: 'Total Matches',
                color: 'blue.6',
              },
              {
                name: 'Completed Matches',
                color: 'green.6',
              },
              {
                name: 'Pending Matches',
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

      <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }}>
        <Card shadow='sm' padding='md' radius='md' style={{ border: '1px solid var(--mantine-color-gray-2)' }}>
          <Group gap='sm'>
            <ThemeIcon color='blue' variant='light' size='lg'>
              <IconBallFootball size={20} />
            </ThemeIcon>
            <Box>
              <Text size='xl' fw={700} c='blue'>
                {totals.totalMatches.toLocaleString()}
              </Text>
              <Text size='sm' c='dimmed'>
                Total Matches Created
              </Text>
            </Box>
          </Group>
        </Card>

        <Card shadow='sm' padding='md' radius='md' style={{ border: '1px solid var(--mantine-color-gray-2)' }}>
          <Group gap='sm'>
            <ThemeIcon color='green' variant='light' size='lg'>
              <IconTrophy size={20} />
            </ThemeIcon>
            <Box>
              <Text size='xl' fw={700} c='green'>
                {totals.completedMatches.toLocaleString()}
              </Text>
              <Text size='sm' c='dimmed'>
                Completed Matches
              </Text>
            </Box>
          </Group>
        </Card>

        <Card shadow='sm' padding='md' radius='md' style={{ border: '1px solid var(--mantine-color-gray-2)' }}>
          <Group gap='sm'>
            <ThemeIcon color='orange' variant='light' size='lg'>
              <IconCalendarEvent size={20} />
            </ThemeIcon>
            <Box>
              <Text size='xl' fw={700} c='orange'>
                {totals.pendingMatches.toLocaleString()}
              </Text>
              <Text size='sm' c='dimmed'>
                Pending Matches
              </Text>
            </Box>
          </Group>
        </Card>
      </SimpleGrid>
    </Stack>
  );
}
