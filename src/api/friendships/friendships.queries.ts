import { useFetch } from '../../hooks/use-fetch';
import { friendshipsService } from './friendships.service';

export const friendshipKeys = {
  index: ['friendships'] as const,

  requests: () => [...friendshipKeys.index, 'requests'] as const,
};

export function useFriendshipRequests() {
  return useFetch(friendshipKeys.requests(), () => friendshipsService.getRequests());
}
