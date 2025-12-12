
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000/api',
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Movies', 'Users', 'Analytics', 'Profile', 'Saved', 'Notifications'],
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        register: builder.mutation({
            query: (userData) => ({
                url: '/auth/register',
                method: 'POST',
                body: userData,
            }),
        }),
        forgotPassword: builder.mutation({
            query: (email) => ({
                url: '/auth/forgot-password',
                method: 'POST',
                body: { email },
            }),
        }),
        verifyOtp: builder.mutation({
            query: (data) => ({
                url: '/auth/verify-otp',
                method: 'POST',
                body: data,
            }),
        }),
        resetPassword: builder.mutation({
            query: (data) => ({
                url: '/auth/reset-password',
                method: 'POST',
                body: data,
            }),
        }),
        getProfile: builder.query({
            query: () => '/auth/profile',
            providesTags: ['Profile'],
        }),
        updateProfile: builder.mutation({
            query: (data) => ({
                url: '/auth/profile',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Profile'],
        }),
        updatePassword: builder.mutation({
            query: (data) => ({
                url: '/auth/update-password',
                method: 'PUT',
                body: data,
            }),
        }),
        getMovies: builder.query({
            query: (arg) => {
                // Determine if arg is a string (legacy 'type') or an object (new params)
                if (typeof arg === 'string') {
                    return {
                        url: '/movies',
                        params: { type: arg },
                    };
                } else {
                    return {
                        url: '/movies',
                        params: arg,
                    };
                }
            },
            providesTags: ['Movies'],
        }),
        addMovie: builder.mutation({
            query: (movie) => ({
                url: '/movies',
                method: 'POST',
                body: movie,
            }),
            invalidatesTags: ['Movies'],
        }),
        updateMovie: builder.mutation({
            query: ({ id, data }) => ({
                url: `/movies/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Movies'],
        }),
        getUsers: builder.query({
            query: (arg) => ({
                url: '/users',
                params: arg,
            }),
            providesTags: ['Users'],
        }),
        getAnalytics: builder.query({
            query: () => '/analytics',
            providesTags: ['Analytics'],
        }),
        deleteMovie: builder.mutation({
            query: (id) => ({
                url: `/movies/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Movies'],
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Users', 'Analytics'],
        }),
        getSavedContent: builder.query({
            query: () => '/saved',
            providesTags: ['Saved'],
        }),
        toggleSaveContent: builder.mutation({
            query: (data) => ({
                url: '/saved/toggle',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Saved'],
        }),
        getUpcomingMovies: builder.query({
            query: () => '/upcoming',
            providesTags: ['Upcoming'],
        }),
        addUpcomingMovie: builder.mutation({
            query: (data) => ({
                url: '/upcoming',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Upcoming'],
        }),
        updateUpcomingMovie: builder.mutation({
            query: ({ id, data }) => ({
                url: `/upcoming/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Upcoming'],
        }),
        deleteUpcomingMovie: builder.mutation({
            query: (id) => ({
                url: `/upcoming/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Upcoming'],
        }),
        getNotifications: builder.query({
            query: () => '/notifications',
            providesTags: ['Notifications'],
        }),
        markNotificationRead: builder.mutation({
            query: (id) => ({
                url: `/notifications/${id}/read`,
                method: 'PUT',
            }),
            invalidatesTags: ['Notifications'],
        }),
        // For admin mainly
        createNotification: builder.mutation({
            query: (data) => ({
                url: '/notifications',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Notifications'],
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useForgotPasswordMutation,
    useVerifyOtpMutation,
    useResetPasswordMutation,
    useGetProfileQuery,
    useUpdateProfileMutation,
    useUpdatePasswordMutation,
    useGetMoviesQuery,
    useAddMovieMutation,
    useUpdateMovieMutation,
    useGetUsersQuery,
    useGetAnalyticsQuery,
    useDeleteMovieMutation,
    useDeleteUserMutation,
    useGetSavedContentQuery,
    useToggleSaveContentMutation,
    useGetUpcomingMoviesQuery,
    useAddUpcomingMovieMutation,
    useUpdateUpcomingMovieMutation,
    useDeleteUpcomingMovieMutation,
    useGetNotificationsQuery,
    useMarkNotificationReadMutation,
    useCreateNotificationMutation
} = api;
