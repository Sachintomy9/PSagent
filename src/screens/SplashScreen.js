import { View, Text, StyleSheet, StatusBar } from 'react-native';
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { fonts } from '../../styles/fonts'
const SplashScreen = () => {
return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Text style={styles.title}>AGENT</Text>
    </View>
  );
}

export default SplashScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Pure black background
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 60, // Large bold text
    color: '#fff', // White text
    fontWeight: '900',
    letterSpacing: 2,
  },
});