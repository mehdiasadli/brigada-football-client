import { Title, Button, Group, Text, Stack, SimpleGrid, Box, rem, ThemeIcon, Paper, Loader } from '@mantine/core';
import { IconPlus, IconMapPin } from '@tabler/icons-react';
import { useVenues } from '../api/venues/venues.queries';
import InfiniteList from '../components/infinite-list';
import { VenueCard } from '../components/venue-card';
import { useDashboardStats } from '../api/dashboard/dashboard.queries';
import { Link } from 'react-router-dom';

export function DashboardVenuesPage() {
  const result = useVenues(
    {
      limit: 6,
    },
    {
      orderBy: 'createdAt',
      orderDir: 'desc',
    }
  );

  const { data: stats, status } = useDashboardStats();

  return (
    <Stack gap='xl'>
      {/* Header */}
      <Group justify='space-between' align='center'>
        <Box>
          <Title
            order={1}
            size='h2'
            style={{
              background: 'linear-gradient(135deg, var(--mantine-color-green-6), var(--mantine-color-teal-6))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Venue Management
          </Title>
          <Text c='dimmed' size='md' mt={rem(4)}>
            Manage stadiums, training grounds, and sports facilities
          </Text>
        </Box>

        <Button leftSection={<IconPlus size={16} />} color='green' component={Link} to='/dashboard/venues/add'>
          Add New Venue
        </Button>
      </Group>

      {/* Summary Stats */}
      <SimpleGrid cols={{ base: 2, md: 4 }} spacing='md'>
        <Paper p='md' radius='md' style={{ border: '1px solid var(--mantine-color-gray-2)' }}>
          <Group gap='xs'>
            <ThemeIcon color='blue' variant='light' size='sm'>
              <IconMapPin size={14} />
            </ThemeIcon>
            <Box>
              {status === 'pending' ? (
                <Loader size='xs' mb={10} ml={2} color='blue' type='dots' />
              ) : (
                <Text size='xl' fw={700} c='blue'>
                  {stats?.data.venuesStats.totalVenues ?? 0}
                </Text>
              )}
              <Text size='xs' c='dimmed'>
                Total Venues
              </Text>
            </Box>
          </Group>
        </Paper>
      </SimpleGrid>

      {/* Venues Grid */}
      <InfiniteList
        result={result}
        render={(venue) => <VenueCard venue={venue} />}
        cols={{ base: 1, xs: 1, sm: 2, md: 2, lg: 3, xl: 3 }}
      />
    </Stack>
  );
}
