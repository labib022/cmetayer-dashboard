import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/lib/redux/baseQuery";

export const cmsApi = createApi({
  reducerPath: "cmsApi",
  baseQuery: baseQueryWithReauth,
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