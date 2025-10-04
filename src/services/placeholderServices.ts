
import { baseInstanceOfApi } from "./baseInstanceOfApi";

const placeholderServices = baseInstanceOfApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlaceholders: builder.query<any, void>({
      query: () => ({
        url: "/utility/common/placeholders",
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data,
    }),
  }),
  overrideExisting: false,
});

export const { useGetPlaceholdersQuery } = placeholderServices;
