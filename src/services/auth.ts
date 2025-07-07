// src/services/auth/authApi.ts

import { baseInstanceOfApi } from './baseInstanceOfApi';

const extendedAuthApi = baseInstanceOfApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        
        url: '/auth/login',
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

export const { useLoginMutation,   } = extendedAuthApi;
