import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { db } from '../Screens/firebaseConfig';

const CustomerSignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const auth = getAuth();

  const handleSignUp = async () => {
    if (!username || !email || !phone || !address || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      Alert.alert('Error', 'Enter a valid 10-digit phone number.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store customer data in Firestore
      await setDoc(doc(db, 'customers', user.uid), {
        uid: user.uid,
        username,
        email,
        phone,
        address,
        userType: 'customer',
        createdAt: new Date(),
      });

      Alert.alert('Success', 'Account created successfully! Please log in.');
      navigation.replace('CustomerLogin');
    } catch (error) {
      console.error('Error signing up:', error);
      Alert.alert('Sign Up Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Sign Up</Text>

      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('CustomerLogin')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  input: { width: '100%', padding: 12, borderWidth: 1, borderColor: '#007BFF', borderRadius: 10, marginBottom: 12, backgroundColor: '#FFF' },
  button: { backgroundColor: '#007BFF', paddingVertical: 14, borderRadius: 10, marginVertical: 10, width: '100%', alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  link: { color: '#007BFF', fontSize: 16, marginTop: 10 },
});

export default CustomerSignUpScreen;
