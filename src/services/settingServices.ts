// src/services/auth/authApi.ts

import { baseInstanceOfApi } from "./baseInstanceOfApi";

const settingServices = baseInstanceOfApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmailNotificationsSettings: builder.query({
      query: () => ({
        url: "/notification/mail/list",
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data,
    }),
  }),
  overrideExisting: false,
});

export const { useGetEmailNotificationsSettingsQuery } = settingServices;
