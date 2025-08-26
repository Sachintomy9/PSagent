import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import CloseIcon from '../../assets/svg/svgicons/others/CloseIcon';
import { fonts } from '../../../styles/fonts';
import InvalidInput from './InvalidInput';

const AddNoteModal = ({ visible, onClose, lead, onSave }) => {
  const [note, setNote] = useState('');
  const [showInvalid, setShowInvalid] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!note.trim()) {
        setShowInvalid(true);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(lead, note.trim());
      setNote('');
      onClose();
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setNote('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
        <InvalidInput 
       visible={showInvalid}
       onClose={() => setShowInvalid(false)}
       heading={"Empty Note"}
       subheading={"Please enter a note before saving."}
       />
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Add Note</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <CloseIcon />
            </TouchableOpacity>
          </View>

          {/* Text Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Type Here"
              placeholderTextColor="#999"
              value={note}
              onChangeText={setNote}
              multiline={true}
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.PoppinsSemiBold,
    color: '#000',
  },
  closeButton: {
    padding: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: fonts.PoppinsRegular,
    color: '#000',
    minHeight: 120,
    maxHeight: 200,
  },
  saveButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: fonts.PoppinsMedium,
  },
});

export default AddNoteModal;
