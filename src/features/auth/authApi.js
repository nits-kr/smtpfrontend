import { apiSlice } from '../../store/api/apiSlice';

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        register: builder.mutation({
            query: (userDetails) => ({
                url: '/auth/register',
                method: 'POST',
                body: userDetails,
            }),
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
