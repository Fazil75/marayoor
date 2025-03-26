import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../Screens/firebaseConfig';

export default function SignUpScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [address, setAddress] = useState('');
  const [experience, setExperience] = useState(''); // New field for farming experience
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    // Form validation
    if (!username || !email || !phone || !aadhar || !address || !experience || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!/^[0-9]+$/.test(experience) || parseInt(experience) < 0) {
      Alert.alert('Error', 'Enter a valid number of years of experience');
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      Alert.alert('Error', 'Enter a valid 10-digit phone number');
      return;
    }

    if (!/^\d{12}$/.test(aadhar)) {
      Alert.alert('Error', 'Enter a valid 12-digit Aadhar number');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      // Register user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user details in Firestore under "farmers" collection
      await setDoc(doc(db, 'farmers', user.uid), {
        uid: user.uid,
        username,
        email,
        phone,
        aadhar,
        address,
        experience, // Storing farming experience
        userType: 'farmer',
        createdAt: new Date(),
      });

      Alert.alert('Success', 'Sign-up successful!');
      navigation.navigate('Login');
    } catch (error) {
      console.error("Error signing up: ", error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Farmer Account</Text>

      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Aadhar Number" value={aadhar} onChangeText={setAadhar} keyboardType="numeric" maxLength={12} />
      <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
      <TextInput style={styles.input} placeholder="Years of Farming Experience" value={experience} onChangeText={setExperience} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Password (min: 6)" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpButtonText}>Sign Up</Text>
      </TouchableOpacity>

      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center', padding: 20, paddingTop: 50 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#007BFF', textAlign: 'center' },
  input: { width: '100%', height: 50, borderRadius: 12, backgroundColor: 'rgba(255, 255, 255, 0.8)', borderColor: '#007BFF', borderWidth: 2, paddingLeft: 15, marginBottom: 15, fontSize: 16 },
  signUpButton: { width: '100%', backgroundColor: '#007BFF', paddingVertical: 15, borderRadius: 30, marginBottom: 20, alignItems: 'center', justifyContent: 'center' },
  signUpButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  bottomContainer: { marginTop: 20 },
  linkText: { color: '#007BFF', fontSize: 14, textDecorationLine: 'underline' },
});
