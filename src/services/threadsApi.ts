// src/services/auth/authApi.ts

import { baseInstanceOfApi } from "./baseInstanceOfApi";

// Define the interface for ticket list query parameters

const extendedTicketApi = baseInstanceOfApi.injectEndpoints({
  endpoints: (builder) => ({
    ticketStatusChange: builder.mutation({
      query: (credentials) => ({
        url: `/ticket/staff/${credentials.type}`,
        method: "POST",
        body: credentials.body,
      }),
    }),

    commanApi: builder.mutation({
      query: (credentials) => ({
        url: `/ticket/staff/${credentials.url}`,
        method: credentials.method ? credentials.method : "POST",
        body: credentials.body,
      }),
    }),
    updateUserData: builder.mutation({
      query: (credentials) => ({
        url: `/user/edit/${credentials.USERID}?type=${credentials.type}`,
        method: "PUT",
        body: credentials.body,
      }),
    }),

    getAttacedFile: builder.query({
      query: (credentials) => ({
        url: `/ticket/staff/tickets/${credentials.ticketId}/attachments`,
        method: "GET",
      }),
    }),
    getShortCutList: builder.query({
      query: () => ({
        url: `/shortcut/list`,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data,
    }),
  }),
  overrideExisting: false,
});

export const {
  useTicketStatusChangeMutation,
  useGetAttacedFileQuery,
  useCommanApiMutation,
  useUpdateUserDataMutation,
  useGetShortCutListQuery
} = extendedTicketApi;
