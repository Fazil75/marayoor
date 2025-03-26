import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseApp } from './firebaseConfig';
import { FontAwesome } from '@expo/vector-icons';

const firestore = getFirestore(firebaseApp);

const FarmersFeedbackPortal = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const feedbackSnapshot = await getDocs(collection(firestore, 'feedbacks'));
        let feedbackList = feedbackSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        feedbackList.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
        setFeedback(feedbackList);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp?.seconds) return 'Unknown Date';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Fetching feedback...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product Specific Feedback</Text>

      {feedback.length === 0 ? (
        <Text style={styles.noFeedbackText}>No feedback available yet.</Text>
      ) : (
        <FlatList
          data={feedback}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.feedbackCard}>
              <View style={styles.productInfo}>
                <FontAwesome name="shopping-cart" size={20} color="#007BFF" />
                <Text style={styles.productName}>{item.productName || 'Unknown Product'}</Text>
              </View>
              <StarRating rating={item.rating} />
              <Text style={styles.comment}>
                "{item.comment || 'No feedback provided.'}"
              </Text>
              <Text style={styles.date}>{formatDate(item.timestamp)}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const StarRating = ({ rating = 0 }) => {
  return (
    <View style={styles.ratingContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FontAwesome key={star} name="star" size={18} color={star <= rating ? "#FFD700" : "#ccc"} />
      ))}
      <Text style={styles.ratingText}>{rating || 'No rating'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F9F9F9' },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 15, color: '#333' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#555' },
  noFeedbackText: { fontSize: 18, textAlign: 'center', color: '#777', marginTop: 20 },
  feedbackCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productInfo: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  productName: { fontSize: 18, fontWeight: 'bold', color: '#007BFF' },
  date: { fontSize: 14, color: '#777' },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  ratingText: { fontSize: 16, fontWeight: 'bold', color: '#333', marginLeft: 8 },
  comment: { fontSize: 16, fontStyle: 'italic', color: '#444', marginTop: 5, lineHeight: 22 },
});

export default FarmersFeedbackPortal;