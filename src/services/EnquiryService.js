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
