// src/services/auth/authApi.ts

import { baseInstanceOfApi } from './baseInstanceOfApi';

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

  export const { useCreateTicketMutation, useGetPriorityListQuery } = extendedTicketApi;
