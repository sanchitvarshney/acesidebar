// src/services/auth/authApi.ts

import { baseInstanceOfApi } from "./baseInstanceOfApi";

// Define the interface for ticket list query parameters


const extendedTicketApi = baseInstanceOfApi.injectEndpoints({
  endpoints: (builder) => ({
 

  
    forwardThread: builder.mutation({
      query: (credentials) => ({
        url: "/ticket/staff/forward-thread",
        method: "POST",
        body: credentials,
      }),
    }),

    ticketStatusChange: builder.mutation({
      query: (credentials) => ({
        url: `/ticket/staff/${credentials.type}`,
        method: "POST",
        body: credentials.body,
      }),
    }),

    deleteTicket: builder.mutation({
      query: (credentials) => ({
        url: "/ticket/staff/delete",
        method: "DELETE",
        body: credentials,
      }),
    }),
    closeTicket: builder.mutation({
      query: (credentials) => ({
        url: "/ticket/staff/close",
        method: "Post",
        body: credentials,
      }),
    }),
    merageContact: builder.mutation({
      query: (credentials) => ({
        url: "/ticket/staff/merage-contact",
        method: "Post",
        body: credentials,
      }),
    }),

    commanApi: builder.mutation({
      query: (credentials) => ({
        url: `{/ticket/staff/${credentials.url}`,
        method: "Post",
        body: credentials.body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
 

  useForwardThreadMutation,
  useTicketStatusChangeMutation,
  useDeleteTicketMutation,
  useCloseTicketMutation,
  useMerageContactMutation,
  useCommanApiMutation,
} = extendedTicketApi;
