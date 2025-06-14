import { z } from 'zod';

export const MatchStatus = z.enum(['PENDING', 'COMPLETED'], {
  required_error: 'Match status is required',
  invalid_type_error: 'Match status must be a valid status',
  message: 'Invalid match status',
});

export const WeatherCondition = z.enum(['SUNNY', 'CLOUDY', 'RAINY', 'SNOWY', 'FOGGY', 'WINDY', 'STORMY', 'OTHER'], {
  required_error: 'Match weather condition is required',
  invalid_type_error: 'Match weather condition must be a valid condition',
  message: 'Invalid match weather condition',
});

export const matchSchema = z.object({
  id: z
    .string({
      required_error: 'Match id is required',
      invalid_type_error: 'Match id must be a string',
    })
    .uuid('Invalid match id'),
  createdAt: z.coerce.date({
    required_error: 'Match created at is required',
    invalid_type_error: 'Match created at must be a date',
  }),
  updatedAt: z.coerce.date({
    required_error: 'Match updated at is required',
    invalid_type_error: 'Match updated at must be a date',
  }),
  status: MatchStatus,
  startTime: z.coerce.date({
    required_error: 'Match start time is required',
    invalid_type_error: 'Match start time must be a date',
  }),
  duration: z.coerce
    .number({
      required_error: 'Match duration is required',
      invalid_type_error: 'Match duration must be a number',
    })
    .int({
      message: 'Match duration must be an integer',
    })
    .min(15, 'Match duration must be at least 15 minutes')
    .max(360, 'Match duration must be less than 360 minutes')
    .nullish(),
  description: z
    .string({
      required_error: 'Match description is required',
      invalid_type_error: 'Match description must be a string',
    })
    .nullish(),
  isPrivate: z.boolean({
    required_error: 'Match is private is required',
    invalid_type_error: 'Match is private must be a boolean',
  }),
  weatherCondition: WeatherCondition.nullish(),
  venueId: z
    .string({
      required_error: 'Match venue id is required',
      invalid_type_error: 'Match venue id must be a string',
    })
    .uuid('Invalid venue id')
    .nullish(),
  venueName: z
    .string({
      required_error: 'Match venue name is required',
      invalid_type_error: 'Match venue name must be a string',
    })
    .nullish(),
  creatorId: z
    .string({
      required_error: 'Match creator id is required',
      invalid_type_error: 'Match creator id must be a string',
    })
    .uuid('Invalid creator id')
    .nullish(),
});

export type MatchSchema = z.infer<typeof matchSchema>;
