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
    updateEmailNotificationsSettingStatus: builder.mutation({
      query: (credentials) => ({
        url: `/notification/mail/status/${credentials?.key}?type=${credentials?.type}`,
        method: "PUT",
      }),
      transformResponse: (response: any) => response,
    }),
    getEmailNotificationsSettingsTemplate: builder.query({
      query: (credentials) => ({
        url: `/notification/mail/template/${credentials?.key}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data,
    }),
        getBanEmailList: builder.query({
      query: (credentials) => ({
        url: `/notification/mail/ban/list?page=${credentials?.page}&limit=${credentials?.limit}&search=${credentials?.search}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetEmailNotificationsSettingsQuery,
  useUpdateEmailNotificationsSettingStatusMutation,
  useGetEmailNotificationsSettingsTemplateQuery,
  useLazyGetBanEmailListQuery
} = settingServices;
