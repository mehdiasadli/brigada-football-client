import { Api } from '../define-api';
import type { GetDashboardChartsResponse, GetDashboardStatsResponse } from './dashboard.responses';

const api = Api.create('/dashboard');

export const dashboardService = {
  getDashboardStats: () => api.get<GetDashboardStatsResponse>('/'),
  getDashboardCharts: () => api.get<GetDashboardChartsResponse>('/charts'),
};
