import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "../Slice/UserSlice";
import activeSlice from "../Slice/ActiveSignleSlice";

const store = configureStore({
  reducer: {
    loginSlice: UserSlice,
    activeSlice: activeSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
