import { useFetch } from '../../hooks/use-fetch';
import { teamsService } from './teams.service';

export const teamsKeys = {
  index: ['teams'] as const,

  detailsIndex: () => [...teamsKeys.index, 'details'] as const,
  details: (id: string) => [...teamsKeys.detailsIndex(), id] as const,
};

export function useTeam(id: string) {
  return useFetch(teamsKeys.details(id), () => teamsService.findOne(id), {
    enabled: !!id,
  });
}
