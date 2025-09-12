// src/services/auth/authApi.ts

import { baseInstanceOfApi } from "./baseInstanceOfApi";

// Define the interface for ticket list query parameters

const agentServices = baseInstanceOfApi.injectEndpoints({
  endpoints: (builder) => ({
    getAgents: builder.query<any, void>({
      query: () => ({
        url: "/staff/agent",
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data,
    }),
    getAgentsBySeach: builder.query<any, any>({
      query: (credentials) => ({
        url: `/staff/agent?search=${credentials.search}`,
        method: "GET",
      }),
    }),
    getDepartmentBySeach: builder.query<any, any>({
      query: (credentials) => ({
        url: `/department/department?search=${credentials.search}`,
        method: "GET",
      }),
    }),
    getUserBySeach: builder.query<any, any>({
      query: (credentials) => ({
        url: `/user/user?search=${credentials.search}`,
        method: "GET",
      }),
    }),
        getDepartmentList: builder.query<any, void>({
      query: () => ({
        url: `/department/list`,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAgentsQuery,

  useLazyGetAgentsBySeachQuery,
  useLazyGetDepartmentBySeachQuery,
  useLazyGetUserBySeachQuery,
  useLazyGetDepartmentListQuery
  
} = agentServices;
