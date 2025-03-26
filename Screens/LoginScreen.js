import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, Alert, 
  ActivityIndicator, StyleSheet 
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig"; 
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (email.trim() === "" || password.trim() === "") {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch farmer's approval status from Firestore
      const farmerRef = doc(db, "farmers", user.uid);
      const farmerSnap = await getDoc(farmerRef);

      if (farmerSnap.exists() && farmerSnap.data().status === "Approved") {
        setLoading(false);
        Alert.alert("Success", `Welcome ${user.email}`);
        navigation.replace("MyHomePage"); // Redirect to home page
      } else {
        setLoading(false);
        Alert.alert("Error", "Your account is not approved yet. Please wait for verification.");
        await auth.signOut(); // Logout unapproved user
      }
    } catch (error) {
      setLoading(false);
      console.log("Login error:", error);
      Alert.alert("Error", "Invalid credentials or account not approved");
    }
  };

  return (
    <LinearGradient colors={["#8EC5FC", "#E0C3FC"]} style={styles.container}>
      <View style={styles.card}>
        <MaterialIcons name="person" size={50} color="#007BFF" style={styles.icon} />
        <Text style={styles.title}>Farmer Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#666"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
          placeholderTextColor="#666"
        />

        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        )}

        {/* Sign Up Navigation */}
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.signupText}>
            Don't have an account? <Text style={styles.signupLink}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    alignItems: "center",
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#007BFF",
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
    color: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    width: "100%",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupText: {
    fontSize: 16,
    color: "#555",
    marginTop: 15,
  },
  signupLink: {
    color: "#007BFF",
    fontWeight: "bold",
  },
});

export default LoginScreen;
