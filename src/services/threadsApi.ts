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
       updateUserSocialData: builder.mutation({
      query: (credentials) => ({
        url: `/user/edit/${credentials.USERID}?type=social`,
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
  }),
  overrideExisting: false,
});

export const {
  useTicketStatusChangeMutation,
  useGetAttacedFileQuery,
  useCommanApiMutation,
  useUpdateUserSocialDataMutation
} = extendedTicketApi;
