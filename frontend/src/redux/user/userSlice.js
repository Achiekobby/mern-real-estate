import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
  validationErrors: { email: "", password: "" },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    sign_in_start: (state) => {
      state.loading = true;
    },
    sign_in_success: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    sign_in_failure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    failed_validation: (state, action) => {
      state.loading = false;
      state.validationErrors = action.payload;
      state.validationErrors.forEach((error) => {
        const match = error.match(/"([^"]*)"/);
        const error_message = match && match[1];
        switch (error_message) {
          case "email":
            state.validationErrors.email = error.replace(/"([^"]*)"/, "$1");
            break;
          case "password":
            state.validationErrors.password = error.replace(/"([^"]*)"/, "$1");
            break;
          default:
            break;
        }
      });
    },
  },
});

export const {
  sign_in_failure,
  sign_in_start,
  sign_in_success,
  failed_validation,
} = userSlice.actions;

export default userSlice.reducer;
