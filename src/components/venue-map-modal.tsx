import { Card } from '@mantine/core';
import type { VenueSchema } from '../schemas/entities/venue.entity';
import { Map } from './map';

interface VenueMapModalProps {
  venue: Pick<VenueSchema, 'id' | 'name' | 'latitude' | 'longitude'>;
}

export function VenueMapModal({ venue }: VenueMapModalProps) {
  return (
    <Card>
      <Card.Section>
        <Map venue={venue} />
      </Card.Section>
    </Card>
  );
}
