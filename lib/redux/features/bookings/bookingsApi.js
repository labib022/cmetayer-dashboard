import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bookingsApi = createApi({
  reducerPath: "bookingsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.access;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Bookings"],
  endpoints: (builder) => ({
    getAllBookings: builder.query({
      query: () => "/admin/bookings",
      providesTags: ["Bookings"],
    }),
    updateBookingStatus: builder.mutation({
      query: ({ type, id, status }) => {
        const formData = new FormData();
        formData.append("status", status);
        return {
          url: `/admin/bookings/${type}/${id}/status`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["Bookings"],
    }),
  }),
});

export const { useGetAllBookingsQuery, useUpdateBookingStatusMutation } = bookingsApi;