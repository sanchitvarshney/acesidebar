// src/services/auth/authApi.ts

import { baseInstanceOfApi } from "./baseInstanceOfApi";

// Define the interface for ticket list query parameters
interface TicketListParams {
  priority?: string;
  department?: string;
  page?: number;
  limit?: number;
}

const extendedTicketApi = baseInstanceOfApi.injectEndpoints({
  endpoints: (builder) => ({
    replyTicket: builder.mutation({
      query: (credentials) => ({
        url: "/ticket/staff/reply",
        method: "POST",
        body: credentials,
      }),
    }),
    reviewThread: builder.mutation({
      query: (credentials) => ({
        url: "/ticket/staff/star",
        method: "POST",
        body: credentials,
      }),
    }),

    addNote: builder.mutation({
      query: (credentials) => ({
        url: "/ticket/staff/add-note",
        method: "POST",
        body: credentials,
      }),
    }),
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
  }),
  overrideExisting: false,
});

export const {
  useReplyTicketMutation,
  useReviewThreadMutation,
  useAddNoteMutation,
  useForwardThreadMutation,
  useTicketStatusChangeMutation,
  useDeleteTicketMutation,
  useCloseTicketMutation,
  useMerageContactMutation
} = extendedTicketApi;
