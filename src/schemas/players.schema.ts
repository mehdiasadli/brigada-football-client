import type { z } from 'zod';
import { playerSchema } from './entities/player.entity';

export const createPlayerSchema = playerSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  teamId: true,
});

export const updatePlayerSchema = playerSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  teamId: true,
});

export type CreatePlayerSchema = z.infer<typeof createPlayerSchema>;
export type UpdatePlayerSchema = z.infer<typeof updatePlayerSchema>;
