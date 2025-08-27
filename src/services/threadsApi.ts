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
  }),
  overrideExisting: false,
});

export const {
  useTicketStatusChangeMutation,

  useCommanApiMutation,
} = extendedTicketApi;
