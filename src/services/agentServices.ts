// src/services/auth/authApi.ts

import { baseInstanceOfApi } from "./baseInstanceOfApi";

// Define the interface for ticket list query parameters

const agentServices = baseInstanceOfApi.injectEndpoints({
  endpoints: (builder) => ({
    commanApi: builder.mutation({
      query: (credentials) => ({
        url: `/ticket/staff/${credentials.url}`,
        method: credentials.method ? credentials.method : "POST",
        body: credentials.body,
      }),
    }),

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
  }),
  overrideExisting: false,
});

export const { useGetAgentsQuery, useCommanApiMutation,useLazyGetAgentsBySeachQuery } = agentServices;
