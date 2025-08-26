// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/AuthSlice';
import profileReducer from './slices/ProfileSlice';
import notificationReducer from './slices/NotificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    notification: notificationReducer,
  },
});
