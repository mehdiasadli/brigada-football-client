import { z } from 'zod';

export const VenueType = z.enum(['INDOOR', 'OUTDOOR', 'INDOOR_OUTDOOR'], {
  required_error: 'Venue type is required',
  invalid_type_error: 'Venue type must be a valid type',
  message: 'Invalid venue type',
});

export const venueSchema = z.object({
  id: z
    .string({
      required_error: 'Venue id is required',
      invalid_type_error: 'Venue id must be a string',
    })
    .uuid('Invalid venue id'),
  createdAt: z.coerce.date({
    required_error: 'Venue created at is required',
    invalid_type_error: 'Venue created at must be a date',
  }),
  updatedAt: z.coerce.date({
    required_error: 'Venue updated at is required',
    invalid_type_error: 'Venue updated at must be a date',
  }),
  name: z
    .string({
      required_error: 'Venue name is required',
      invalid_type_error: 'Venue name must be a string',
    })
    .min(1, 'Venue name must be at least 1 character'),
  address: z
    .string({
      required_error: 'Venue address is required',
      invalid_type_error: 'Venue address must be a string',
    })
    .min(1, 'Venue address must be at least 1 character'),
  addressDescription: z
    .string({
      invalid_type_error: 'Venue address description must be a string',
    })
    .nullish(),
  hasParking: z
    .boolean({
      required_error: 'Venue has parking is required',
      invalid_type_error: 'Venue has parking must be a boolean',
    })
    .default(false),
  hasShowers: z
    .boolean({
      required_error: 'Venue has showers is required',
      invalid_type_error: 'Venue has showers must be a boolean',
    })
    .default(true),
  type: VenueType,
  pricePerHour: z
    .number({
      required_error: 'Venue price per hour is required',
      invalid_type_error: 'Venue price per hour must be a number',
    })
    .positive('Venue price per hour must be positive'),
  contactName: z
    .string({
      invalid_type_error: 'Venue contact name must be a string',
    })
    .nullish(),
  contactPhone: z
    .string({
      invalid_type_error: 'Venue contact phone must be a string',
    })
    .nullish(),
  latitude: z.number({
    required_error: 'Venue latitude is required',
    invalid_type_error: 'Venue latitude must be a number',
  }),
  longitude: z.number({
    required_error: 'Venue longitude is required',
    invalid_type_error: 'Venue longitude must be a number',
  }),
  creatorId: z
    .string({
      invalid_type_error: 'Venue creator id must be a string',
    })
    .uuid('Invalid venue creator id')
    .nullish(),
});

export type VenueSchema = z.infer<typeof venueSchema>;
