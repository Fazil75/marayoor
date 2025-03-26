import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const UserSelectionScreen = ({ navigation }) => {
  return (
    <LinearGradient colors={['#8EC5FC', '#E0C3FC']} style={styles.container}>
      <View style={styles.card}>
        <MaterialIcons name="people" size={50} color="#007BFF" style={styles.icon} />
        <Text style={styles.title}>Welcome to Marayoor Jaggery</Text>
        <Text style={styles.subtitle}>Select your role to continue</Text>

        {/* Farmer Selection */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('Login')} // Navigate to Farmer Login
        >
          <Text style={styles.buttonText}>Farmer</Text>
        </TouchableOpacity>

        {/* Customer Selection */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('CustomerLogin')} // Navigate to Customer Login
        >
          <Text style={styles.buttonText}>Customer</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UserSelectionScreen;
