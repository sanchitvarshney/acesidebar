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
    createTicket: builder.mutation({
      query: (credentials) => ({
        
        url: '/ticket/create',
        method: 'POST',
        body: credentials,
      }),
    }),

    getPriorityList: builder.query<any, void>({
      query: () => ({
        url: '/priority/list',
        method: 'GET',
      }),
      transformResponse: (response: any) => response?.data,
    }),

    getTicketList: builder.query<any, TicketListParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        if (params.priority) searchParams.append("priority", params.priority);
        if (params.department)
          searchParams.append("department", params.department);
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());

        const queryString = searchParams.toString();
        const url = queryString
          ? `/ticket/list?${queryString}`
          : "/ticket/list";

        return {
          url,
          method: "GET",
        };
      },
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
  useCreateTicketMutation,
  useGetPriorityListQuery,
  useGetTicketListQuery,
} = extendedTicketApi;
