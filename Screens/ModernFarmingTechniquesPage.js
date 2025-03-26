import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";

const ModernFarmingTechniquesPage = () => {
  return (
    <LinearGradient colors={["#8EC5FC", "#E0C3FC"]} style={styles.container}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Modern Farming for Jaggery Farmers</Text>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <ScrollView style={styles.techniqueList} showsVerticalScrollIndicator={false}>
          <FarmingTechniqueCard
            title="Drip Irrigation for Sugarcane"
            description="Efficient water management system that reduces water usage by 30-50% while improving crop yield."
            icon="water-drop"
            url="https://en.wikipedia.org/wiki/Drip_irrigation"
          />
          <FarmingTechniqueCard
            title="Soil Health & Organic Fertilization"
            description="Using bio-fertilizers and composting techniques to improve soil fertility and sugarcane productivity."
            icon="eco"
            url="https://en.wikipedia.org/wiki/Soil_health"
          />
          <FarmingTechniqueCard
            title="Intercropping with Legumes"
            description="Growing sugarcane with legumes like beans to enhance soil nitrogen content and reduce weed growth."
            icon="agriculture"
            url="https://en.wikipedia.org/wiki/Intercropping"
          />
          <FarmingTechniqueCard
            title="Automated Jaggery Processing"
            description="Using modern automation in jaggery production to improve efficiency, reduce wastage, and ensure better quality."
            icon="settings"
            url="https://en.wikipedia.org/wiki/Jaggery"
          />
          <FarmingTechniqueCard
            title="Smart Pest Control"
            description="Biological control methods and drone technology for detecting and eliminating pests in sugarcane fields."
            icon="pest-control"
            url="https://en.wikipedia.org/wiki/Integrated_pest_management"
          />
          <FarmingTechniqueCard
            title="Weather & Climate Monitoring"
            description="Using AI-powered weather prediction systems to plan irrigation and harvesting effectively."
            icon="cloud"
            url="https://en.wikipedia.org/wiki/Weather_forecasting"
          />
          <FarmingTechniqueCard
            title="Sugarcane Tissue Culture"
            description="Growing disease-free and high-yield sugarcane varieties using tissue culture technology."
            icon="science"
            url="https://en.wikipedia.org/wiki/Plant_tissue_culture"
          />
          <FarmingTechniqueCard
            title="Solar-Powered Jaggery Making"
            description="Utilizing solar energy for jaggery processing to reduce dependency on fuel and increase sustainability."
            icon="wb-sunny"
            url="https://en.wikipedia.org/wiki/Solar_energy"
          />
          <FarmingTechniqueCard
            title="Precision Harvesting Technology"
            description="Using GPS and automated harvesting machines for efficient sugarcane cutting and transportation."
            icon="precision-manufacturing"
            url="https://en.wikipedia.org/wiki/Precision_agriculture"
          />
          <FarmingTechniqueCard
            title="Blockchain for Jaggery Traceability"
            description="Ensuring transparency in jaggery production and selling through blockchain-based traceability."
            icon="lock"
            url="https://en.wikipedia.org/wiki/Blockchain"
          />
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

// Farming Technique Card Component
const FarmingTechniqueCard = ({ title, description, icon, url }) => {
  const handleCardPress = () => {
    // Open the URL in the browser
    Linking.openURL(url).catch((err) => console.error("Failed to open URL:", err));
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handleCardPress}>
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <Icon name={icon} size={40} color="#fff" />
        </View>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appBar: {
    backgroundColor: "rgba(0, 123, 255, 0.8)",
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  appBarTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  body: {
    flex: 1,
    padding: 16,
    paddingTop: 20,
  },
  techniqueList: {
    marginTop: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 4,
    marginBottom: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: "#007BFF",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 25,
    marginRight: 12,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007BFF",
    marginBottom: 6,
  },
  cardDescription: {
    color: "#607D8B",
    fontSize: 14,
    lineHeight: 20,
  },
});

export default ModernFarmingTechniquesPage;
