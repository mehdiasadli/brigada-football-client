import { Button, Stack, Title } from '@mantine/core';
import { useVenuesOnMap } from '../api/venues/venues.queries';
import ErrorComponent from './error-component';
import LoadingComponent from './loading-component';
import { Map } from './map';

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

  return (
    <div>
      <Map
        zoom={11}
        venue={venues.data}
        renderPopup={(v) => (
          <Stack>
            <Title order={5}>{v.name}</Title>
            <Button onClick={() => onSelect(v)}>Select</Button>
          </Stack>
        )}
      />
    </div>
  );
}
