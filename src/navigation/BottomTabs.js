import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeActive from '../assets/svg/svgicons/bottomtabs/HomeActive';
import HomeInactive from '../assets/svg/svgicons/bottomtabs/HomeInactive';
import NotiActive from '../assets/svg/svgicons/bottomtabs/NotiActive';
import NotiInactive from '../assets/svg/svgicons/bottomtabs/NotiInactive';
import TermsInactive from '../assets/svg/svgicons/bottomtabs/TermsInactive';
import TermsActive from '../assets/svg/svgicons/bottomtabs/TermsActive';
import UserActive from '../assets/svg/svgicons/bottomtabs/UserActive';
import UserInactive from '../assets/svg/svgicons/bottomtabs/UserInactive';

import HomeScreen from '../screens/HomeScreen';
import NotificationScreen from '../screens/NotificationScreen';
import TermsScreen from '../screens/TermsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();


// Custom Tab Bar Component with Safe Area
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={{ 
      flexDirection: 'row', 
      height: 60 + insets.bottom, // Add bottom inset to height
      paddingBottom: insets.bottom, // Add padding at the bottom
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#eee'
    }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let IconComponent;
        switch (route.name) {
          case 'Home':
            IconComponent = isFocused ? HomeActive : HomeInactive;
            break;
          case 'Notification':
            IconComponent = isFocused ? NotiActive : NotiInactive;
            break;
          case 'Terms':
            IconComponent = isFocused ? TermsActive : TermsInactive;
            break;
          case 'Profile':
            IconComponent = isFocused ? UserActive : UserInactive;
            break;
        }

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={{ 
              flex: 1, 
              justifyContent: 'center', 
              alignItems: 'center',
              paddingVertical: 5
            }}
          >
            <View style={{ paddingTop: 5 }}>
              <IconComponent />
            </View>
            <Text style={{ 
              fontSize: 12, 
              color: isFocused ? '#000' : '#999999',
              marginTop: 3,
            }}>
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Notification" component={NotificationScreen} />
      <Tab.Screen name="Terms" component={TermsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;