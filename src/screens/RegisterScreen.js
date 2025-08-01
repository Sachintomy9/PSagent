import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { fonts } from '../../styles/fonts';

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');

  // Nationality dropdown
  const [nationalityOpen, setNationalityOpen] = useState(false);
  const [nationality, setNationality] = useState(null);
  const [nationalityItems, setNationalityItems] = useState([
    { label: 'Indian', value: 'Indian' },
    { label: 'American', value: 'American' },
    { label: 'British', value: 'British' },
    // Add more as needed
  ]);

  // Languages dropdown
  const [languageOpen, setLanguageOpen] = useState(false);
  const [language, setLanguage] = useState(null);
  const [languageItems, setLanguageItems] = useState([
    { label: 'English', value: 'English' },
    { label: 'Hindi', value: 'Hindi' },
    { label: 'Arabic', value: 'Arabic' },
    // Add more as needed
  ]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <Text style={styles.title}>Signup</Text>
      <Text style={styles.subtitle}>Please Enter the details to create an account</Text>

      <TextInput
        placeholder="Name"
        style={styles.input}
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />

      <DropDownPicker
        open={nationalityOpen}
        setOpen={setNationalityOpen}
        value={nationality}
        setValue={setNationality}
        items={nationalityItems}
        setItems={setNationalityItems}
        placeholder="Nationality"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      />

      <DropDownPicker
        open={languageOpen}
        setOpen={setLanguageOpen}
        value={language}
        setValue={setLanguage}
        items={languageItems}
        setItems={setLanguageItems}
        placeholder="Speaking Languages"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      />

      <TextInput
        placeholder="Email"
        style={styles.input}
        placeholderTextColor="#999"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Mobile no"
        style={styles.input}
        placeholderTextColor="#999"
        keyboardType="phone-pad"
        value={mobile}
        onChangeText={setMobile}
      />

      <View style={styles.loginText}>
        <Text style={{ color: '#999' }}>Already Have An Account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={{ fontFamily: fonts.PoppinsSemiBold, color: '#000' }}>Login</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.signupButton}>
        <Text style={styles.signupButtonText}>Signup</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SignupScreen;
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.PoppinsSemiBold,
    alignSelf: 'center',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    fontFamily: fonts.PoppinsRegular,
    alignSelf: 'center',
    marginBottom: 45,
    textAlign: 'center',
  },
  input: {
    borderWidth: 0.7,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 50,
    fontSize: 14,
    color: '#000',
  },
  dropdown: {
    borderColor: '#ccc',
    borderRadius: 8,
    height: 50,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  dropdownContainer: {
    borderColor: '#ccc',
    borderRadius: 8,
    zIndex: 1000, // Fix overlap issues
  },
  loginText: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
    fontFamily: fonts.PoppinsMedium,
  },
  signupButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#fff',
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: 16,
  },
});
