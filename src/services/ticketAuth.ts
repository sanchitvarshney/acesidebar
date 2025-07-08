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

export const { useCreateTicketMutation,   } = extendedTicketApi;
