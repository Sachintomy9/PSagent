import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getNotifications } from '../../services/EnquiryService';

// Helper function to get user-specific storage keys
const getStorageKeys = (username) => ({
  UNREAD_COUNT: `@notification_unread_count_${username}`,
  LAST_NOTIFICATION_IDS: `@last_notification_ids_${username}`,
});

// Helper function to save unread count to AsyncStorage (user-specific)
const saveUnreadCountToStorage = async (count, username) => {
  if (!username) return;
  try {
    const keys = getStorageKeys(username);
    await AsyncStorage.setItem(keys.UNREAD_COUNT, count.toString());
  } catch (error) {
    console.error('Failed to save unread count to storage:', error);
  }
};

// Helper function to save notification IDs to AsyncStorage (user-specific)
const saveNotificationIdsToStorage = async (ids, username) => {
  if (!username) return;
  try {
    const keys = getStorageKeys(username);
    await AsyncStorage.setItem(keys.LAST_NOTIFICATION_IDS, JSON.stringify(ids));
  } catch (error) {
    console.error('Failed to save notification IDs to storage:', error);
  }
};

// Helper function to clear user-specific notification data
const clearUserNotificationData = async (username) => {
  if (!username) return;
  try {
    const keys = getStorageKeys(username);
    await Promise.all([
      AsyncStorage.removeItem(keys.UNREAD_COUNT),
      AsyncStorage.removeItem(keys.LAST_NOTIFICATION_IDS)
    ]);
    console.log('✅ Cleared notification data for user:', username);
  } catch (error) {
    console.error('Failed to clear user notification data:', error);
  }
};

// Async thunk to load unread count from AsyncStorage (user-specific)
export const loadUnreadCountFromStorage = createAsyncThunk(
  'notification/loadFromStorage',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { profile } = getState();
      const username = profile.username;
      
      if (!username) {
        return { unreadCount: 0, lastNotificationIds: [] };
      }
      
      const keys = getStorageKeys(username);
      const [storedCount, storedIds] = await Promise.all([
        AsyncStorage.getItem(keys.UNREAD_COUNT),
        AsyncStorage.getItem(keys.LAST_NOTIFICATION_IDS)
      ]);
      
      return {
        unreadCount: storedCount ? parseInt(storedCount, 10) : 0,
        lastNotificationIds: storedIds ? JSON.parse(storedIds) : []
      };
    } catch (error) {
      console.error('Failed to load notification data from storage:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch and compare notifications
export const fetchUnreadNotificationCount = createAsyncThunk(
  'notification/fetchUnreadCount',
  async (_, { getState, rejectWithValue }) => {
    try {
      const result = await getNotifications(1, 20);
      if (result.success) {
        const state = getState();
        const { notification, profile } = state;
        const username = profile.username;
        
        const currentNotificationIds = result.data.map(notification => notification._id);
        const { lastNotificationIds } = notification;
        
        // Calculate new notifications by comparing IDs
        const newNotifications = currentNotificationIds.filter(
          id => !lastNotificationIds.includes(id)
        );
        
        // Save current notification IDs for future comparison (user-specific)
        await saveNotificationIdsToStorage(currentNotificationIds, username);
        
        // If there are new notifications, we need to save the updated count too
        // This will be calculated in the reducer, but we'll save it via a separate action
        
        return {
          totalNotifications: result.data.length,
          currentNotificationIds,
          newNotificationsCount: newNotifications.length,
          username, // Pass username to be used in a follow-up action if needed
        };
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to mark all as read with storage update (user-specific)
export const markAllAsReadAsync = createAsyncThunk(
  'notification/markAllAsReadAsync',
  async (_, { getState }) => {
    try {
      const { profile } = getState();
      const username = profile.username;
      
      await saveUnreadCountToStorage(0, username);
      return 0;
    } catch (error) {
      console.error('Failed to mark as read:', error);
      throw error;
    }
  }
);

// Helper thunk to save current unread count to storage
export const saveCurrentUnreadCount = createAsyncThunk(
  'notification/saveCurrentCount',
  async (_, { getState }) => {
    try {
      const state = getState();
      const { profile, notification } = state;
      const username = profile.username;
      
      if (username) {
        await saveUnreadCountToStorage(notification.unreadCount, username);
      }
      return notification.unreadCount;
    } catch (error) {
      console.error('Failed to save current unread count:', error);
      throw error;
    }
  }
);

// Async thunk to clear notification data on logout
export const clearNotificationDataOnLogout = createAsyncThunk(
  'notification/clearOnLogout',
  async (username, { rejectWithValue }) => {
    try {
      if (username) {
        await clearUserNotificationData(username);
      }
      return { success: true };
    } catch (error) {
      console.error('Failed to clear notification data on logout:', error);
      return rejectWithValue(error.message);
    }
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    unreadCount: 0,
    lastNotificationIds: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    markAllAsRead: (state) => {
      state.unreadCount = 0;
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetNotificationState: (state) => {
      state.unreadCount = 0;
      state.lastNotificationIds = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load from storage
      .addCase(loadUnreadCountFromStorage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadUnreadCountFromStorage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.unreadCount = action.payload.unreadCount;
        state.lastNotificationIds = action.payload.lastNotificationIds;
      })
      .addCase(loadUnreadCountFromStorage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch unread count
      .addCase(fetchUnreadNotificationCount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUnreadNotificationCount.fulfilled, (state, action) => {
        state.isLoading = false;
        const { currentNotificationIds, newNotificationsCount } = action.payload;
        
        // Update stored notification IDs
        state.lastNotificationIds = currentNotificationIds;
        
        // Only increase unread count if there are new notifications
        if (newNotificationsCount > 0) {
          state.unreadCount += newNotificationsCount;
          // Note: Storage saving will be handled by a separate dispatch in the component
        }
      })
      .addCase(saveCurrentUnreadCount.fulfilled, (state) => {
        // Count is already saved to storage, no state change needed
      })
      .addCase(saveCurrentUnreadCount.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchUnreadNotificationCount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Mark all as read async
      .addCase(markAllAsReadAsync.fulfilled, (state) => {
        state.unreadCount = 0;
      })
      .addCase(markAllAsReadAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Clear notification data on logout
      .addCase(clearNotificationDataOnLogout.fulfilled, (state) => {
        state.unreadCount = 0;
        state.lastNotificationIds = [];
        state.error = null;
      })
      .addCase(clearNotificationDataOnLogout.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setUnreadCount, markAllAsRead, incrementUnreadCount, clearError, resetNotificationState } = notificationSlice.actions;

export default notificationSlice.reducer;
