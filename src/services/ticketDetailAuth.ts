// src/services/auth/authApi.ts

import { baseInstanceOfApi } from "./baseInstanceOfApi";

// Define the interface for ticket list query parameters
interface TicketListParams {
  priority?: string;
  department?: string;
  page?: number;
  limit?: number;
}

const extendedTicketDetailApi = baseInstanceOfApi.injectEndpoints({
  endpoints: (builder) => ({
    getTicketDetailStaffView: builder.query<any, { ticketNumber: string }>({
      query: (params) => ({
        url: `/ticket/staff/view?ticket=${params.ticketNumber}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data,
    }),
    

    //  getuserdata: builder.mutation({
    //   query: (credentials) => ({

    //     url: '/profile/view',
    //     method: 'POST',
    //     body: credentials,
    //   }),
    // }),
  }),
  overrideExisting: false,
});

export const {

  useGetTicketDetailStaffViewQuery,
} = extendedTicketDetailApi;
