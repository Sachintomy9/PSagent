import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { getNotifications } from '../services/EnquiryService';
import { markAllAsReadAsync } from '../redux/slices/NotificationSlice';
import { fonts } from '../../styles/fonts';

const NotificationScreen = () => {
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadNotifications();
    
    // Set up a timer to mark notifications as read after 2 seconds
    const markAsReadTimer = setTimeout(() => {
      dispatch(markAllAsReadAsync());
    }, 2000);

    // Cleanup timer on unmount
    return () => clearTimeout(markAsReadTimer);
  }, [dispatch]);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const result = await getNotifications(1, 20);
      
      if (result.success) {
        setNotifications(result.data);
        setCurrentPage(result.pagination.currentPage);
        setTotalPages(result.pagination.totalPages);
      } else {
        Alert.alert('Error', result.error || 'Failed to load notifications');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load notifications');
      console.error('Load notifications error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadNotifications();
    } finally {
      setRefreshing(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const renderNotificationCard = (notification, index) => (
    <View key={notification._id} style={styles.notificationCard}>
      <Text style={styles.timestamp}>
        {formatDate(notification.createdAt)}
      </Text>
      <Text style={styles.message}>
        {notification.message}
      </Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No notifications available</Text>
      <Text style={styles.emptySubtext}>Pull down to refresh</Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      {/* Notifications List */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#000']} // Android
            tintColor="#000" // iOS
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {notifications.length > 0 ? (
          notifications.map((notification, index) => 
            renderNotificationCard(notification, index)
          )
        ) : (
          renderEmptyState()
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
  },
  header: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: fonts.PoppinsSemiBold,
    color: '#000',
    textAlign: 'center',
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    fontFamily: fonts.PoppinsRegular,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#333',
    fontFamily: fonts.PoppinsRegular,
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: fonts.PoppinsMedium,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: fonts.PoppinsRegular,
    color: '#999',
    textAlign: 'center',
  },
});