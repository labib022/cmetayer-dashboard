import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/lib/redux/baseQuery";

export const statsApi = createApi({
  reducerPath: "statsApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => "/admin/stats",
    }),
  }),
});

export const { useGetDashboardStatsQuery } = statsApi;