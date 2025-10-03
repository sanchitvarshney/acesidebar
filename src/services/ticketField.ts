
import { baseInstanceOfApi } from "./baseInstanceOfApi";

const extendedTicketDetailApi = baseInstanceOfApi.injectEndpoints({
  endpoints: (builder) => ({
    getTicketField: builder.query({
      query: () => ({
        url: `/utility/common/fields`,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data,
    }),
    

     triggerChangeOrder: builder.mutation({
      query: (credentials) => ({
        url: `/utility/common/fields/update?field=${credentials.field}&order=${credentials.order}`,
        method: 'PUT',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {

  useGetTicketFieldQuery,
  useTriggerChangeOrderMutation
} = extendedTicketDetailApi;
