import api from './ApiClient';

export const getEnquiries = async (page = 1, limit = 20, filters = {}) => {
  try {
    const params = {
      page,
      limit,
      ...filters
    };

    const response = await api.get('enquiry/', { params });
    
    console.log('✅ Enquiries fetched successfully');
    return {
      success: true,
      data: response.data.data,
      pagination: response.data.pagination,
      message: response.data.message
    };
  } catch (error) {
    const msg = error?.response?.data?.message || 'Failed to fetch enquiries';
    console.log('❌ Enquiry fetch error:', msg);
    return {
      success: false,
      error: msg,
      data: [],
      pagination: null
    };
  }
};

export const searchEnquiries = async (searchQuery, page = 1, limit = 20) => {
  try {
    const params = {
      page,
      limit,
      search: searchQuery
    };

    const response = await api.get('enquiry/', { params });
    
    console.log('✅ Enquiries search successful');
    return {
      success: true,
      data: response.data.data,
      pagination: response.data.pagination,
      message: response.data.message
    };
  } catch (error) {
    const msg = error?.response?.data?.message || 'Failed to search enquiries';
    console.log('❌ Enquiry search error:', msg);
    return {
      success: false,
      error: msg,
      data: [],
      pagination: null
    };
  }
};

export const getEnquiryStats = async () => {
  try {
    // You might need to adjust this endpoint based on your API
    const response = await api.get('enquiry/stats');
    
    console.log('✅ Enquiry stats fetched successfully');
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.log('❌ Enquiry stats error:', error?.response?.data?.message || 'Failed to fetch stats');
    // Return default stats if API fails
    return {
      success: false,
      data: {
        totalLeads: 0,
        newLeads: 0
      }
    };
  }
};

export const updateEnquiryNote = async (enquiryId, notes, status ) => {
  try {
    const payload = {
      enquiryId,
      notes,
      status
    };

    const response = await api.post('enquiry/change-status', payload);
    
    console.log('✅ Enquiry note updated successfully');
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    const msg = error?.response?.data?.message || 'Failed to update enquiry note';
    console.log('❌ Enquiry note update error:', msg);
    return {
      success: false,
      error: msg,
      data: null
    };
  }
};

export const updateEnquiryStatus = async (enquiryId, status) => {
  try {
    const payload = {
      enquiryId,
      status
    };

    const response = await api.post('enquiry/change-status', payload);
    
    console.log('✅ Enquiry status updated successfully');
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    const msg = error?.response?.data?.message || 'Failed to update enquiry status';
    console.log('❌ Enquiry status update error:', msg);
    return {
      success: false,
      error: msg,
      data: null
    };
  }
};

export const getNotifications = async (page = 1, limit = 20) => {
  try {
    const params = {
      page,
      limit
    };

    const response = await api.get('notifications/', { params });
    
    console.log('✅ Notifications fetched successfully');
    return {
      success: true,
      data: response.data.data,
      pagination: response.data.pagination,
      message: response.data.message
    };
  } catch (error) {
    const msg = error?.response?.data?.message || 'Failed to fetch notifications';
    console.log('❌ Notifications fetch error:', msg);
    return {
      success: false,
      error: msg,
      data: [],
      pagination: null
    };
  }
};
