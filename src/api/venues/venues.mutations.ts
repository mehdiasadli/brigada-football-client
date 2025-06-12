import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { useMutate } from '../../hooks/use-mutate';
import { venuesService } from './venues.service';
import { venuesKeys } from './venues.queries';
import type { SuccessResponse } from '../define-api';
import type { PaginatedResult } from '../../schemas/query.schema';
import type { VenueSchema } from '../../schemas/entities/venue.entity';
import { randId } from '../../utils/rand-id';
import { useUserStore } from '../../stores/user.store';

export function useCreateVenue() {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user)!;

  return useMutate(venuesService.create, {
    showOnError: true,
    showOnSuccess: 'Venue created successfully',
    redirectOnSuccess: '/dashboard/venues',
    async onMutate(vars) {
      await queryClient.cancelQueries({ queryKey: venuesKeys.listIndex() });
      const prevVenues = queryClient.getQueryData(venuesKeys.listIndex());

      queryClient.setQueriesData(
        { queryKey: venuesKeys.listIndex() },
        (old?: InfiniteData<SuccessResponse<PaginatedResult<VenueSchema>>>) => {
          if (!old) return old;

          const newData = {
            ...old,
            pages: [...old.pages],
          };

          const newVenueId = randId();

          if (newData.pages.length > 0) {
            newData.pages[0] = {
              ...newData.pages[0],
              data: {
                ...newData.pages[0].data,
                meta: {
                  ...newData.pages[0].data.meta,
                  totalItems: newData.pages[0].data.meta.totalItems + 1,
                },
                items: [
                  ...newData.pages[0].data.items,
                  {
                    ...vars,
                    id: newVenueId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    creatorId: user.id,
                  },
                ],
              },
            };
          }

          return newData;
        }
      );

      return { prevVenues };
    },
    onError(_, _1, ctx) {
      if (ctx?.prevVenues) {
        queryClient.setQueryData(venuesKeys.listIndex(), ctx.prevVenues);
      }
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: venuesKeys.listIndex() });
    },
  });
}

export function useDeleteVenue() {
  const queryClient = useQueryClient();

  return useMutate(venuesService.delete, {
    showOnError: true,
    showOnSuccess: 'Venue deleted successfully',
    redirectOnSuccess: '/dashboard/venues',
    async onMutate(venueId) {
      await queryClient.cancelQueries({ queryKey: venuesKeys.listIndex() });
      const prevVenues = queryClient.getQueryData(venuesKeys.listIndex());

      queryClient.setQueriesData(
        { queryKey: venuesKeys.listIndex() },
        (old?: InfiniteData<SuccessResponse<PaginatedResult<VenueSchema>>>) => {
          if (!old) return old;

          const newData = {
            ...old,
            pages: [...old.pages],
          };

          if (newData.pages.length > 0) {
            newData.pages[0] = {
              ...newData.pages[0],
              data: {
                ...newData.pages[0].data,
                meta: {
                  ...newData.pages[0].data.meta,
                  totalItems: newData.pages[0].data.meta.totalItems - 1,
                },
                items: newData.pages[0].data.items.filter((item) => item.id !== venueId),
              },
            };
          }

          return newData;
        }
      );

      return { prevVenues };
    },
    onError(_, _1, ctx) {
      if (ctx?.prevVenues) {
        queryClient.setQueryData(venuesKeys.listIndex(), ctx.prevVenues);
      }
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: venuesKeys.listIndex() });
    },
  });
}
