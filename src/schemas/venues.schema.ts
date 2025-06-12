import type { z } from 'zod';
import { venueSchema } from './entities/venue.entity';

export const createVenueSchema = venueSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  creatorId: true,
});

export type CreateVenueSchema = z.infer<typeof createVenueSchema>;
