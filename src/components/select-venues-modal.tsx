import { Box, Button, Group, Stack, ThemeIcon, Title } from '@mantine/core';
import { useVenuesOnMap } from '../api/venues/venues.queries';
import ErrorComponent from './error-component';
import LoadingComponent from './loading-component';
import { Map } from './map';
import { IconBuildingStadium, IconMapPin } from '@tabler/icons-react';
import { Text } from '@mantine/core';

interface SelectVenuesModalProps {
  onSelect: (venue: { id: string; name: string }) => void;
}

export function SelectVenuesModal({ onSelect }: SelectVenuesModalProps) {
  const { data: venues, error: venuesError } = useVenuesOnMap();

  if (venuesError) {
    return <ErrorComponent error={venuesError} />;
  }

  if (!venues || !venues.data) {
    return <LoadingComponent />;
  }

  if (venues.data.length === 0) {
    return (
      <Box p='xl' ta='center'>
        <ThemeIcon size='xl' color='gray' variant='light' mx='auto' mb='md'>
          <IconBuildingStadium size={32} />
        </ThemeIcon>
        <Title order={4} mb='xs'>
          No Venues Available
        </Title>
        <Text size='sm' c='dimmed' mb='lg'>
          There are no venues with location data to display on the map.
        </Text>
        <Text size='xs' c='dimmed'>
          Contact your administrator to add venues with coordinates.
        </Text>
      </Box>
    );
  }

  return (
    <div>
      <Box mb='md' p='sm'>
        <Group align='center' gap='xs'>
          <IconMapPin size={16} />
          <Text size='sm' fw={600}>
            Select a venue from the map ({venues.data.length} venues available)
          </Text>
        </Group>
      </Box>

      <Map
        zoom={11}
        venue={venues.data}
        renderPopup={(v) => (
          <Stack gap='xs'>
            <Title order={5}>{v.name}</Title>
            <Button size='xs' onClick={() => onSelect(v)} leftSection={<IconMapPin size={14} />}>
              Select This Venue
            </Button>
          </Stack>
        )}
      />
    </div>
  );
}
