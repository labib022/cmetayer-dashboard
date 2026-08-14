import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/lib/redux/baseQuery";

export const bookingsApi = createApi({
  reducerPath: "bookingsApi",
  baseQuery: baseQueryWithReauth,
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