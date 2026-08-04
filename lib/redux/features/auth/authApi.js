import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.access;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    signIn: builder.mutation({
      query: (credentials) => {
        const formData = new FormData();
        formData.append("email", credentials.email);
        formData.append("password", credentials.password);
        return {
          url: "/signin",
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

export const { useSignInMutation } = authApi;