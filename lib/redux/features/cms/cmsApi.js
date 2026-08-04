import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cmsApi = createApi({
  reducerPath: "cmsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.access;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["CmsPage"],
  endpoints: (builder) => ({
    getCmsPage: builder.query({
      query: ({ page_name, section_name }) => {
        const params = new URLSearchParams({ page_name });
        if (section_name) params.append("section_name", section_name);
        return `/cms?${params.toString()}`;
      },
      providesTags: ["CmsPage"],
    }),
    saveCmsPage: builder.mutation({
      query: ({ page_name, section_name, content }) => {
        const formData = new FormData();
        formData.append("page_name", page_name);
        formData.append("section_name", section_name || "default");
        formData.append("content", JSON.stringify(content));
        return {
          url: "/admin/cms",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["CmsPage"],
    }),
  }),
});

export const { useGetCmsPageQuery, useSaveCmsPageMutation } = cmsApi;