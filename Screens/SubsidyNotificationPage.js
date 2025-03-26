import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "./firebaseConfig"; // Firestore Database
import { LinearGradient } from "expo-linear-gradient";

const SubsidyNotificationPage = () => {
  const [subsidies, setSubsidies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubsidies = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "subsidy"));
        const subsidyList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSubsidies(subsidyList);
      } catch (error) {
        console.error("Error fetching subsidies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubsidies();
  }, []);

  const openSubsidyWebsite = async (url, subsidyId) => {
    if (url) {
      try {
        await Linking.openURL(url);
        
        // Update status to "Applied" in Firestore
        const subsidyRef = doc(db, "subsidy", subsidyId);
        await updateDoc(subsidyRef, { status: "Applied" });

        // Update local state
        setSubsidies((prevSubsidies) =>
          prevSubsidies.map((subsidy) =>
            subsidy.id === subsidyId ? { ...subsidy, status: "Applied" } : subsidy
          )
        );
      } catch (err) {
        console.error("Failed to open URL or update status:", err);
      }
    }
  };

  const renderSubsidyItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <Icon name="account-balance" size={30} color="#fff" />
        </View>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardSubtitle}>{item.description}</Text>
          <Text style={styles.cardAmount}>💰 Amount: ₹{item.amount}</Text>
          <Text style={styles.lastDate}>📅 Last Date: {item.lastDate}</Text>
          
          {/* Apply Here Link */}
          {item.website ? (
            <TouchableOpacity onPress={() => openSubsidyWebsite(item.website, item.id)}>
              <Text style={styles.applyLink}>{item.website}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={["#8EC5FC", "#E0C3FC"]} style={styles.container}>
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Govt Subsidy Notifications</Text>
      </View>
      <View style={styles.body}>
        {loading ? (
          <ActivityIndicator size="large" color="#1E88E5" />
        ) : subsidies.length === 0 ? (
          <Text style={styles.noDataText}>No subsidies available.</Text>
        ) : (
          <FlatList data={subsidies} keyExtractor={(item) => item.id} renderItem={renderSubsidyItem} />
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  appBar: { backgroundColor: "rgba(0, 123, 255, 0.8)", padding: 16, justifyContent: "center", alignItems: "center", borderBottomLeftRadius: 15, borderBottomRightRadius: 15 },
  appBarTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  body: { flex: 1, padding: 16 },
  noDataText: { textAlign: "center", fontSize: 16, color: "#37474F", marginTop: 20 },
  card: { backgroundColor: "#fff", borderRadius: 15, elevation: 6, marginBottom: 10, padding: 16 },
  cardContent: { flexDirection: "row", alignItems: "center" },
  iconContainer: { backgroundColor: "#1E88E5", padding: 12, borderRadius: 25, marginRight: 16 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#37474F" },
  cardSubtitle: { color: "#607D8B", fontSize: 14, marginTop: 5 },
  cardAmount: { color: "#388E3C", fontSize: 14, fontWeight: "bold", marginTop: 5 },
  cardStatus: { marginTop: 5, fontSize: 14, fontWeight: "bold" },
  lastDate: { fontSize: 14, color: "#D84315", fontWeight: "bold", marginTop: 5 },
  applyLink: { color: "#1E88E5", fontSize: 14, fontWeight: "bold", marginTop: 5, textDecorationLine: "underline" },
});

export default SubsidyNotificationPage;
