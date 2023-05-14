import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "Login",
  initialState: {
    login: localStorage.getItem("users")
      ? JSON.parse(localStorage.getItem("users"))
      : null,
  },
  reducers: {
    Loginuser: (state, action) => {
      state.login = action.payload;
    },
  },
});
export const { Loginuser } = userSlice.actions;
export default userSlice.reducer;
