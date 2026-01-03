import { apiSlice } from '../../store/api/apiSlice';

export const dashboardApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardStats: builder.query({
            query: (params) => ({
                url: '/dashboard/stats',
                params,
            }),
            keepUnusedDataFor: 60,
        }),
        getRecentLogs: builder.query({
            query: (limit = 10) => `/dashboard/logs?limit=${limit}`,
        })
    }),
});

export const { useGetDashboardStatsQuery, useGetRecentLogsQuery } = dashboardApi;
