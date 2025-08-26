import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logout } from '../redux/slices/AuthSlice';
import { fetchProfileData } from '../redux/slices/ProfileSlice';
import LogoutIcon from '../assets/svg/svgicons/Home/LogoutIcon';
import { fonts } from '../../styles/fonts';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { 
    name, 
    image, 
    createdAt, 
    allLeadsCount, 
    closedLeadsCount,
    commission,
    isLoading 
  } = useSelector((state) => state.profile);

  useEffect(() => {
    // Fetch latest profile data when screen loads
    dispatch(fetchProfileData());
  }, [dispatch]);

  const formatStartDate = (dateString) => {
    if (!dateString) return '01/09/2010'; // Default date
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  };

  const getProfileImageSource = () => {
    if (image?.webp?.url) {
      return { uri: image.webp.url };
    }
    return null; // Will show default circle with initial
  };

  const getInitials = (fullName) => {
    if (!fullName) return 'J';
    return fullName.charAt(0).toUpperCase();
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => dispatch(logout()) }
      ]
    );
  };

  const handleRefresh = () => {
    dispatch(fetchProfileData());
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Profile</Text>
        <TouchableOpacity onPress={handleRefresh}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        {/* Profile Picture */}
        <View style={styles.profileImageContainer}>
          {getProfileImageSource() ? (
            <Image source={getProfileImageSource()} style={styles.profileImage} />
          ) : (
            <View style={styles.defaultProfileImage}>
              <Text style={styles.profileInitial}>{getInitials(name)}</Text>
            </View>
          )}
        </View>

        {/* Name */}
        <Text style={styles.userName}>{name || 'Jhon Doe'}</Text>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogoutIcon />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Started Date : </Text>
          <Text style={styles.statValue}>{formatStartDate(createdAt)}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Leads : </Text>
          <Text style={styles.statValue}>{allLeadsCount}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>No Of Closed Deals : </Text>
          <Text style={styles.statValue}>{closedLeadsCount}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Commission : </Text>
          <Text style={styles.statValue}>{commission || '1.2M'} AED</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontFamily: fonts.PoppinsRegular,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: fonts.PoppinsSemiBold,
    color: '#000',
  },
  refreshText: {
    fontSize: 16,
    color: '#007AFF',
    fontFamily: fonts.PoppinsRegular,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  defaultProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 32,
    fontFamily: fonts.PoppinsBold,
    color: '#666',
  },
  userName: {
    fontSize: 18,
    fontFamily: fonts.PoppinsSemiBold,
    color: '#000',
    marginBottom: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    color: '#000',
    fontFamily: fonts.PoppinsRegular,
  },
  statsContainer: {
    gap: 12,
  },
  statCard: {
    backgroundColor: '#E8E8E8',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 16,
    fontFamily: fonts.PoppinsRegular,
    color: '#000',
  },
  statValue: {
    fontSize: 16,
    fontFamily: fonts.PoppinsSemiBold,
    color: '#000',
  },
});

export default ProfileScreen;