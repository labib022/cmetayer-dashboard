import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setAccessToken, logout } from "@/lib/redux/features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.access;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Wraps baseQuery: if the access token has expired, automatically
// calls /token/refresh, updates the store, and retries the original request.
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  const errorMessage = result?.error?.data?.message || "";
  const isTokenExpired =
    result?.error?.status === 401 ||
    errorMessage.toLowerCase().includes("token expired") ||
    errorMessage.toLowerCase().includes("jwt expired");

  if (isTokenExpired) {
    const refreshToken = api.getState().auth.refresh;

    if (refreshToken) {
      const formData = new FormData();
      formData.append("refresh", refreshToken);

      const refreshResult = await baseQuery(
        { url: "/token/refresh", method: "POST", body: formData },
        api,
        extraOptions
      );

      if (refreshResult?.data?.success) {
        api.dispatch(
          setAccessToken({
            access: refreshResult.data.access,
            refresh: refreshResult.data.refresh || refreshToken,
          })
        );
        // retry the original request with the new access token
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    } else {
      api.dispatch(logout());
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }

  return result;
};

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
      query: ({ email, new_password, confirm_password }) => {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("new_password", new_password);
        formData.append("confirm_password", confirm_password);
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