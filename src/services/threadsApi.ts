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

    // getPriorityList: builder.query<any, void>({
    //   query: () => ({
    //     url: "/priority/list",
    //     method: "GET",
    //   }),
    //   transformResponse: (response: any) => response?.data,
    // }),

 

  }),
  overrideExisting: false,
});

export const {
  useReplyTicketMutation,
  useReviewThreadMutation
} = extendedTicketApi;
