import { z } from 'zod';
import { nameSchema } from '../_common.schema';

export const PlayerPosition = z.enum(['GOALKEEPER', 'DEFENDER', 'MIDFIELDER', 'FORWARD'], {
  required_error: 'Player position is required',
  invalid_type_error: 'Player position must be a valid position',
  message: 'Invalid player position',
});

export const playerSchema = z.object({
  id: z
    .string({
      required_error: 'Player id is required',
      invalid_type_error: 'Player id must be a string',
    })
    .uuid('Invalid player id')
    .min(1, 'Player id must be at least 1 character'),
  createdAt: z.coerce.date({
    required_error: 'Player created at is required',
    invalid_type_error: 'Player created at must be a date',
  }),
  updatedAt: z.coerce.date({
    required_error: 'Player updated at is required',
    invalid_type_error: 'Player updated at must be a date',
  }),
  teamId: z
    .string({
      required_error: 'Player team id is required',
      invalid_type_error: 'Player team id must be a string',
    })
    .uuid('Invalid player team id')
    .min(1, 'Player team id must be at least 1 character'),
  userId: z
    .string({
      required_error: 'Player user id is required',
      invalid_type_error: 'Player user id must be a string',
    })
    .uuid('Invalid player user id')
    .min(1, 'Player user id must be at least 1 character')
    .nullish(),
  name: nameSchema('Player name'),
  isCaptain: z
    .boolean({
      required_error: 'Player is captain is required',
      invalid_type_error: 'Player is captain must be a boolean',
      message: 'Invalid player is captain',
    })
    .default(false),
  positions: z.array(PlayerPosition, {
    required_error: 'Player positions are required',
    invalid_type_error: 'Player positions must be an array',
    message: 'Invalid player positions',
  }),
  goals: z
    .number({
      required_error: 'Player goals is required',
      invalid_type_error: 'Player goals must be a number',
      message: 'Invalid player goals',
    })
    .int()
    .nonnegative()
    .default(0),
  assists: z
    .number({
      required_error: 'Player assists is required',
      invalid_type_error: 'Player assists must be a number',
      message: 'Invalid player assists',
    })
    .int()
    .nonnegative()
    .default(0),
  rating: z
    .number({
      required_error: 'Player rating is required',
      invalid_type_error: 'Player rating must be a number',
      message: 'Invalid player rating',
    })
    .min(0)
    .max(10)
    .nullish(),
});

export type PlayerSchema = z.infer<typeof playerSchema>;
