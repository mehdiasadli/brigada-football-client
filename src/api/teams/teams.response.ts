import type { MatchSchema } from '../../schemas/entities/match.entity';
import type { PlayerSchema } from '../../schemas/entities/player.entity';
import type { TeamSchema } from '../../schemas/entities/team.entity';

export type FindOneTeamResponse = TeamSchema & {
  players: PlayerSchema[];
  match: MatchSchema;
};
