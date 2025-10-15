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
    addUser: builder.mutation<any, void>({
      query: (credentials) => ({
        url: "/user/add",
        method: "POST",
        body: credentials,
      }),
    }),
    getUserData: builder.query<any, any>({
      query: ({ client }: any) => ({
        url: `/user/profile/overview/${client}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data,
    }),
    getUserTickets: builder.query<any, any>({
      query: ({ client,page,limit }: any) => ({
        url: `/user/profile/tickets/${client}?page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),
        updateUserData: builder.mutation({
      query: (credentials) => ({
        url: `/user/edit/${credentials?.key}?type=${credentials?.type}`,
        method: "PUT",
        body: credentials.body,
      }),
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
  useLazyGetUserDataQuery,
  useAddUserMutation,
  useLazyGetUserTicketsQuery,
  useUpdateUserDataMutation
} = extendedAuthApi;
