import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { collection, query, where, onSnapshot, getFirestore } from 'firebase/firestore';
import { firebaseApp } from './firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';

const firestore = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

const FarmersProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [orderedQuantities, setOrderedQuantities] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Access Denied", "You must be logged in to view this page.");
      setLoading(false);
      return;
    }

    const productsRef = collection(firestore, 'production');
    const ordersRef = collection(firestore, 'orders');

    const q = query(productsRef, where("farmerId", "==", user.uid));

    // Fetch products
    const unsubscribeProducts = onSnapshot(q, (snapshot) => {
      const productList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
    });

    // Fetch orders and calculate total ordered quantities per product
    const unsubscribeOrders = onSnapshot(ordersRef, (snapshot) => {
      const orderData = {};
      snapshot.docs.forEach((doc) => {
        const order = doc.data();
        if (order.productId) {
          if (!orderData[order.productId]) {
            orderData[order.productId] = 0;
          }
          orderData[order.productId] += order.quantity;
        }
      });
      setOrderedQuantities(orderData);
      setLoading(false);
    });

    return () => {
      unsubscribeProducts();
      unsubscribeOrders();
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Loading your products...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#e0f7fa', '#ffffff']} style={styles.container}>
      <Text style={styles.header}>📦 Your Added Products</Text>

      {products.length === 0 ? (
        <Text style={styles.noDataText}>You haven't added any products yet.</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const orderedQuantity = orderedQuantities[item.id] || 0;
            const availableQuantity = (item.quantity || 0) - orderedQuantity;

            return (
              <View style={styles.card}>
                <Text style={styles.productName}>{item.productName || 'Unnamed Product'}</Text>
                <Text style={styles.productInfo}>💰 Price: ₹{item.price || 'N/A'}</Text>
                <Text style={styles.productInfo}>📦 Initial Quantity: {item.quantity || 'N/A'} kg</Text>
                <Text style={styles.orderedQuantity}>🛒 Ordered: {orderedQuantity} kg</Text>
                <Text style={styles.availableQuantity}>✅ Available: {availableQuantity > 0 ? availableQuantity : 0} kg</Text>
              </View>
            );
          }}
        />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#555' },
  header: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#007BFF' },
  noDataText: { fontSize: 18, textAlign: 'center', color: '#555' },
  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    borderLeftWidth: 6,
    borderLeftColor: '#007BFF',
  },
  productName: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  productInfo: { fontSize: 16, color: '#555', marginTop: 5 },
  orderedQuantity: { fontSize: 16, color: '#FF5733', marginTop: 5, fontWeight: 'bold' },
  availableQuantity: { fontSize: 16, color: '#28a745', marginTop: 5, fontWeight: 'bold' },
});

export default FarmersProductsPage;
