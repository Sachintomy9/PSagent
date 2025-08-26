import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/ApiClient';

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
    },
    setCommission: (state, action) => {
      state.commission = action.payload;
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
    },
  },
  extraReducers: (builder) => {
    builder
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
