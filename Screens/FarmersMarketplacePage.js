import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot, getFirestore, doc, updateDoc, getDocs, getDoc } from 'firebase/firestore';
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

    const fetchOrderedProducts = async () => {
        try {
            const ordersRef = collection(firestore, 'orders');
            const productsRef = collection(firestore, 'production');
            const usersRef = collection(firestore, 'users'); // Assuming customer details are stored in 'users'

            // Fetch all orders
            const ordersSnapshot = await getDocs(ordersRef);
            const orderedProductIds = new Set();
            const ordersData = [];

            ordersSnapshot.forEach((doc) => {
                const order = doc.data();
                if (order.productId) {
                    orderedProductIds.add(order.productId);
                    ordersData.push({ id: doc.id, ...order });
                }
            });

            // Fetch products that match the ordered product IDs
            const productsSnapshot = await getDocs(productsRef);
            const orderedProducts = productsSnapshot.docs
                .filter((doc) => orderedProductIds.has(doc.id))
                .map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

            // Fetch customer details for each order
            const customerDetails = {};
            for (const order of ordersData) {
                if (order.customerId && !customerDetails[order.customerId]) {
                    const customerDoc = await getDoc(doc(usersRef, order.customerId));
                    if (customerDoc.exists()) {
                        customerDetails[order.customerId] = customerDoc.data();
                    }
                }
            }

            // Combine orders, products, and customer details
            const combinedData = orderedProducts.map((product) => {
                const productOrders = ordersData.filter((order) => order.productId === product.id);
                const totalOrderedQuantity = productOrders.reduce((sum, order) => sum + order.quantity, 0);

                const customerInfo = productOrders.map((order) => {
                    const customer = customerDetails[order.customerId];
                    return {
                        customerName: customer?.username || 'Unknown',
                        customerPhone: customer?.phone || 'N/A',
                        customerAddress: customer?.address || 'N/A',
                        orderedQuantity: order.quantity,
                    };
                });

                return {
                    ...product,
                    totalOrderedQuantity,
                    customerInfo,
                };
            });

            setProducts(combinedData);
        } catch (error) {
            console.error("Error fetching ordered products:", error);
            Alert.alert("Error", "Failed to fetch ordered products.");
        } finally {
            setLoading(false);
        }
    };

    fetchOrderedProducts();
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
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('ProductDetails', { product: item })}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.productName}>{item.productName || 'Unnamed Product'}</Text>
                <MaterialIcons name="agriculture" size={24} color="#ffffff" />
              </View>
              <Text style={styles.productInfo}>💰 Price: ₹{item.price || 'N/A'}</Text>
              <Text style={styles.productInfo}>📦 Quantity Available: {item.quantity || 0} kg</Text>
              <Text style={styles.orderedQuantity}>🛒 Total Ordered: {item.totalOrderedQuantity || 0} kg</Text>
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
          )}
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