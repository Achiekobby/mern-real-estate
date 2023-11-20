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
    update_user_start: (state) => {
      state.loading = true;
    },

    update_success: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },

    update_failure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    delete_start: (state) => {
      state.loading = true;
    },

    delete_success: (state) => {
      state.loading = false;
      state.currentUser = null;
      state.error=null;
    },

    delete_failure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  sign_in_failure,
  sign_in_start,
  sign_in_success,
  failed_validation,
  update_failure,
  update_success,
  update_user_start,
  delete_success,
  delete_start,
  delete_failure
} = userSlice.actions;

export default userSlice.reducer;
