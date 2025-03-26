import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput, ActivityIndicator 
} from 'react-native';
import { 
  collection, 
  getDocs, 
  addDoc, 
  getFirestore, 
  doc as firestoreDoc, 
  updateDoc, 
  getDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from './firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

const firestore = getFirestore(app);

const CustomerMarketplacePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState({});
  const [purchasedProducts, setPurchasedProducts] = useState({});
  
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(firestore, 'production');
        const productSnapshot = await getDocs(productsCollection);
        const productList = await Promise.all(
          productSnapshot.docs.map(async (productDoc) => {
            const productData = productDoc.data();
            let farmerUsername = 'Unknown';

            if (productData.farmerId) {
              try {
                const farmerDocRef = firestoreDoc(firestore, 'farmers', productData.farmerId);
                const farmerDocSnap = await getDoc(farmerDocRef);

                if (farmerDocSnap.exists()) {
                  farmerUsername = farmerDocSnap.data().username || 'Unknown';
                }
              } catch (error) {
                console.error(`Error fetching farmer username for ID ${productData.farmerId}:`, error);
              }
            }

            return {
              id: productDoc.id,
              ...productData,
              farmerUsername, 
            };
          })
        );

        setProducts(productList);
      } catch (error) {
        console.error('Error fetching products:', error);
        Alert.alert('Error', `Failed to fetch products: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchPurchasedProducts = async () => {
      if (!user) return;

      const ordersQuery = query(collection(firestore, 'orders'), where('customerId', '==', user.uid));
      const ordersSnapshot = await getDocs(ordersQuery);
      const purchasedMap = {};

      ordersSnapshot.forEach((doc) => {
        const data = doc.data();
        purchasedMap[data.productId] = {
          quantity: data.quantity,
          orderDate: data.timestamp?.toDate().toLocaleString() || 'Unknown',
        };
      });

      setPurchasedProducts(purchasedMap);
    };

    fetchPurchasedProducts();
  }, [user]);

  const handleBuy = async (product) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to buy products.');
      return;
    }

    if (purchasedProducts[product.id]) {
      Alert.alert('Notice', 'You have already purchased this product.');
      return;
    }

    const selectedQuantity = parseInt(quantity[product.id]) || 1;

    if (selectedQuantity > product.quantity) {
      Alert.alert('Error', 'Not enough stock available.');
      return;
    }

    const orderTimestamp = new Date();
    const updatedQuantity = product.quantity - selectedQuantity;

    try {
      await addDoc(collection(firestore, 'orders'), {
        productId: product.id,
        productName: product.productName,
        price: product.price,
        quantity: selectedQuantity,
        farmerId: product.farmerId,
        farmerUsername: product.farmerUsername,
        customerId: user.uid,
        customerName: user.displayName || 'Anonymous',
        status: 'Placed',
        timestamp: orderTimestamp,
      });

      const productRef = firestoreDoc(firestore, 'production', product.id);
      await updateDoc(productRef, {
        quantity: updatedQuantity,
        status: updatedQuantity === 0 ? 'Out of Stock' : 'Available',
      });

      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === product.id ? { ...p, quantity: updatedQuantity } : p
        )
      );

      setPurchasedProducts((prevMap) => ({
        ...prevMap, 
        [product.id]: { quantity: selectedQuantity, orderDate: orderTimestamp.toLocaleString() }
      }));

      Alert.alert('Success', 'Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place order.');
    }
  };

  return (
    <LinearGradient colors={['#E3F2FD', '#BBDEFB']} style={styles.container}>
      <Text style={styles.header}>🛒 Customer Marketplace</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0277BD" />
      ) : products.length === 0 ? (
        <Text style={styles.noProducts}>No products available</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.productCard} activeOpacity={0.9}>
              <LinearGradient colors={['#ffffff', '#E3F2FD']} style={styles.cardContent}>
                <Text style={styles.productName}><FontAwesome5 name="box" size={18} color="#0288D1" /> {item.productName}</Text>
                <Text style={styles.details}><MaterialIcons name="attach-money" size={16} color="#01579B" /> Price: ₹{item.price} per kg</Text>
                <Text style={styles.details}><FontAwesome5 name="weight" size={16} color="#01579B" /> Available: {item.quantity} kg</Text>
                <Text style={styles.details}><FontAwesome5 name="user" size={16} color="#0D47A1" /> Farmer: {item.farmerUsername}</Text>

                {purchasedProducts[item.id] ? (
                  <>
                    <Text style={styles.orderedQuantity}>✅ Ordered: {purchasedProducts[item.id].quantity} kg</Text>
                    <Text style={styles.orderDate}>📅 Date: {purchasedProducts[item.id].orderDate}</Text>
                  </>
                ) : (
                  <>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter quantity (kg)"
                      keyboardType="numeric"
                      value={quantity[item.id] || ''}
                      onChangeText={(text) => setQuantity({ ...quantity, [item.id]: text })}
                    />
                    <TouchableOpacity style={styles.buyButton} onPress={() => handleBuy(item)}>
                      <Text style={styles.buttonText}>Buy</Text>
                    </TouchableOpacity>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          )}
        />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#0277BD', textTransform: 'uppercase' },
  noProducts: { textAlign: 'center', fontSize: 18, color: '#777' },
  productCard: { borderRadius: 16, marginBottom: 15, elevation: 6 },
  cardContent: { padding: 20, borderRadius: 16 },
  productName: { fontSize: 18, fontWeight: 'bold', color: '#01579B' },
  details: { fontSize: 16, color: '#0288D1', marginTop: 5 },
  orderedQuantity: { fontSize: 16, color: '#28A745', fontWeight: 'bold', marginTop: 5 },
  orderDate: { fontSize: 14, color: '#666', marginTop: 3 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginTop: 8 },
  buyButton: { backgroundColor: '#0288D1', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default CustomerMarketplacePage;
