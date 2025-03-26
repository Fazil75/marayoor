import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CustomerHomeScreen = ({ navigation }) => {
  return (
    <LinearGradient colors={['#8EC5FC', '#E0C3FC']} style={styles.container}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Customer Home</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => navigation.replace('Login')}>
          <Ionicons name="log-out-outline" size={24} color="#007BFF" />
        </TouchableOpacity>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Text style={styles.header}>Welcome, Customer!</Text>
        <ScrollView style={styles.cardList} showsVerticalScrollIndicator={false}>
          
          {/* Navigate to Customer Marketplace */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('CustomerMarketplace')}>
            <Ionicons name="basket-outline" size={30} color="#007BFF" />
            <Text style={styles.cardTitle}>Go to Marketplace</Text>
          </TouchableOpacity>

          {/* Navigate to Farmer Details */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('FarmerDetails')}>
            <Ionicons name="people-outline" size={30} color="#007BFF" />
            <Text style={styles.cardTitle}>View Farmer Details</Text>
          </TouchableOpacity>

          {/* Navigate to Notifications */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('NotificationScreen')}>
            <Ionicons name="notifications-outline" size={30} color="#007BFF" />
            <Text style={styles.cardTitle}>Notifications</Text>
          </TouchableOpacity>

        </ScrollView>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  appBar: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  appBarTitle: {
    color: '#007BFF',
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  logoutButton: {
    backgroundColor: '#E3F2FD',
    padding: 10,
    borderRadius: 50,
  },
  body: {
    padding: 20,
    flex: 1,
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  cardList: {
    width: '100%',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    elevation: 6,
    padding: 16,
    marginBottom: 16,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: '#007BFF',
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  cardTitle: {
    color: '#007BFF',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 16,
    textTransform: 'uppercase',
  },
});

export default CustomerHomeScreen;
