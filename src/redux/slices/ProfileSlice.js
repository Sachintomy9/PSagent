import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/ApiClient';

// Constants for AsyncStorage keys
const PROFILE_STORAGE_KEY = 'user_profile_data';

// Async thunk to load profile data from AsyncStorage
export const loadProfileFromStorage = createAsyncThunk(
  'profile/loadProfileFromStorage',
  async (_, { rejectWithValue }) => {
    try {
      const storedProfile = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
      if (storedProfile) {
        return JSON.parse(storedProfile);
      }
      return null;
    } catch (error) {
      console.log('❌ Error loading profile from storage:', error);
      return rejectWithValue('Failed to load profile from storage');
    }
  }
);

// Async thunk to save profile data to AsyncStorage
export const saveProfileToStorage = createAsyncThunk(
  'profile/saveProfileToStorage',
  async (profileData, { rejectWithValue }) => {
    try {
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData));
      return profileData;
    } catch (error) {
      console.log('❌ Error saving profile to storage:', error);
      return rejectWithValue('Failed to save profile to storage');
    }
  }
);

// Async thunk to fetch agent profile data
export const fetchProfileData = createAsyncThunk(
  'profile/fetchProfileData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('agent/count/leads');
      
      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || 'Failed to fetch profile data');
      }
    } catch (error) {
      const msg = error?.response?.data?.message || 'Failed to fetch profile data';
      console.log('❌ Profile data fetch error:', msg);
      return rejectWithValue(msg);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    // User info from login response
    name: '',
    username: '',
    image: null,
    createdAt: '',
    
    // Lead counts from agent/count/leads
    newLeadsCount: 0,
    allLeadsCount: 0,
    closedLeadsCount: 0,
    campaignNewLeadsCount: 0,
    campaignAllLeadsCount: 0,
    campaignClosedLeadsCount: 0,
    
    // Commission (you might want to add this later)
    commission: '0',
    
    // Loading states
    isLoading: false,
    error: null,
  },
  reducers: {
    setUserInfo: (state, action) => {
      const { name, username, image, createdAt } = action.payload;
      state.name = name;
      state.username = username;
      state.image = image;
      state.createdAt = createdAt;
      
      // Auto-save to storage whenever user info is updated
      const profileData = {
        name,
        username,
        image,
        createdAt,
        newLeadsCount: state.newLeadsCount,
        allLeadsCount: state.allLeadsCount,
        closedLeadsCount: state.closedLeadsCount,
        campaignNewLeadsCount: state.campaignNewLeadsCount,
        campaignAllLeadsCount: state.campaignAllLeadsCount,
        campaignClosedLeadsCount: state.campaignClosedLeadsCount,
        commission: state.commission,
      };
      
      AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData))
        .catch(error => console.log('❌ Error auto-saving profile:', error));
    },
    setLeadCounts: (state, action) => {
      const {
        newLeadsCount,
        allLeadsCount,
        closedLeadsCount,
        campaignNewLeadsCount,
        campaignAllLeadsCount,
        campaignClosedLeadsCount
      } = action.payload;
      
      state.newLeadsCount = newLeadsCount;
      state.allLeadsCount = allLeadsCount;
      state.closedLeadsCount = closedLeadsCount;
      state.campaignNewLeadsCount = campaignNewLeadsCount;
      state.campaignAllLeadsCount = campaignAllLeadsCount;
      state.campaignClosedLeadsCount = campaignClosedLeadsCount;
      
      // Auto-save to storage whenever lead counts are updated
      const profileData = {
        name: state.name,
        username: state.username,
        image: state.image,
        createdAt: state.createdAt,
        newLeadsCount,
        allLeadsCount,
        closedLeadsCount,
        campaignNewLeadsCount,
        campaignAllLeadsCount,
        campaignClosedLeadsCount,
        commission: state.commission,
      };
      
      AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData))
        .catch(error => console.log('❌ Error auto-saving profile:', error));
    },
    setCommission: (state, action) => {
      state.commission = action.payload;
      
      // Auto-save to storage whenever commission is updated
      const profileData = {
        name: state.name,
        username: state.username,
        image: state.image,
        createdAt: state.createdAt,
        newLeadsCount: state.newLeadsCount,
        allLeadsCount: state.allLeadsCount,
        closedLeadsCount: state.closedLeadsCount,
        campaignNewLeadsCount: state.campaignNewLeadsCount,
        campaignAllLeadsCount: state.campaignAllLeadsCount,
        campaignClosedLeadsCount: state.campaignClosedLeadsCount,
        commission: action.payload,
      };
      
      AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData))
        .catch(error => console.log('❌ Error auto-saving profile:', error));
    },
    clearProfileData: (state) => {
      state.name = '';
      state.username = '';
      state.image = null;
      state.createdAt = '';
      state.newLeadsCount = 0;
      state.allLeadsCount = 0;
      state.closedLeadsCount = 0;
      state.campaignNewLeadsCount = 0;
      state.campaignAllLeadsCount = 0;
      state.campaignClosedLeadsCount = 0;
      state.commission = '0';
      state.error = null;
      
      // Clear from storage when profile is cleared
      AsyncStorage.removeItem(PROFILE_STORAGE_KEY)
        .catch(error => console.log('❌ Error clearing profile from storage:', error));
    },
  },
  extraReducers: (builder) => {
    builder
      // Load profile from storage
      .addCase(loadProfileFromStorage.fulfilled, (state, action) => {
        if (action.payload) {
          const {
            name,
            username,
            image,
            createdAt,
            newLeadsCount,
            allLeadsCount,
            closedLeadsCount,
            campaignNewLeadsCount,
            campaignAllLeadsCount,
            campaignClosedLeadsCount,
            commission
          } = action.payload;
          
          state.name = name || '';
          state.username = username || '';
          state.image = image || null;
          state.createdAt = createdAt || '';
          state.newLeadsCount = newLeadsCount || 0;
          state.allLeadsCount = allLeadsCount || 0;
          state.closedLeadsCount = closedLeadsCount || 0;
          state.campaignNewLeadsCount = campaignNewLeadsCount || 0;
          state.campaignAllLeadsCount = campaignAllLeadsCount || 0;
          state.campaignClosedLeadsCount = campaignClosedLeadsCount || 0;
          state.commission = commission || '0';
        }
      })
      .addCase(loadProfileFromStorage.rejected, (state, action) => {
        console.log('Failed to load profile from storage:', action.payload);
      })
      // Save profile to storage
      .addCase(saveProfileToStorage.fulfilled, (state, action) => {
        console.log('✅ Profile saved to storage successfully');
      })
      .addCase(saveProfileToStorage.rejected, (state, action) => {
        console.log('❌ Failed to save profile to storage:', action.payload);
      })
      // Fetch profile data from API
      .addCase(fetchProfileData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfileData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.newLeadsCount = action.payload.newLeadsCount;
        state.allLeadsCount = action.payload.allLeadsCount;
        state.closedLeadsCount = action.payload.closedLeadsCount;
        state.campaignNewLeadsCount = action.payload.campaignNewLeadsCount;
        state.campaignAllLeadsCount = action.payload.campaignAllLeadsCount;
        state.campaignClosedLeadsCount = action.payload.campaignClosedLeadsCount;
        
        // Auto-save to storage when API data is fetched
        const profileData = {
          name: state.name,
          username: state.username,
          image: state.image,
          createdAt: state.createdAt,
          newLeadsCount: action.payload.newLeadsCount,
          allLeadsCount: action.payload.allLeadsCount,
          closedLeadsCount: action.payload.closedLeadsCount,
          campaignNewLeadsCount: action.payload.campaignNewLeadsCount,
          campaignAllLeadsCount: action.payload.campaignAllLeadsCount,
          campaignClosedLeadsCount: action.payload.campaignClosedLeadsCount,
          commission: state.commission,
        };
        
        AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData))
          .catch(error => console.log('❌ Error auto-saving profile after API fetch:', error));
      })
      .addCase(fetchProfileData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  setUserInfo, 
  setLeadCounts, 
  setCommission, 
  clearProfileData 
} = profileSlice.actions;


export default profileSlice.reducer;
