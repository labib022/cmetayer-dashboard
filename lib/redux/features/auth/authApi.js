import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/lib/redux/baseQuery";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
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
    sendOtp: builder.mutation({
      query: ({ email }) => {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("purpose", "password_reset");
        return { url: "/send-otp", method: "POST", body: formData };
      },
    }),
    verifyOtp: builder.mutation({
      query: ({ email, otp }) => {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("otp", otp);
        formData.append("purpose", "password_reset");
        return { url: "/verify-otp", method: "POST", body: formData };
      },
    }),
    resetPassword: builder.mutation({
      query: ({ email, new_password, confirm_password, reset_token }) => {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("new_password", new_password);
        formData.append("confirm_password", confirm_password);
        formData.append("reset_token", reset_token);
        return { url: "/reset-password", method: "POST", body: formData };
      },
    }),
    signOut: builder.mutation({
      query: () => ({
        url: "/signout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useSignInMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useSignOutMutation,
} = authApi;