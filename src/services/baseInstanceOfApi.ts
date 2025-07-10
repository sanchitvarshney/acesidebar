import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
} from "@reduxjs/toolkit/query/react";
import { decrypt } from "../utils/encryption";

const baseUrl = process.env.REACT_APP_API_URL;

// Custom base query with 401 handling
const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      // Read token from localStorage
      const token = localStorage.getItem("userToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  const result = await baseQuery(args, api, extraOptions);

  // Check for 401 Unauthorized response
  if (result.error && result.error.status === 401) {
    // Clear all auth data
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");

    // Redirect to login page
    window.location.href = "/login";
  }

  return result;
};

export const baseInstanceOfApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
