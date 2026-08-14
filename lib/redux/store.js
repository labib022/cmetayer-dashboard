import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./features/auth/authApi";
import { statsApi } from "./features/stats/statsApi";
import { bookingsApi } from "./features/bookings/bookingsApi";
import { cmsApi } from "./features/cms/cmsApi";
import { faqsApi } from "./features/faqs/faqsApi";
import { legalApi } from "./features/legal/legalApi";
import { usersApi } from "./features/users/usersApi";
import authReducer from "./features/auth/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [statsApi.reducerPath]: statsApi.reducer,
    [bookingsApi.reducerPath]: bookingsApi.reducer,
    [cmsApi.reducerPath]: cmsApi.reducer,
    [faqsApi.reducerPath]: faqsApi.reducer,
    [legalApi.reducerPath]: legalApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      statsApi.middleware,
      bookingsApi.middleware,
      cmsApi.middleware,
      faqsApi.middleware,
      legalApi.middleware,
      usersApi.middleware
    ),
});