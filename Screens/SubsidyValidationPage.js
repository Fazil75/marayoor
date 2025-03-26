import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SubsidyValidationPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Govt Subsidy Validation</Text>
      <Text style={styles.bodyText}>Here, you can validate your subsidy status or check details.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D47A1',
    marginBottom: 20,
  },
  bodyText: {
    fontSize: 18,
    color: '#607D8B',
  },
});

export default SubsidyValidationPage;
