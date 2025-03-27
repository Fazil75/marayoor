import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, ScrollView } from 'react-native';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, getFirestore, serverTimestamp } from 'firebase/firestore';
import { app } from './firebaseConfig';
import { FontAwesome } from '@expo/vector-icons'; // Icons for better UI
import { LinearGradient } from 'expo-linear-gradient'; // Gradient background

const firestore = getFirestore(app);

const FarmersProductSellingScreen = ({ navigation }) => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddProduct = async () => {
    if (!productName.trim() || !price.trim() || !quantity.trim()) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
    }

    if (isNaN(price) || isNaN(quantity) || parseFloat(price) <= 0 || parseInt(quantity) <= 0) {
        Alert.alert('Error', 'Price and quantity must be valid numbers');
        return;
    }

    setLoading(true);

    try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            Alert.alert('Error', 'You must be logged in to sell products');
            setLoading(false);
            return;
        }

        const farmerId = user.uid;

        const productData = {
            productName: productName.trim(),
            price: parseFloat(price),
            quantity: parseInt(quantity),
            farmerId,
            timestamp: serverTimestamp(),
        };

        // ✅ Store product in the `production` collection
        const productCollectionRef = collection(firestore, 'production');
        await addDoc(productCollectionRef, productData);

        Alert.alert('Success', 'Product added successfully!', [
            { text: 'OK', onPress: () => navigation.navigate('MyHomePage') },
        ]);

        // Reset input fields
        setProductName('');
        setPrice('');
        setQuantity('');
    } catch (error) {
        console.error('Error adding product:', error);
        Alert.alert('Error', `Failed to add product: ${error.message}`);
    }

    setLoading(false);
  };

  return (
    <LinearGradient colors={['#E3F2FD', '#BBDEFB']} style={styles.gradient}>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Sell Jaggery Products</Text>

          <View style={styles.inputContainer}>
            <FontAwesome name="shopping-basket" size={20} color="#007BFF" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Product Name"
              value={productName}
              onChangeText={setProductName}
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesome name="rupee" size={20} color="#007BFF" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Price (₹)"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesome name="balance-scale" size={20} color="#007BFF" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Quantity (kg)"
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
            />
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#007BFF" style={styles.loading} />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
              <Text style={styles.buttonText}>Add Product</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  scrollContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#007BFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: { marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    marginTop: 15,
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loading: {
    marginTop: 20,
  },
});

export default FarmersProductSellingScreen;
