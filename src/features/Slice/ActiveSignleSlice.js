import { createSlice } from "@reduxjs/toolkit";

export const ActiveSignleSlice = createSlice({
  name: "Active",
  initialState: {
    activeSingle: null,
  },
  reducers: {
    ActiveSingle: (state, action) => {
      state.activeSingle = action.payload;
    },
  },
});
export const { ActiveSingle } = ActiveSignleSlice.actions;
export default ActiveSignleSlice.reducer;
