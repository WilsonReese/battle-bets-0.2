import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { API_BASE_URL } from '../../../utils/api';

export default function Profile() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Get the token from secure storage
      const token = await SecureStore.getItemAsync('jwt_token');

      if (token) {
        // Make the API request to log out
        const response = await fetch(`${API_BASE_URL}/logout`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          // If logout is successful, clear the token from SecureStore
          await SecureStore.deleteItemAsync('jwt_token');
          Alert.alert('Logged out successfully!');
          
          // Redirect to the login screen
          router.replace('/login');
        } else {
          Alert.alert('Logout failed. Please try again.');
        }
      } else {
        Alert.alert('No token found. You are already logged out.');
      }
    } catch (error) {
      console.error('Logout error:', error.message);
      Alert.alert('An error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Profile Screen</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
});