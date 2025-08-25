import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  StatusBar,
  ActivityIndicator,
  Alert,
  Linking
} from 'react-native';
import { useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logout } from '../redux/slices/AuthSlice';

// Components
import LeadCard from '../components/LeadCard';

// Services
import { getEnquiries, searchEnquiries, getEnquiryStats } from '../services/EnquiryService';

// Icons
import SearchIcon from '../assets/svg/svgicons/Home/SearchIcon';
import LogoutIcon from '../assets/svg/svgicons/Home/LogoutIcon';
import { fonts } from '../../styles/fonts';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  
  // Filter states
  const [selectedEmirate, setSelectedEmirate] = useState('Emirates');
  const [selectedCity, setSelectedCity] = useState('City');
  const [selectedCategory, setSelectedCategory] = useState('Category');
  const [selectedType, setSelectedType] = useState('Type');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Stats
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0
  });

  const statusFilters = ['All', 'New Leads', 'On Progress'];

  // Transform backend data to match LeadCard format
  const transformEnquiryToLead = (enquiry) => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    };

    return {
      id: enquiry._id,
      date: formatDate(enquiry.createdAt),
      status: enquiry.status === 'not interested' ? 'Not Interested' : 
              enquiry.status === 'interested' ? 'New' : 
              enquiry.status === 'in_progress' ? 'In Progress' : 
              enquiry.status === 'completed' ? 'Completed' : 
              enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1),
      name: enquiry.name,
      number: enquiry.number.startsWith('971') ? `+${enquiry.number}` : enquiry.number,
      project: enquiry.projectDetails?.projectTitle || 'N/A',
      developer: enquiry.developerDetails?.name || 'N/A',
      notes: enquiry.notes || '',
      attempts: enquiry.attempts || 0,
      isLocked: enquiry.isLocked || false,
      agentName: enquiry.agencyDetails?.name || 'N/A'
    };
  };

  useEffect(() => {
    loadInitialData();
    loadStats();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const delayedSearch = setTimeout(() => {
        handleSearch();
      }, 500); // Debounce search

      return () => clearTimeout(delayedSearch);
    } else {
      setFilteredLeads(leads);
    }
  }, [searchQuery, leads]);

  useEffect(() => {
    filterLeadsByStatus();
  }, [selectedStatus, leads]);

  const loadStats = async () => {
    const result = await getEnquiryStats();
    if (result.success) {
      setStats(result.data);
    }
  };

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const result = await getEnquiries(1, 20);
      
      if (result.success) {
        const transformedLeads = result.data.map(transformEnquiryToLead);
        setLeads(transformedLeads);
        setFilteredLeads(transformedLeads);
        setCurrentPage(result.pagination.currentPage);
        setTotalPages(result.pagination.totalPages);
        setTotalRecords(result.pagination.totalRecords);
        
        // Update stats based on actual data
        const totalLeads = result.pagination.totalRecords;
        const newLeads = transformedLeads.filter(lead => lead.status === 'New').length;
        setStats({ totalLeads, newLeads });
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load leads');
      console.error('Load initial data error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreData = async () => {
    if (isLoadingMore || currentPage >= totalPages) return;
    
    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const result = await getEnquiries(nextPage, 20);
      
      if (result.success) {
        const transformedLeads = result.data.map(transformEnquiryToLead);
        setLeads(prevLeads => [...prevLeads, ...transformedLeads]);
        setCurrentPage(result.pagination.currentPage);
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load more leads');
      console.error('Load more data error:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const result = await searchEnquiries(searchQuery, 1, 20);
      
      if (result.success) {
        const transformedLeads = result.data.map(transformEnquiryToLead);
        setFilteredLeads(transformedLeads);
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Search failed');
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const filterLeadsByStatus = () => {
    let filtered = leads;

    if (selectedStatus !== 'All') {
      if (selectedStatus === 'New Leads') {
        filtered = filtered.filter(lead => lead.status === 'New');
      } else if (selectedStatus === 'On Progress') {
        filtered = filtered.filter(lead => lead.status === 'In Progress');
      }
    }

    // Only apply status filter if not searching
    if (!searchQuery.trim()) {
      setFilteredLeads(filtered);
    }
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

  const handleCall = (lead) => {
    Alert.alert(
      'Call Lead',
      `Do you want to call ${lead.name} at ${lead.number}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call', 
          onPress: () => {
            Linking.openURL(`tel:${lead.number.replace(/\s+/g, '')}`);
          }
        }
      ]
    );
  };

  const handleAddNote = (lead) => {
    Alert.alert('Add Note', `Add note for ${lead.name}`);
  };

  const renderLeadCard = ({ item }) => (
    <LeadCard 
      lead={item} 
      onCall={handleCall}
      onAddNote={handleAddNote}
    />
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#000" />
        <Text style={styles.loadingText}>Loading more leads...</Text>
      </View>
    );
  };

  const renderEmptyComponent = () => {
    if (isLoading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {searchQuery ? 'No leads found for your search' : 'No leads available'}
        </Text>
        <Text style={styles.emptySubtext}>
          {searchQuery ? 'Try adjusting your search terms' : 'New leads will appear here'}
        </Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Loading leads...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi, Jhon Doe</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
          <LogoutIcon />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchIcon style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {isSearching && (
          <ActivityIndicator size="small" color="#000" style={styles.searchLoader} />
        )}
      </View>

      {/* Statistics Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalLeads}</Text>
          <Text style={styles.statLabel}>Total Leads</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.newLeads}</Text>
          <Text style={styles.statLabel}>New Leads</Text>
        </View>
      </View>

      {/* Filter Dropdowns Row */}
      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterDropdown}>
          <Text style={styles.filterDropdownText}>{selectedEmirate}</Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.filterDropdown}>
          <Text style={styles.filterDropdownText}>{selectedCity}</Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterDropdown}>
          <Text style={styles.filterDropdownText}>{selectedCategory}</Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.filterDropdown}>
          <Text style={styles.filterDropdownText}>{selectedType}</Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>
      </View>

      {/* Status Filters */}
      <View style={styles.statusFilterContainer}>
        {statusFilters.map((status) => (
          <TouchableOpacity 
            key={status}
            style={[
              styles.statusFilter,
              selectedStatus === status && styles.activeStatusFilter
            ]}
            onPress={() => setSelectedStatus(status)}
          >
            <Text style={[
              styles.statusFilterText,
              selectedStatus === status && styles.activeStatusFilterText
            ]}>
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Leads List */}
      <FlatList
        data={filteredLeads}
        renderItem={renderLeadCard}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={[
          styles.listContainer,
          filteredLeads.length === 0 && styles.emptyListContainer
        ]}
        style={styles.flatList}
        refreshing={isLoading}
        onRefresh={loadInitialData}
      />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 20,
    fontFamily: fonts.PoppinsSemiBold,
    color: '#000',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    fontFamily: fonts.PoppinsRegular,
  },
  searchLoader: {
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: '#E8E8E8',
    borderRadius: 12,
    padding: 20,
    width: '48%',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontFamily: fonts.PoppinsBold,
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    fontFamily: fonts.PoppinsRegular,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  filterDropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterDropdownText: {
    fontSize: 14,
    color: '#666',
    fontFamily: fonts.PoppinsRegular,
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666',
  },
  statusFilterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 4,
  },
  statusFilter: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeStatusFilter: {
    backgroundColor: '#000',
  },
  statusFilterText: {
    fontSize: 12,
    color: '#666',
    fontFamily: fonts.PoppinsRegular,
  },
  activeStatusFilterText: {
    color: '#fff',
    fontFamily: fonts.PoppinsMedium,
  },
  flatList: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
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
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    fontFamily: fonts.PoppinsRegular,
  },
});

export default HomeScreen;