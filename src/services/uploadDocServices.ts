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
    attachedFile: builder.mutation({
      query: (credentials) => ({
        url: `ticket/reply/image/upload?upload=file`,
        method: "POST",
        body: credentials,
      }),
    }),
    deleteAttachedFile: builder.mutation({
      query: (credentials) => ({
        url: `/ticket/staff/tickets/${credentials.ticketNumber}/attachments/${credentials.signature}`,
        method: "delete",
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useUploadFileApiMutation, useAttachedFileMutation,useDeleteAttachedFileMutation } =
  extendedTicketApi;
