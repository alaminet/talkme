import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "../Slice/UserSlice";

const store = configureStore({
  reducer: {
    loginSlice: UserSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
