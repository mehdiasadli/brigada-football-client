import { useFetch } from '../../hooks/use-fetch';
import { dashboardService } from './dashboard.service';

export const dashboardKeys = {
  index: ['dashboard'] as const,

  stats: () => [...dashboardKeys.index, 'stats'] as const,
  charts: () => [...dashboardKeys.index, 'charts'] as const,
};

export function useDashboardStats() {
  return useFetch(dashboardKeys.stats(), () => dashboardService.getDashboardStats());
}

export function useDashboardCharts() {
  return useFetch(dashboardKeys.charts(), () => dashboardService.getDashboardCharts());
}
