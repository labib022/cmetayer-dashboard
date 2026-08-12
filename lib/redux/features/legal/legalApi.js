import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/lib/redux/baseQuery";

export const legalApi = createApi({
  reducerPath: "legalApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Legal"],
  endpoints: (builder) => ({
    getLegalPage: builder.query({
      query: (type) => `/legal?type=${type}`,
      providesTags: ["Legal"],
    }),
    updateLegalPage: builder.mutation({
      query: ({ type, content }) => {
        const formData = new FormData();
        formData.append("type", type);
        formData.append("content", content);
        return { url: "/admin/legal", method: "PUT", body: formData };
      },
      invalidatesTags: ["Legal"],
    }),
  }),
});

export const { useGetLegalPageQuery, useUpdateLegalPageMutation } = legalApi;