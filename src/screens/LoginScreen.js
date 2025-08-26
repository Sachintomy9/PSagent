import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import UserIcon from '../assets/svg/svgicons/Login/UserIcon';
import LockIcon from '../assets/svg/svgicons/Login/LockIcon';
import HidePassIcon from '../assets/svg/svgicons/Login/HidePassIcon';
import ShowPassIcon from '../assets/svg/svgicons/Login/ShowPassIcon';
import InvalidInput from '../components/popups/InvalidInput';

import { login } from '../services/AuthService';
import { useDispatch } from 'react-redux';
import { loginUser } from '../redux/slices/AuthSlice';
import { fonts } from '../../styles/fonts';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [errors, setErrors] = useState({});
  const [showInvalid, setShowInvalid] = useState(false);

  const validateInputs = () => {
    const newErrors = {};
    if (!username) {
      newErrors.username = 'Username is required';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (validateInputs()) {
       setIsLoading(true); // show loader
      try {
      const { success, error, user } = await login(username, password);
      if (success) {
        console.log('Login success in LoginScreen');
        // Pass user data to loginUser action
        dispatch(loginUser({ user }));
      } 
      if(error){
        setShowInvalid(true);
      }
    } catch (error) {
          console.error('Login Failed:', error.response?.data || error.message);
          setShowInvalid(true);
        }
        finally {
      setIsLoading(false); // hide loader regardless of success or failure
    }
    }
  };
  

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      )}

      <InvalidInput 
       visible={showInvalid}
       onClose={() => setShowInvalid(false)}
       heading={"Invalid Credentials"}
       subheading={"Username or Password is Incorrect"}
       />


      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Please Log in to Continue</Text>

      <View style={styles.inputContainer}>
        <UserIcon name="user" size={23} color="#999" style={styles.icon} />
        <TextInput
          placeholder="Username"
          style={styles.input}
          autoCapitalize='none'
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      {errors.username && <Text style={styles.error}>{errors.username}</Text>}

      <View style={styles.inputContainer}>
        <LockIcon name="lock" size={25} color="#999" style={styles.icon} />
        <TextInput
          placeholder="Password"
          secureTextEntry={isPasswordHidden}
          autoCapitalize='none'
          style={styles.input}
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setIsPasswordHidden(!isPasswordHidden)}>
            {isPasswordHidden ? <ShowPassIcon /> : <HidePassIcon />}
          </TouchableOpacity>
      </View>

      {errors.password && <Text style={styles.error}>{errors.password}</Text>}


      <View style={styles.signupText}>
        <Text style={{ color: '#999' }}>Don't Have An Account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={{ color: '#000' , fontFamily: fonts.PoppinsSemiBold,}}>Signup</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontFamily: fonts.PoppinsRegular,
    color: '#666',
    alignSelf: 'center',
    marginBottom: 80,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.7,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 50,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  signupText: {
    flexDirection: 'row',
    justifyContent: "flex-start",
    marginBottom: 50,
    fontFamily: fonts.PoppinsRegular,
  },
  loginButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontFamily:fonts.PoppinsMedium,
    fontSize: 16,
  },
    error: { 
    color: 'red',
    fontSize: 12,
    position: "relative",
    bottom: 10,
  },
  loadingOverlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: 'rgba(255,255,255,0.7)',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 10,
},
});
