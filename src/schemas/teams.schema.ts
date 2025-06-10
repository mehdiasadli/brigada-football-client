import { teamSchema } from './entities/team.entity';
import { createPlayerSchema, updatePlayerSchema } from './players.schema';
import { z } from 'zod';

export const createTeamSchema = teamSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    matchId: true,
  })
  .merge(
    z.object({
      players: createPlayerSchema.array().min(1, 'Team must have at least 1 player'),
    })
  );

export const updateTeamSchema = teamSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    matchId: true,
  })
  .merge(
    z.object({
      players: z
        .array(updatePlayerSchema.merge(z.object({ id: z.string() })))
        .min(1, 'Team must have at least 1 player'),
      deletedPlayers: z.array(z.string().uuid('Invalid player id')).nullish(),
    })
  );

export type CreateTeamSchema = z.infer<typeof createTeamSchema>;
export type UpdateTeamSchema = z.infer<typeof updateTeamSchema>;
