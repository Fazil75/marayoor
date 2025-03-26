import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc, setDoc, updateDoc, getFirestore } from 'firebase/firestore';
import { firebaseApp } from './firebaseConfig';

const firestore = getFirestore(firebaseApp);

const ProductDetails = ({ route }) => {
  const { product, customer = {} } = route.params;
  const navigation = useNavigation();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [customerDetails, setCustomerDetails] = useState(null);

  useEffect(() => {
    if (!customer.id || !product.id) return;

    const fetchOrderStatus = async () => {
      try {
        const orderRef = doc(firestore, 'notifications', `${customer.id}_${product.id}`);
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
          const orderData = orderSnap.data();
          setIsConfirmed(orderData.confirmed || false);
        } else {
          setIsConfirmed(false);
        }

        const customerRef = doc(firestore, 'customers', customer.id);
        const customerSnap = await getDoc(customerRef);

        if (customerSnap.exists()) {
          setCustomerDetails(customerSnap.data());
        }
      } catch (error) {
        console.error('Error fetching order status:', error);
      }
    };

    fetchOrderStatus();
  }, [customer.id, product.id]);

  const handleConfirmOrder = async () => {
    if (isConfirmed) return; // Prevent duplicate confirmation

    try {
      const orderRef = doc(firestore, 'notifications', `${customer.id}_${product.id}`);
      const productRef = doc(firestore, 'production', product.id);
      const confirmationDate = new Date();

      await setDoc(orderRef, {
        confirmed: true,
        confirmedAt: confirmationDate,
        message: `Your order for ${product.productName} has been confirmed. It will be delivered within 4 days.`,
        timestamp: confirmationDate,
        status: 'Order Confirmed',
      }, { merge: true });

      await updateDoc(productRef, { status: 'Delivery Approved' });

      setIsConfirmed(true);
      Alert.alert('Order Confirmed', 'The order has been confirmed and approved for delivery.');
    } catch (error) {
      console.error('Error confirming order:', error);
      Alert.alert('Error', 'Failed to confirm the order. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.productName}>{product.productName || 'Unnamed Product'}</Text>
      <Text style={styles.productPrice}>💰 Price: ₹{product.price || 'N/A'}</Text>
      <Text style={styles.productQuantity}>📦 Ordered Quantity: {product.quantity || 'N/A'}</Text>
      <Text style={[styles.productStatus, { color: isConfirmed ? 'green' : 'orange' }]}>
        📌 Status: {isConfirmed ? '✅ Order Confirmed' : '⏳ Pending Confirmation'}
      </Text>
      
      <View style={styles.customerInfo}>
        <Text style={styles.customerTitle}>🛒 Customer Details:</Text>
        <Text style={styles.customerDetail}>👤 Name: {customerDetails?.username || 'Not Available'}</Text>
        <Text style={styles.customerDetail}>📞 Phone: {customerDetails?.phoneNumber || 'Not Available'}</Text>
        <Text style={styles.customerDetail}>📍 Address: {customerDetails?.address || 'Not Available'}</Text>
      </View>
      
      <TouchableOpacity
        style={[styles.confirmButton, isConfirmed && styles.confirmedButton]}
        onPress={handleConfirmOrder}
        disabled={isConfirmed}
      >
        <Text style={styles.confirmButtonText}>
          {isConfirmed ? '✅ Order Confirmed' : 'Confirm Order'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>⬅ Back to Marketplace</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F5F5', alignItems: 'center' },
  productName: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 10, textAlign: 'center' },
  productPrice: { fontSize: 18, color: '#007BFF', marginBottom: 5 },
  productQuantity: { fontSize: 16, color: '#555', marginBottom: 5 },
  productStatus: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  customerInfo: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, width: '100%' },
  customerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  customerDetail: { fontSize: 16, color: '#555' },
  confirmButton: { backgroundColor: '#28A745', padding: 12, borderRadius: 8, width: '80%', alignItems: 'center', marginBottom: 10 },
  confirmedButton: { backgroundColor: 'gray' },
  confirmButtonText: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  backButton: { backgroundColor: '#007BFF', padding: 10, borderRadius: 8, width: '80%', alignItems: 'center' },
  backButtonText: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
});

export default ProductDetails;
