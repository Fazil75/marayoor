import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { db } from '../Screens/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const FarmerDetailsScreen = ({ navigation }) => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const farmersCollection = collection(db, 'farmers');
        const snapshot = await getDocs(farmersCollection);
        const farmerList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFarmers(farmerList);
      } catch (error) {
        console.error('Error fetching farmer details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmers();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5DADE2" />
        <Text style={styles.loadingText}>Loading farmer details...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#EAF2F8', '#D4E6F1']} style={styles.container}>
      <Text style={styles.header}>👨‍🌾 Registered Farmers</Text>
      {farmers.length === 0 ? (
        <Text style={styles.noDataText}>No farmers registered yet.</Text>
      ) : (
        <FlatList
          data={farmers}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('FeedbackScreen', { farmerId: item.id, farmerName: item.name })}
            >
              <LinearGradient colors={['#ffffff', '#EAF2F8']} style={styles.cardContent}>
                <Text style={styles.name}>
                  <FontAwesome5 name="user" size={18} color="#2471A3" /> {item.name || item.username || 'No Name'}
                </Text>
                <Text style={styles.info}>
                  <MaterialIcons name="email" size={16} color="#1F618D" /> {item.email || 'N/A'}
                </Text>
                <Text style={styles.info}>
                  <FontAwesome5 name="phone-alt" size={16} color="#1F618D" /> {item.phone || 'N/A'}
                </Text>
                <Text style={styles.info}>
                  <FontAwesome5 name="map-marker-alt" size={16} color="#1F618D" /> {item.location || item.address || 'Unknown'}
                </Text>
                <Text style={styles.info}>
                  <FontAwesome5 name="seedling" size={16} color="#1F618D" /> Experience: {item.experience || 'Not specified'} years
                </Text>
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
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#555' },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2471A3',
    textTransform: 'uppercase',
  },
  noDataText: { fontSize: 18, textAlign: 'center', color: '#555' },
  card: {
    borderRadius: 16,
    marginBottom: 15,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  cardContent: {
    padding: 20,
    borderRadius: 16,
  },
  name: { fontSize: 18, fontWeight: 'bold', color: '#2471A3' },
  info: { fontSize: 16, color: '#1F618D', marginTop: 5 },
  feedbackLink: { color: '#1F618D', fontSize: 16, marginTop: 12, fontWeight: 'bold' },
});

export default FarmerDetailsScreen;
