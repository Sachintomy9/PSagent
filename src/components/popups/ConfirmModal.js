import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { fonts } from '../../../styles/fonts';

const InvalidInput = ({ visible, onClose, heading, subheading, onYes }) => {
  
  // Function to render formatted text with bold name and number
  const renderFormattedText = (text) => {
    if (!text) return null;
    
    // Check if this is a call confirmation message
    const callMatch = text.match(/Are you sure you want to call (.+) on (.+)\?/);
    
    if (callMatch) {
      const [, name, number] = callMatch;
      return (
        <Text style={styles.subtitle}>
          Are you sure you want to call{' '}
          <Text style={styles.boldText}>{name}</Text>
          {' '}on{' '}
          <Text style={styles.boldText}>{number}</Text>
          ?
        </Text>
      );
    }
    
    // For other messages, return as normal text
    return <Text style={styles.subtitle}>{text}</Text>;
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Content */}
          <Text style={styles.title}>{heading}</Text>
          {renderFormattedText(subheading)}

          {/* Yes/No Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.noButton]} onPress={onClose}>
              <Text style={[styles.buttonText, styles.noButtonText]}>No</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.button, styles.yesButton]} onPress={onYes}>
              <Text style={[styles.buttonText, styles.yesButtonText]}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default InvalidInput;
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', // dim background
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: fonts.PoppinsMedium
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: fonts.PoppinsRegular
  },
  boldText: {
    fontFamily: fonts.PoppinsSemiBold,
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  noButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  yesButton: {
    backgroundColor: '#000',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: fonts.PoppinsMedium
  },
  noButtonText: {
    color: '#666',
  },
  yesButtonText: {
    color: '#fff',
  },
});
