import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import CallIcon from '../assets/svg/svgicons/Home/CallIcon';
import PenIcon from '../assets/svg/svgicons/Home/PenIcon';
import { fonts } from '../../styles/fonts';

const LeadCard = ({ lead, onCall, onAddNote, onStatusChange }) => {
  // Convert display status back to backend value
  const getBackendStatus = (displayStatus) => {
    switch(displayStatus) {
      case 'Not Interested': return 'not interested';
      case 'New': return 'interested';
      case 'Pending': return 'pending';
      case 'Closed': return 'closed';
      case 'In Progress': return 'in_progress';
      case 'Completed': return 'completed';
      default: return displayStatus.toLowerCase();
    }
  };

  const [selectedStatus, setSelectedStatus] = useState(getBackendStatus(lead.status));
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const leadStatusChange = [
    {
      label: 'Pending',
      value: 'pending'
    }, 
    {
      label: 'Closed',
      value: 'closed'
    }, 
    {
      label: "Interested",
      value: "interested"
    }, 
    {
      label: "Not Interested",
      value: "not interested"
    }
  ];

  const handleStatusChange = async (item) => {
    try {
      setSelectedStatus(item.value);
      setIsDropdownVisible(false);
      
      // Call the parent callback with the new status
      if (onStatusChange) {
        await onStatusChange(lead.id, item.value);
      }
    } catch (error) {
      // Reset to previous status if update fails
      setSelectedStatus(getBackendStatus(lead.status));
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const getStatusDisplayText = () => {
    const statusItem = leadStatusChange.find(item => item.value === selectedStatus);
    return statusItem ? statusItem.label : lead.status;
  };

  return (
    <View style={styles.leadCard}>
      {/* Main Content Container */}
      <View style={styles.mainContainer}>
        {/* Left side - Date and Lead Info */}
        <View style={styles.leftContent}>
          <Text style={styles.infoLabel}>
            Date: <Text style={styles.infoValue}>{lead.date}</Text>
          </Text>
          <Text style={styles.infoLabel}>
            Name: <Text style={styles.infoValue}>{lead.name}</Text>
          </Text>
          <Text style={styles.infoLabel}>
            Number: <Text style={styles.infoValue}>{lead.number}</Text>
          </Text>
          <Text style={styles.infoLabel}>
            Project: <Text style={styles.infoValue}>{lead.project}</Text>
          </Text>
          <Text style={styles.infoLabel}>
            Developer: <Text style={styles.infoValue}>{lead.developer}</Text>
          </Text>
        </View>
        
        {/* Right side - Status and Action Buttons */}
        <View style={styles.rightContent}>
          <View style={styles.statusContainer}>
            <Dropdown
              style={styles.statusDropdown}
              placeholderStyle={styles.statusText}
              selectedTextStyle={styles.statusText}
              data={leadStatusChange}
              maxHeight={200}
              labelField="label"
              valueField="value"
              placeholder={getStatusDisplayText()}
              value={selectedStatus}
              onChange={handleStatusChange}
              renderRightIcon={() => (
                <Text style={styles.dropdownArrow}>▼</Text>
              )}
              itemTextStyle={styles.dropdownItemText}
              containerStyle={styles.dropdownContainer}
              showsVerticalScrollIndicator={false}
            />
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.noteButton} 
              onPress={() => onAddNote && onAddNote(lead)}
            >
              <PenIcon />
              <Text style={styles.noteButtonText}>Add Note</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.callButton} 
              onPress={() => onCall && onCall(lead)}
            >
              <CallIcon />
              <Text style={styles.callButtonText}>Call</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  leadCard: {
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
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  leftContent: {
    flex: 1,
    marginRight: 16,
  },
  rightContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  statusContainer: {
    backgroundColor: '#000',
    borderRadius: 5,
    height: 40,
    width: 125,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  statusDropdown: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontFamily: fonts.PoppinsMedium,
    textAlign: 'center',
  },
  dropdownArrow: {
    fontSize: 8,
    color: '#fff',
    marginLeft: 4,
  },
  dropdownContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 5,
  },
  dropdownItemText: {
    fontSize: 12,
    fontFamily: fonts.PoppinsRegular,
    color: '#333',
  },
  statusBadge: {
    backgroundColor: '#000',
    borderRadius: 5,
    height: 40,
    width: 125,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 13,
    color: '#000',
    marginBottom: 8,
    fontFamily: fonts.PoppinsBold,
  },
  infoValue: {
    color: '#666',
    fontFamily: fonts.PoppinsRegular,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  noteButton: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    height: 60,
    width: 60,
    borderRadius: 6,
    justifyContent: 'center',
  },
  noteButtonText: {
    marginLeft: 4,
    fontSize: 10,
    color: '#666',
    fontFamily: fonts.PoppinsRegular,
  },
  callButton: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    height: 60,
    borderRadius: 6,
    width: 60,
    justifyContent: 'center',
  },
  callButtonText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
    fontFamily: fonts.PoppinsRegular,
  },
});

export default LeadCard;
