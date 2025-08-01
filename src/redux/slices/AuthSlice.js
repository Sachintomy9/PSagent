// redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getTokens,
  logout as logoutService,
} from '../../services/AuthService';

// Async thunk to load auth state
export const loadAuthState = createAsyncThunk(
  'auth/loadAuthState',
  async (_, { dispatch }) => {
    const tokens = await getTokens();

    return {
      isAuthenticated: !!tokens?.accessToken || guest,
      isGuest: guest,
    };
  }
);

// Async thunk to login (re-triggers auth state load)
export const loginUser = createAsyncThunk('auth/loginUser', async (_, { dispatch }) => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  await dispatch(loadAuthState());
});

// Logout user
export const logout = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  await logoutService();
  return;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    isGuest: false,
    initializing: true,
  },
  reducers: {
    setInitializing: (state, action) => {
      state.initializing = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAuthState.pending, (state) => {
        state.initializing = true;
      })
      .addCase(loadAuthState.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload.isAuthenticated;
        state.isGuest = action.payload.isGuest;
        state.initializing = false;
      })
      .addCase(loadAuthState.rejected, (state) => {
        state.initializing = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.isGuest = false;
        state.initializing = false;
      });
  },
});

export const { setInitializing } = authSlice.actions;
export default authSlice.reducer;
