import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity 
} from 'react-native';
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../Screens/firebaseConfig';
import { format } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const NotificationScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      setError("User not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    const notificationsQuery = collection(db, 'notifications');

    const unsubscribeSnapshot = onSnapshot(
      notificationsQuery,
      async (snapshot) => {
        if (!snapshot.empty) {
          try {
            const fetchedNotifications = await Promise.all(
              snapshot.docs.map(async (docSnap) => {
                const data = docSnap.data();
                const farmerId = data.farmerId;

                let farmerDetails = {
                  farmerName: 'Unknown',
                  phone: 'N/A',
                  farmerAddress: 'N/A',
                };

                if (farmerId) {
                  try {
                    const farmerRef = doc(db, 'farmers', farmerId);
                    const farmerSnap = await getDoc(farmerRef);
                    if (farmerSnap.exists()) {
                      const farmerData = farmerSnap.data();
                      farmerDetails = {
                        farmerName: farmerData.username || 'Unknown',
                        phone: farmerData.phone || 'N/A',
                        farmerAddress: farmerData.address || 'N/A',
                      };
                    }
                  } catch (error) {
                    console.error('Error fetching farmer details:', error);
                  }
                }

                return {
                  id: docSnap.id,
                  ...data,
                  ...farmerDetails,
                  timestamp: data.timestamp ? data.timestamp.toDate() : null,
                };
              })
            );
            setNotifications(fetchedNotifications);
          } catch (fetchError) {
            console.error("Error processing notifications:", fetchError);
            setError("Failed to fetch notifications.");
          }
        } else {
          setNotifications([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching notifications:", error);
        setError("Insufficient permissions or Firestore error.");
        setLoading(false);
      }
    );

    return () => unsubscribeSnapshot();
  }, [user]);

  return (
    <LinearGradient colors={['#E3F2FD', '#BBDEFB']} style={styles.container}>
      <Text style={styles.header}>📢 Notifications</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0277BD" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : notifications.length === 0 ? (
        <Text style={styles.noNotifications}>No notifications yet.</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.notificationCard} activeOpacity={0.9}>
              <LinearGradient colors={['#ffffff', '#E3F2FD']} style={styles.cardContent}>
                <Text style={styles.productName}>
                  <MaterialIcons name="shopping-cart" size={18} color="#0288D1" /> Product: {item.productName || 'N/A'}
                </Text>
                <Text style={styles.quantity}>
                  <FontAwesome5 name="sort-numeric-up" size={16} color="#01579B" /> Quantity: {item.quantity || 'N/A'}
                </Text>
                <Text style={styles.farmer}>
                  <FontAwesome5 name="user" size={16} color="#0D47A1" /> Farmer: {item.farmerName}
                </Text>
                <Text style={styles.phone}>
                  <FontAwesome5 name="phone-alt" size={16} color="#1A237E" /> {item.phone}
                </Text>
                <Text style={styles.address}>
                  <FontAwesome5 name="map-marker-alt" size={16} color="#1A237E" /> {item.farmerAddress}
                </Text>
                <View style={styles.statusContainer}>
                  <View style={item.status === 'Order Confirmed' ? styles.confirmedBox : styles.pendingBox}>
                    <Text style={styles.statusText}>
                      {item.status === 'Order Confirmed' ? '✔ Order Confirmed' : '⏳ Pending Confirmation'}
                    </Text>
                  </View>
                </View>
                <Text style={item.status === 'Order Confirmed' ? styles.delivery : styles.notConfirmed}>
                  {item.status === 'Order Confirmed' 
                    ? '🚚 Your order will be delivered within 4 days.' 
                    : '❌ Your order is not confirmed yet.'}
                </Text>
                {item.timestamp && (
                  <Text style={styles.timestamp}>🕒 {format(item.timestamp, 'MMM d, yyyy - h:mm a')}</Text>
                )}
                <TouchableOpacity
                  style={styles.feedbackButton}
                  onPress={() => navigation.navigate('FeedbackScreen', { 
                    productId: item.id, 
                    productName: item.productName 
                  })}
                >
                  <Text style={styles.feedbackText}>📝 Give Feedback</Text>
                </TouchableOpacity>
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
  header: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#0277BD' },
  errorText: { color: 'red', textAlign: 'center', marginTop: 20 },
  noNotifications: { textAlign: 'center', fontSize: 18, color: '#777' },
  notificationCard: { borderRadius: 16, marginBottom: 15, elevation: 6 },
  cardContent: { padding: 20, borderRadius: 16 },
  productName: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  quantity: { fontSize: 16, color: '#555', marginBottom: 5 },
  farmer: { fontSize: 16, color: '#333', marginBottom: 5 },
  phone: { fontSize: 16, color: '#555', marginBottom: 5 },
  address: { fontSize: 16, color: '#555', marginBottom: 10 },
  statusContainer: { alignItems: 'center', marginVertical: 10 },
  confirmedBox: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 8 },
  pendingBox: { backgroundColor: '#FFC107', padding: 10, borderRadius: 8 },
  statusText: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
  delivery: { fontSize: 16, color: '#388E3C', fontWeight: 'bold', marginTop: 10, textAlign: 'center' },
  notConfirmed: { fontSize: 16, color: '#D32F2F', fontWeight: 'bold', marginTop: 10, textAlign: 'center' },
  feedbackButton: { marginTop: 10, alignItems: 'center', padding: 10, borderRadius: 8, backgroundColor: '#0288D1' },
  feedbackText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default NotificationScreen;
