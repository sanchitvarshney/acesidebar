import { validate } from "uuid";
import { baseInstanceOfApi } from "./baseInstanceOfApi";
import { Preview } from "@mui/icons-material";

const placeholderServices = baseInstanceOfApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlaceholders: builder.query<any, void>({
      query: () => ({
        url: "/utility/common/placeholders",
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data,
    }),
    validatePlaceholders: builder.mutation<any, any>({
      query: (credentials) => ({
        url: "/utility/common/placeholders/validate",
        method: "POST",
        body: credentials,
      }),
    }),
   previewNotification: builder.mutation<any, any>({
      query: (credentials) => ({
        url: "/utility/common/placeholders/preview",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetPlaceholdersQuery ,useValidatePlaceholdersMutation,usePreviewNotificationMutation} = placeholderServices;
