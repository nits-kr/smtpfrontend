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
        createSubuser: builder.mutation({
            query: (userDetails) => ({
                url: 'users/createSubuser',
                method: 'POST',
                body: userDetails,
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            }),
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useCreateSubuserMutation } = authApi;
