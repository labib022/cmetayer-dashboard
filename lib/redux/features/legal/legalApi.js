import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const legalApi = createApi({
  reducerPath: "legalApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.access;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
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