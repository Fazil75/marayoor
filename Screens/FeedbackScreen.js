import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView
} from 'react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../Screens/firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';

const FeedbackScreen = ({ route, navigation }) => {
  const { productId, productName, productImage } = route.params || {};  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const ratingLabels = ["Poor", "Not Bad", "Good", "Very Good", "Excellent"];

  const handleRating = (value) => {
    setRating(value);
  };

  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      Alert.alert("Error", "Please select a rating before submitting.");
      return;
    }

    // Debugging logs
    console.log("Submitting Feedback -> Product ID:", productId);
    console.log("Product Name:", productName);
    console.log("Comment:", comment);
    console.log("Rating:", rating);

    if (!productId) {
      Alert.alert("Error", "Product ID is missing.");
      return;
    }

    try {
      await addDoc(collection(db, 'feedbacks'), {
        productId,
        productName: productName || "Unknown Product",  // Prevent undefined values
        rating,
        comment,
        timestamp: serverTimestamp(),
      });
      Alert.alert("Success", "Thank you for your feedback!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      Alert.alert("Error", "Failed to submit feedback. Please try again.");
    }
  };

  return (
    <LinearGradient colors={["#0F2027", "#203A43", "#2C5364"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Give Feedback</Text>
        
        {/* Product Details */}
        <View style={styles.productContainer}>
          {productImage ? (
            <Image source={{ uri: productImage }} style={styles.productImage} />
          ) : (
            <Text style={styles.noImageText}>No Image Available</Text>
          )}
          <Text style={styles.productName}>{productName || "Unknown Product"}</Text>
        </View>
        
        {/* Rating Section */}
        <Text style={styles.label}>Your Rating</Text>
        <View style={styles.starContainer}>
          {[...Array(5)].map((_, i) => (
            <TouchableOpacity key={i} onPress={() => handleRating(i + 1)}>
              <FontAwesome 
                name={i < rating ? "star" : "star-o"} 
                size={40} 
                color={i < rating ? "#FFD700" : "#CCC"}
              />
            </TouchableOpacity>
          ))}
        </View>
        {rating > 0 && <Text style={styles.ratingText}>{ratingLabels[rating - 1]}</Text>}

        {/* Feedback Input */}
        <Text style={styles.label}>Your Comments</Text>
        <TextInput
          style={styles.input}
          placeholder="Write your feedback..."
          placeholderTextColor="#A0A0A0"
          value={comment}
          onChangeText={setComment}
          multiline
          maxLength={300}
        />

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmitFeedback}>
          <Text style={styles.submitText}>Submit Feedback</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'flex-start' },
  scrollContainer: { flexGrow: 1, alignItems: 'center', paddingTop: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#FFF', marginBottom: 10 },
  productContainer: { alignItems: 'center', marginBottom: 10 },
  productImage: { width: 100, height: 100, borderRadius: 10, marginBottom: 5 },
  productName: { fontSize: 18, fontWeight: 'bold', color: '#FFD700', textAlign: 'center' },
  noImageText: { fontSize: 16, color: '#A0A0A0', textAlign: 'center' },
  label: { fontSize: 16, marginTop: 10, color: '#FFD700', fontWeight: 'bold' },
  starContainer: { flexDirection: 'row', justifyContent: 'center', marginVertical: 5 },
  ratingText: { textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: '#FFD700', marginTop: 5 },
  input: { 
    width: '90%',
    borderBottomWidth: 2, 
    borderColor: '#FFD700', 
    marginVertical: 5, 
    padding: 10, 
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    color: '#FFF',
  },
  submitButton: { 
    backgroundColor: '#FFD700', 
    padding: 12, 
    alignItems: 'center', 
    marginTop: 10, 
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
    width: '90%',
  },
  submitText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
});

export default FeedbackScreen;
