// src/services/auth/authApi.ts

import { baseInstanceOfApi } from "./baseInstanceOfApi";
import { v4 as uuidv4 } from "uuid";

// Define the interface for ticket list query parameters

const extendedTicketApi = baseInstanceOfApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadFileApi: builder.mutation({
      query: (credentials) => ({
        url: "ticket/reply/image/upload",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useUploadFileApiMutation } = extendedTicketApi;
