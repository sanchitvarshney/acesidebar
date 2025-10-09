// src/services/auth/authApi.ts

import { baseInstanceOfApi } from "./baseInstanceOfApi";

const extendedAuthApi = baseInstanceOfApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getUserList: builder.query<any, void>({
      query: () => ({
        url: "/user/list",
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data,
    }),
    getUserOverviewData: builder.query<any, any>({
      query: ({ client }: any) => ({
        url: `/user/overview/${client}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data,
    }),

    changePassword: builder.mutation({
      query: (credentials) => ({
        url: "/user/change-password",
        method: "PUT",
        body: credentials,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useChangePasswordMutation,
  useGetUserListQuery,
  useGetUserOverviewDataQuery,
} = extendedAuthApi;
