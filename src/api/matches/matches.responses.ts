import type { MatchSchema } from '../../schemas/entities/match.entity';
import type { UserSchema } from '../../schemas/entities/user.entity';
import type { TeamSchema } from '../../schemas/entities/team.entity';
import type { PlayerSchema } from '../../schemas/entities/player.entity';
import type { VenueSchema } from '../../schemas/entities/venue.entity';

export type FindAllMatchesResponse = MatchSchema & {
  creator: Pick<UserSchema, 'username' | 'avatar' | 'firstName' | 'lastName'> | null;
  teams: (TeamSchema & {
    players: (PlayerSchema & { user: Pick<UserSchema, 'username' | 'avatar' | 'firstName' | 'lastName'> | null })[];
  })[];
  venue?: Pick<VenueSchema, 'id' | 'name' | 'latitude' | 'longitude'>;
};

export type FindOneMatchResponse = MatchSchema & {
  teams: (Pick<TeamSchema, 'id' | 'name'> & {
    players: (Pick<PlayerSchema, 'id' | 'assists' | 'goals' | 'isCaptain' | 'name' | 'positions' | 'rating'> & {
      user: Pick<UserSchema, 'username' | 'avatar' | 'firstName' | 'lastName'> | null;
    })[];
  })[];
  venue?: Pick<VenueSchema, 'id' | 'name' | 'latitude' | 'longitude'>;
};
