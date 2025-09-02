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
        url: "/ticket/create",
        method: "POST",
        body: credentials,
      }),
    }),

    getPriorityList: builder.query<any, void>({
      query: () => ({
        url: "/priority/list",
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data,
    }),
    getStatusList: builder.query<any, void>({
      query: () => ({
        url: "/status/list",
        method: "GET",
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
      // transformResponse: (response: any) => response?.data,
    }),

    getTicketListSorting: builder.query<
      any,
      { type: string; order: string; page: number; limit: number }
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.type) searchParams.append("type", params.type);
        if (params.order) searchParams.append("order", params.order);
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());
        const queryString = searchParams.toString();
        const url = queryString
          ? `/ticket/list-sorting?${queryString}`
          : "/ticket/list-sorting";
        return {
          url,
          method: "GET",
        };
      },
    }),

    getTicketSortingOptions: builder.query<any, void>({
      query: () => ({
        url: "/ticket/list-sorting?q=ask",
        method: "GET",
      }),
    }),

    getTagList: builder.query<any, void>({
      query: () => ({
        url: "/tag/list",
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data,
    }),

    addTag: builder.mutation({
      query: (body: { name: string; description: string }) => ({
        url: "/tag/add",
        method: "POST",
        body,
      }),
    }),

    ticketSearch: builder.mutation({
      query: (ticketNumber: string) => ({
        url: `/ticket/search?ticket=${ticketNumber}`,

        method: "GET",
      }),
      transformResponse: (response: any) => response?.data,
    }),

    getAdvancedSearch: builder.query<any, void>({
      query: () => ({
        url: "/ticket/advance-search-criteria",
        method: "GET",
      }),
      transformResponse: (response: any) => response?.searchCriteria,
    }),
    getDepartmentList: builder.query<any, void>({
      query: () => ({
        url: "department/list",
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data,
    }),
    getStaffList: builder.query<any, void>({
      query: () => ({
        url: "staff/list",
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data,
    }),

    advancedSearch: builder.mutation<any, any>({
      query: (searchData) => ({
        url: "/ticket/staff/advance-search",
        method: "POST",
        body: searchData,
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
  useCreateTicketMutation,
  useGetPriorityListQuery,
  useGetTicketListQuery,
  useGetTagListQuery,
  useAddTagMutation,
  useTicketSearchMutation,
  useGetAdvancedSearchQuery,
  useGetTicketListSortingQuery,
  useGetTicketSortingOptionsQuery,
  useGetDepartmentListQuery,
  useGetStaffListQuery,
  useAdvancedSearchMutation,
  useGetStatusListQuery,
} = extendedTicketApi;
