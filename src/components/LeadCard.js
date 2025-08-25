import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import CallIcon from '../assets/svg/svgicons/Home/CallIcon';
import PenIcon from '../assets/svg/svgicons/Home/PenIcon';
import { fonts } from '../../styles/fonts';

const LeadCard = ({ lead, onCall, onAddNote }) => {
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
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {lead.status}
            </Text>
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
  statusBadge: {
    backgroundColor: '#000',
    borderRadius: 5,
    height: 40,
    width: 125,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontFamily: fonts.PoppinsMedium,
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
