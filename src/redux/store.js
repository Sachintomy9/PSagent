// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/AuthSlice';
import profileReducer from './slices/ProfileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
  },
});
