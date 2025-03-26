import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot, getFirestore, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseApp } from './firebaseConfig';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const firestore = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

const FarmersMarketplace = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderedQuantities, setOrderedQuantities] = useState({});

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Access Denied", "You must be logged in to view this page.");
      setLoading(false);
      return;
    }

    const productsRef = collection(firestore, 'production');
    const ordersRef = collection(firestore, 'orders');

    const unsubscribeProducts = onSnapshot(productsRef, (snapshot) => {
      const productList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
    });

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

  const updateOrderStatus = async (productId) => {
    try {
      const productRef = doc(firestore, 'production', productId);
      await updateDoc(productRef, { status: 'Delivery Approved' });
      Alert.alert("Success", "Order status updated to Delivery Approved");
    } catch (error) {
      Alert.alert("Error", "Failed to update status");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.container}>
      <Text style={styles.header}>🌾 Farmers Marketplace</Text>

      {/* Navigation Buttons */}
      <View style={styles.navContainer}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('FarmersFeedbackPortal')}>
          <Text style={styles.navText}>💬 Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('FarmersProductsPage')}>
          <Text style={styles.navText}>📦 My Products</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('FarmersProductSellingScreen')}>
          <Text style={styles.navText}>🛒 Selling product</Text>
        </TouchableOpacity>
      </View>

      {products.length === 0 ? (
        <Text style={styles.noDataText}>No products available.</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const availableQuantity = (item.quantity || 0) - (orderedQuantities[item.id] || 0);
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('ProductDetails', { product: item })}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.productName}>{item.productName || 'Unnamed Product'}</Text>
                  <MaterialIcons name="agriculture" size={24} color="#ffffff" />
                </View>
                <Text style={styles.productInfo}>💰 Price: ₹{item.price || 'N/A'}</Text>
                <Text style={styles.productInfo}>📦 Quantity Available: {availableQuantity} kg</Text>
                <Text style={styles.orderedQuantity}>
                  🛒 Ordered: {orderedQuantities[item.id] || 0} kg
                </Text>
                <TouchableOpacity
                  style={[
                    styles.statusBadge,
                    { backgroundColor: item.status === 'Delivery Approved' ? '#28a745' : '#dc3545' },
                  ]}
                  onPress={() => updateOrderStatus(item.id)}
                >
                  <Text style={styles.statusText}>{item.status || 'Pending Confirmation'}</Text>
                </TouchableOpacity>
              </TouchableOpacity>
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
  loadingText: { marginTop: 10, fontSize: 16, color: '#ffffff' },

  header: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 20, 
    color: '#ffffff', 
    textShadowColor: 'rgba(0, 0, 0, 0.3)', 
    textShadowOffset: { width: 1, height: 1 }, 
    textShadowRadius: 5 
  },
  
  noDataText: { fontSize: 18, textAlign: 'center', color: '#ffffff' },

  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  navButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  navText: { color: '#2575fc', fontSize: 14, fontWeight: 'bold' },

  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 8,
  },
  productName: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  productInfo: { fontSize: 16, color: '#555', marginTop: 5 },
  orderedQuantity: { fontSize: 16, color: '#FF5733', marginTop: 5 },

  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  statusText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
});

export default FarmersMarketplace;