import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { loadAuthState } from '../redux/slices/AuthSlice';
import SplashScreen from '../screens/SplashScreen';
import BottomTabs from './BottomTabs';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const dispatch = useDispatch();
  const { initializing, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadAuthState());
  }, [dispatch]);

  console.log('Auth State - initializing:', initializing, 'isAuthenticated:', isAuthenticated);

  if (initializing) {
    return <SplashScreen />;
  }
  return (
    <NavigationContainer>
      {isAuthenticated ? (
        // Authenticated Stack (show Bottom Tabs)
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={BottomTabs} />
        </Stack.Navigator>
      ) : (
        // Unauthenticated Stack
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={require('../screens/LoginScreen').default} />
          <Stack.Screen name="Register" component={require('../screens/RegisterScreen').default} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;