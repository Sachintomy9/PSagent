import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown'; 
import ShowPassIcon from '../assets/svg/svgicons/Login/ShowPassIcon';
import HidePassIcon from '../assets/svg/svgicons/Login/HidePassIcon';
import InvalidInput from '../components/popups/InvalidInput';
import { fonts } from '../../styles/fonts';
import axios from 'axios';

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');

  // Countries dropdown
  const [nationality, setNationality] = useState(null);
  const [countries, setCountries] = useState([]);
  const [countriesLoading, setCountriesLoading] = useState(true);

  // Languages dropdown
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [languagesLoading, setLanguagesLoading] = useState(true);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [isConfirmPasswordHidden, setIsConfirmPasswordHidden] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({});
  
  // InvalidInput modal state
  const [showInvalidInput, setShowInvalidInput] = useState(false);
  const [invalidInputData, setInvalidInputData] = useState({
    heading: '',
    subheading: ''
  });

  const [isSuccess, setIsSuccess] = useState(false);

  // Fetch countries from API
  const fetchCountries = async () => {
    try {
      setCountriesLoading(true);
      const response = await fetch('https://v1-api.propertyseller.com/api/v1/countries/names');
      const result = await response.json();
      
      if (result.success) {
        const formattedCountries = result.data.map(country => ({
          label: country.name,
          value: country._id
        }));
        setCountries(formattedCountries);
      } else {
        Alert.alert('Error', 'Failed to load countries');
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
      Alert.alert('Error', 'Failed to load countries');
    } finally {
      setCountriesLoading(false);
    }
  };

  // Fetch languages from API
  const fetchLanguages = async () => {
    try {
      setLanguagesLoading(true);
      const response = await fetch('https://v1-api.propertyseller.com/api/v1/languages/names');
      const result = await response.json();
      
      if (result.success) {
        const formattedLanguages = result.data.map(language => ({
          label: language.name,
          value: language._id
        }));
        setLanguages(formattedLanguages);
      } else {
        Alert.alert('Error', 'Failed to load languages');
      }
    } catch (error) {
      console.error('Error fetching languages:', error);
      Alert.alert('Error', 'Failed to load languages');
    } finally {
      setLanguagesLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchCountries();
    fetchLanguages();
  }, []);


  const validate = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      newErrors.name = 'Name can only contain alphabets';
    }
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (!/^[A-Za-z0-9_]+$/.test(username)) {
      newErrors.username = 'Username can only contain alphanumeric characters and underscores';
    }

    if (!/^\d{7,15}$/.test(mobile)) {
      newErrors.mobile = 'Phone number must be between 7 and 15 digits';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!validatePassword(password).isValid) {
      newErrors.password = 'Password does not meet all criteria';
    }

    if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!nationality) {
      newErrors.nationality = 'Nationality is required';
    }
    if (selectedLanguages.length === 0) {
      newErrors.selectedLanguages = 'At least one language must be selected';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle signup button press
  const handleSignup = async () => {
    console.log('Signup button pressed');
    if (validate()) {
      setIsLoading(true); // show loader
      try {
        console.log('Sending payload:', {
          password: password,
          username: username,
          countryId: nationality,
          email: email,
          languageId: selectedLanguages,
          name: name,
          number: mobile
        });

        const response = await axios.post(`https://v1-api.propertyseller.com/api/v1/agent/signup`, {
          password: password,
          username: username,
          countryId: nationality,
          email: email,
          languageId: selectedLanguages,
          name: name,
          number: mobile
        });
        
        setIsSuccess(true);
        console.log('Registration successful:', response.data);
        
      } catch (error) {
        console.error('Registration error:', error.response?.data || error.message);
        
        // Handle specific backend error messages
        if (error.response && error.response.data && error.response.data.message) {
          const errorMessage = error.response.data.message;
          
          if (errorMessage === 'Username is already in use') {
            setInvalidInputData({
              heading: 'Username Already Taken',
              subheading: 'This username is already in use. Please choose a different username and try again.'
            });
            setShowInvalidInput(true);
          } else if (errorMessage === 'Email is already in use') {
            setInvalidInputData({
              heading: 'Email Already Registered',
              subheading: 'This email is already registered. Please use a different email address or try logging in.'
            });
            setShowInvalidInput(true);
          } else {
            // For other backend errors, show alert
            Alert.alert('Error', errorMessage);
          }
        } else {
          Alert.alert('Error', 'An unexpected error occurred. Please try again.');
        }
      } finally {
        setIsLoading(false); // hide loader regardless of success or failure
      }
    } else {
      console.log('Validation failed', errors);
    }
  };

  const closeSuccessModal = () => {
    setIsSuccess(false);
    navigation.replace('Login');
  };

  // Get display text for selected languages
  const getSelectedLanguagesText = () => {
    if (selectedLanguages.length === 0) {
      return 'Select Speaking Languages';
    }
    
    const selectedNames = selectedLanguages.map(languageId => {
      const language = languages.find(lang => lang.value === languageId);
      return language ? language.label : '';
    }).filter(name => name !== '');
    
    return selectedNames.join(', ');
  };
  // Password validation rules
  const passwordCriteria = [
    {
      label: 'At least 8 characters',
      test: (pw) => pw.length >= 8,
    },
    {
      label: 'At least one uppercase letter',
      test: (pw) => /[A-Z]/.test(pw),
    },
    {
      label: 'At least one lowercase letter',
      test: (pw) => /[a-z]/.test(pw),
    },
    {
      label: 'At least one special character',
      test: (pw) => /[^A-Za-z0-9]/.test(pw),
    },
    {
      label: 'At least one digit',
      test: (pw) => /\d/.test(pw),
    },
  ];

  const validatePassword = (pw) => {
    const failed = passwordCriteria.filter((rule) => !rule.test(pw));
    return {
      isValid: failed.length === 0,
      failed,
    };
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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
      {errors.name && <Text style={styles.error}>{errors.name}</Text>}

      <TextInput
        placeholder="Username"
        style={styles.input}
        placeholderTextColor="#999"
        value={username}
        onChangeText={setUsername}
      />
      {errors.username && <Text style={styles.error}>{errors.username}</Text>}

      {/*PassWord*/}
      <View style={styles.passwordInputWrapper}>
            <TextInput
            style={{ flex: 1, color: '#000' }}
            autoCapitalize="none"
            placeholder="Enter your Password"
            placeholderTextColor="#999"
            secureTextEntry={isPasswordHidden}
            value={password}
            onChangeText={setPassword}
            />

            <TouchableOpacity
                onPress={() => setIsPasswordHidden(!isPasswordHidden)}
            >
                {isPasswordHidden ? (
                    <ShowPassIcon width={24} height={24} />
                ) : (
                    <HidePassIcon width={24} height={24} /> 
                )}
            </TouchableOpacity>
        </View>
        {errors.password && <Text style={styles.error}>{errors.password}</Text>}

        {/* Password Rule Indicator */}
        <View style={{marginBottom: 12, marginTop: 12}}>
          {passwordCriteria.map((rule, index) => {
            const passed = rule.test(password);
            return (
              <Text
                key={index}
                style={{
                  color: passed ? 'green' : 'red',
                  fontSize: 12,
                  marginTop: 2,
                }}>
                • {rule.label}
              </Text>
            );
          })}
        </View>
        {/*Confirm PassWord*/}
        <View style={styles.passwordInputWrapper}>
            <TextInput
            style={{ flex: 1, color: '#000' }}
            autoCapitalize="none"
            placeholder="Confirm your Password"
            placeholderTextColor="#999"
            secureTextEntry={isConfirmPasswordHidden}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
                onPress={() => setIsConfirmPasswordHidden(!isConfirmPasswordHidden)}
            >
                {isConfirmPasswordHidden ? (
                    <ShowPassIcon width={24} height={24} />
                ) : (
                    <HidePassIcon width={24} height={24} /> 
                )}
            </TouchableOpacity>
        </View>
        {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}

      {/* Countries Dropdown */}
      <View style={styles.dropdownContainer}>
        {countriesLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#000" />
            <Text style={styles.loadingText}>Loading countries...</Text>
          </View>
        ) : (
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={countries}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select Nationality"
            value={nationality}
            onChange={item => {
              setNationality(item.value);
            }}
            itemTextStyle={{ fontFamily: fonts.PoppinsRegular, fontSize: 14 }}
          />
        )}
      </View>
      {errors.nationality && <Text style={styles.error}>{errors.nationality}</Text>}

      {/* Languages Dropdown */}
      <View style={styles.dropdownContainer}>
        {languagesLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#000" />
            <Text style={styles.loadingText}>Loading languages...</Text>
          </View>
        ) : (
          <MultiSelect
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={languages}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={getSelectedLanguagesText()}
            value={selectedLanguages}
            onChange={item => {
              setSelectedLanguages(item);
            }}
            selectedStyle={styles.selectedStyle}
            itemTextStyle={{ fontFamily: fonts.PoppinsRegular, fontSize: 14 }}
          />
        )}
      </View>
      {errors.selectedLanguages && <Text style={styles.error}>{errors.selectedLanguages}</Text>}

      <TextInput
        placeholder="Email"
        style={styles.input}
        placeholderTextColor="#999"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      {errors.email && <Text style={styles.error}>{errors.email}</Text>}

      <TextInput
        placeholder="Mobile no"
        style={styles.input}
        placeholderTextColor="#999"
        keyboardType="phone-pad"
        value={mobile}
        onChangeText={setMobile}
      />
      {errors.mobile && <Text style={styles.error}>{errors.mobile}</Text>}

      <View style={styles.loginText}>
        <Text style={{ color: '#999' }}>Already Have An Account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={{ fontFamily: fonts.PoppinsSemiBold, color: '#000' }}>Login</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.signupButton, isLoading && styles.signupButtonDisabled]} 
        onPress={handleSignup}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.signupButtonText}>Signup</Text>
        )}
      </TouchableOpacity>
      </ScrollView>
      </KeyboardAvoidingView>

      {/* InvalidInput Modal */}
      <InvalidInput
        visible={showInvalidInput}
        onClose={() => setShowInvalidInput(false)}
        heading={invalidInputData.heading}
        subheading={invalidInputData.subheading}
      />

      <InvalidInput
        visible={isSuccess}
        onClose={closeSuccessModal}
        heading="Registration Successful"
        subheading="You have successfully registered. Please log in to continue."
      />

    </SafeAreaView>
  );
};

export default SignupScreen;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 24,
    paddingBottom: 40, // Extra padding at bottom for keyboard
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
    marginTop: 12,
    height: 50,
    fontSize: 14,
    color: '#000',
  },
  passwordInputWrapper: {
    borderWidth: 0.7,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12, // horizontal padding only
    height: 50,     
    marginTop: 12,
},
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 0.7,
    borderRadius: 6,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  dropdownContainer: {
    marginTop: 12,
  },
  placeholderStyle: {
    fontSize: 14,
    color: '#999',
    fontFamily: fonts.PoppinsRegular,
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#000',
    fontFamily: fonts.PoppinsRegular,
  },
  selectedStyle: {
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    marginRight: 5,
    marginBottom: 2,
  },
  loadingContainer: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 0.7,
    borderRadius: 6,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    fontFamily: fonts.PoppinsRegular,
  },
  loginText: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 22,
    marginTop: 10,
    fontFamily: fonts.PoppinsMedium,
  },
  signupButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  signupButtonDisabled: {
    backgroundColor: '#666',
  },
  signupButtonText: {
    color: '#fff',
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: 16,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 2 
  },
    
});
