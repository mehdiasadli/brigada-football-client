import type { UserSchema } from '../../schemas/entities/user.entity';
import type { VenueSchema } from '../../schemas/entities/venue.entity';
import type { FindOneMatchResponse } from '../matches/matches.responses';

export type FindOneVenueResponse = VenueSchema & {
  matches: FindOneMatchResponse[];
  creator: Pick<UserSchema, 'id' | 'firstName' | 'lastName' | 'avatar' | 'username'> | null;
};
