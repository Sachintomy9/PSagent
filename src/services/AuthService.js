import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import api from './ApiClient';
const API_URL = 'https://v1-api.propertyseller.com/api/v1/';

export const login = async (username, password) => {
  try {
    console.log("Entering credentials: username:",username);
     console.log("Entering credentials: password:",password);
    const response = await axios.post(`${API_URL}agent/login`, {
      username,
      password,
    });

    const { accessToken, refreshToken, user } = response.data;

    await Keychain.setGenericPassword('tokens', JSON.stringify({
      accessToken,
      refreshToken,
    }));

    console.log('🔐 Tokens stored after login.');
    return { 
      success: true, 
      user: user // Return user data for profile setup
    };
  } catch (error) {
    const msg = error?.response?.data?.message || 'Login failed';
    console.log('❌ Login error:', msg);
    return { success: false, error: msg };
  }
};

// LOGOUT: Clear tokens from secure storage
export const logout = async () => {
  await Keychain.resetGenericPassword();
  console.log('🔒 User logged out. Tokens cleared.');
};

// GET TOKENS: From Keychain
export const getTokens = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      return JSON.parse(credentials.password);
    }
    return null;
  } catch (error) {
    console.error('❌ Keychain read error:', error);
    return null;
  }
};

// REFRESH ACCESS TOKEN: When JWT expires
export const refreshToken = async () => {
  try {
    const tokens = await getTokens();
    if (!tokens?.refreshToken) throw new Error('No refresh token found');

    console.log('🔁 Attempting to refresh token...');
    console.log("Current Refresh Token:", tokens.refreshToken);

    // Use axios directly with refresh token as Bearer token
    const response = await axios.post(`${API_URL}agent/refresh-token`, {}, {
      headers: {
        Authorization: `Bearer ${tokens.refreshToken}`,
      },
    });

    const { token: accessToken, refreshToken: newRefreshToken } = response.data;

    await Keychain.setGenericPassword('tokens', JSON.stringify({
      accessToken,
      refreshToken: newRefreshToken,
    }));


    console.log('✅ Token refreshed and stored successfully.');
    return accessToken;
  } catch (error) {
    console.error(' Logging out:', error?.response?.data || error.message);
    await logout();
    return null;
  }
};