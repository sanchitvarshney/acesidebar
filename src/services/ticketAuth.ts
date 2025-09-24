// src/services/auth/authApi.ts

import { baseInstanceOfApi } from "./baseInstanceOfApi";
import dayjs from "dayjs";
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
    getTypeList: builder.query<any, void>({
      query: () => ({
        url: "/type/list",
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data,
    }),

    getTicketList: builder.query<any, TicketListParams>({
      query: (params: any) => {
        const searchParams = new URLSearchParams();

        if (params?.obj?.ticket_id)
          searchParams.append("ticket", params?.obj?.ticket_id);
        if (params?.obj?.priority)
          searchParams.append("priority", params?.obj?.priority);
        if (params?.obj?.status)
          searchParams.append("status", params?.obj?.status);
        if (params?.obj?.department)
          searchParams.append("dept", params?.obj?.department);
        if (params?.obj?.subject)
          searchParams.append("subject", params?.obj?.subject);
        if (params?.obj?.assigned)
          searchParams.append("assigner", params?.obj?.assigned);
        if (params?.obj?.type) searchParams.append("type", params?.obj?.type);
        if (params?.obj?.assignee)
          searchParams.append("assignee", params?.obj?.assignee);
        if (params?.obj?.sentiment)
          searchParams.append("sentiment", params?.obj?.sentiment);
        if (params?.obj?.important)
          searchParams.append("important", params?.obj?.important);
        if (params?.obj?.created_at) {
          const formatDate = dayjs(params.obj.created_at).format("DD-MM-YYYY");
          searchParams.append("createDt", formatDate);
        }
        if (params?.obj?.resolved_at) {
          const formatDate = dayjs(params.obj.resolved_at).format("DD-MM-YYYY");
          searchParams.append("resolveDt", formatDate);
        }
        if (params?.obj?.source)
          searchParams.append("source", params?.obj?.source);
        if (params?.obj?.tag?.length > 0)
          searchParams.append("tag", params?.obj?.tag?.join(","));
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
    triggerLogOut: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    ticketSearch: builder.mutation({
      query: (ticketNumber: string) => ({
        url: `/utility/common/ticket?search=${ticketNumber}`,

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
    getLinkTicket: builder.query<any, { ticketNumber: string | number }>({
      query: ({ ticketNumber }) => ({
        url: `/ticket/staff/link-ticket/${ticketNumber}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data,
    }),
    getSession: builder.query<any, any>({
      query: () => ({
        url: `/auth/sessions/view`,
        method: "GET",
      }),
    }),
    deleteSession: builder.mutation({
      query: (credentials) => ({
        url: "/auth/sessions/delete",
        method: "DELETE",
        body: credentials,
      }),
    }),
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
  useGetTypeListQuery,
  useGetLinkTicketQuery,
  useGetSessionQuery,
  useDeleteSessionMutation,
  useTriggerLogOutMutation,
} = extendedTicketApi;
