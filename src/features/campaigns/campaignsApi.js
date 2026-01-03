import { apiSlice } from '../../store/api/apiSlice';

export const campaignsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCampaigns: builder.query({
            query: (params) => ({
                url: '/campaigns',
                params,
            }),
            providesTags: ['Campaign'],
        }),
        getCampaign: builder.query({
            query: (id) => `/campaigns/${id}`,
            providesTags: (result, error, id) => [{ type: 'Campaign', id }],
        }),
        createCampaign: builder.mutation({
            query: (data) => ({
                url: '/campaigns',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Campaign'],
        }),
        updateCampaignStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/campaigns/${id}/status`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: ['Campaign'],
        }),
    }),
});

export const {
    useGetCampaignsQuery,
    useGetCampaignQuery,
    useCreateCampaignMutation,
    useUpdateCampaignStatusMutation
} = campaignsApi;
