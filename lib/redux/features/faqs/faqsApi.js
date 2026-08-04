import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const faqsApi = createApi({
  reducerPath: "faqsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.access;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Faqs"],
  endpoints: (builder) => ({
    getFaqs: builder.query({
      query: () => "/faqs",
      providesTags: ["Faqs"],
    }),
    createFaq: builder.mutation({
      query: ({ question, answer, order }) => {
        const formData = new FormData();
        formData.append("question", question);
        formData.append("answer", answer);
        formData.append("order", order || 0);
        return { url: "/admin/faqs", method: "POST", body: formData };
      },
      invalidatesTags: ["Faqs"],
    }),
    updateFaq: builder.mutation({
      query: ({ id, ...fields }) => {
        const formData = new FormData();
        Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
        return { url: `/admin/faqs/${id}`, method: "PUT", body: formData };
      },
      invalidatesTags: ["Faqs"],
    }),
    deleteFaq: builder.mutation({
      query: (id) => ({ url: `/admin/faqs/${id}`, method: "DELETE" }),
      invalidatesTags: ["Faqs"],
    }),
  }),
});

export const {
  useGetFaqsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} = faqsApi;