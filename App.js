import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import Screens
import UserSelectionScreen from './Screens/UserSelectionScreen';
import LoginScreen from './Screens/LoginScreen';
import SignUpScreen from './Screens/SignUpScreen';
import CustomerLoginScreen from './Screens/CustomerLoginScreen';
import CustomerSignUpScreen from './Screens/CustomerSignUpScreen';
import MyHomePage from './Screens/MyHomePage';
import CustomerHomeScreen from './Screens/CustomerHomeScreen';
import CustomerMarketplacePage from './Screens/CustomerMarketplacePage';
import WeatherPage from './Screens/WeatherPage';
import SubsidyNotificationPage from './Screens/SubsidyNotificationPage';
import FarmersMarketplacePage from './Screens/FarmersMarketplacePage';
import ModernFarmingTechniquesPage from './Screens/ModernFarmingTechniquesPage';
import FarmerDetailsScreen from './Screens/FarmerDetailsScreen';
import FarmersProductSellingScreen from './Screens/FarmersProductSellingScreen';
import FarmersFeedbackPortal from './Screens/FarmersFeedbackPortal';
import FeedbackScreen from "./Screens/FeedbackScreen";
import ProductDetails from './Screens/ProductDetails';
import NotificationScreen from './Screens/NotificationScreen';
import FarmersProductsPage from './Screens/FarmersProductsPage';

// Create Stack Navigator
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="UserSelection">
        <Stack.Screen name="UserSelection" component={UserSelectionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CustomerLogin" component={CustomerLoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CustomerSignUp" component={CustomerSignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MyHomePage" component={MyHomePage} options={{ title: 'Farmer Home' }} />
        <Stack.Screen name="CustomerHome" component={CustomerHomeScreen} options={{ title: 'Customer Home' }} />
        <Stack.Screen name="CustomerMarketplace" component={CustomerMarketplacePage} options={{ title: 'Customer Marketplace' }} /> 
        <Stack.Screen name="WeatherPage" component={WeatherPage} options={{ title: 'Weather Alerts' }} />
        <Stack.Screen name="SubsidyNotificationPage" component={SubsidyNotificationPage} options={{ title: 'Subsidy Notifications' }} />
        <Stack.Screen name="FarmersMarketplacePage" component={FarmersMarketplacePage} options={{ title: 'Farmers Marketplace' }} />
        <Stack.Screen name="ModernFarmingTechniquesPage" component={ModernFarmingTechniquesPage} options={{ title: 'Modern Farming Techniques' }} />
        <Stack.Screen name="FarmerDetails" component={FarmerDetailsScreen} options={{ title: 'Farmer Details' }} />
        <Stack.Screen name="FarmersProductsPage" component={FarmersProductsPage} options={{ title: 'My Products' }} />
        <Stack.Screen name="FarmersProductSellingScreen" component={FarmersProductSellingScreen} options={{ title: 'Product Selling' }} />
        <Stack.Screen name="FarmersFeedbackPortal" component={FarmersFeedbackPortal} options={{ title: 'Feedback Portal' }} />
        <Stack.Screen name="FeedbackScreen" component={FeedbackScreen} options={{ title: 'Feedback' }} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} />
        <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
