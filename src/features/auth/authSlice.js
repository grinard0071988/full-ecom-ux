import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/index";

// ----------------------
//  Async Thunks
// ----------------------

// Register user
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, thunkAPI) => {
    try {
      const res = await axiosClient.post("/users/register", formData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue({
        error: err.response?.data?.error || "Registration failed",
      });
    }
  }
);

// Login user
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await axiosClient.post("/users/login", { email, password });

      // Save token
      localStorage.setItem("token", res.data.token);

      return res.data; // { token, user? }
    } catch (err) {
      return thunkAPI.rejectWithValue({
        error: err.response?.data?.error || "Login failed",
      });
    }
  }
);

// Load user (session persistence)
export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, thunkAPI) => {
    try {
      const res = await axiosClient.get("/users/profile");
      return res.data; // user object
    } catch (err) {
      const status = err.response?.status;

      // Only invalidate token if backend says unauthorized
      if (status === 401) {
        return thunkAPI.rejectWithValue("Unauthorized");
      }

      return thunkAPI.rejectWithValue("Network error");
    }
  }
);

//  Slice

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        // User is NOT auto-logged in — UI handles redirect
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.isAuthenticated = true;

        // If backend returns user in login response, set it
        if (action.payload.user) {
          state.user = action.payload.user;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Load User
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          ...action.payload,
          name: `${action.payload.firstname} ${action.payload.lastname}`,
        };
        state.isAuthenticated = true;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;

        if (action.payload === "Unauthorized") {
          // Token invalid → logout
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          localStorage.removeItem("token");
        }

        // If network error → do NOT logout
      });
  },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
