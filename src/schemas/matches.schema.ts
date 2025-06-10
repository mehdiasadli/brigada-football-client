import { matchSchema, MatchStatus } from './entities/match.entity';
import { createTeamSchema, updateTeamSchema } from './teams.schema';
import { z } from 'zod';

export const createMatchSchema = matchSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    creatorId: true,
  })
  .merge(
    z.object({
      team1: createTeamSchema,
      team2: createTeamSchema,
    })
  )
  .superRefine((data, ctx) => {
    if (data.status === MatchStatus.enum.PENDING && data.startTime < new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Start time must be in future',
        path: ['startTime'],
      });

      return z.NEVER;
    }
    if (data.status === MatchStatus.enum.COMPLETED && data.startTime > new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Start time must be in past',
        path: ['startTime'],
      });

      return z.NEVER;
    }

    if (data.team1.players.filter((player) => player.isCaptain).length !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Team 1 must have only 1 captain',
        path: ['team1', 'players', '0', 'isCaptain'],
      });

      return z.NEVER;
    }

    if (data.team2.players.filter((player) => player.isCaptain).length !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Team 2 must have only 1 captain',
        path: ['team2', 'players', '0', 'isCaptain'],
      });

      return z.NEVER;
    }
  });

export const updateMatchSchema = matchSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  creatorId: true,
});

export const completeMatchSchema = matchSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    creatorId: true,
    status: true,
    description: true,
    isPrivate: true,
    startTime: true,
    venueId: true,
    venueName: true,
  })
  .merge(
    z.object({
      teams: z.array(
        updateTeamSchema.omit({
          deletedPlayers: true,
        })
      ),
    })
  )
  .superRefine((args, ctx) => {
    // check if each team has 1 captain
    if (args.teams.some((team) => team.players.filter((p) => p.isCaptain).length !== 1)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Each team must have 1 captain',
        path: ['teams', '0', 'players', '0', 'isCaptain'],
      });

      return z.NEVER;
    }
  });

export type CreateMatchSchema = z.infer<typeof createMatchSchema>;
export type UpdateMatchSchema = z.infer<typeof updateMatchSchema>;
export type CompleteMatchSchema = z.infer<typeof completeMatchSchema>;
