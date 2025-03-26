import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image, ScrollView } from 'react-native';
import * as Location from 'expo-location';

const WEATHER_API_KEY = '8b443375935e7fa55b946d830a3f467a';

const WeatherPage = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [locationName, setLocationName] = useState('Fetching Location...');
  const [background, setBackground] = useState(['#1e3c72', '#2a5298']); // Default gradient

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Location permission denied');
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        console.log(`📍 Location: ${latitude}, ${longitude}`);

        // Fetch reverse geocoding to get location name
        const geoResponse = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${WEATHER_API_KEY}`
        );
        const geoData = await geoResponse.json();

        if (geoData.length > 0) {
          setLocationName(`${geoData[0].name}, ${geoData[0].state}, ${geoData[0].country}`);
        }

        // Fetch weather data
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`
        );
        const weatherData = await weatherResponse.json();

        if (weatherData.cod !== 200) {
          setErrorMsg('Weather data unavailable');
        } else {
          setWeather(weatherData);

          // Update background gradient based on weather condition
          const condition = weatherData.weather[0].main.toLowerCase();
          if (condition.includes('cloud')) setBackground(['#2c3e50', '#bdc3c7']); // Cloudy
          else if (condition.includes('rain')) setBackground(['#000428', '#004e92']); // Rainy
          else if (condition.includes('clear')) setBackground(['#ff8008', '#ffc837']); // Sunny
          else setBackground(['#1e3c72', '#2a5298']); // Default
        }
      } catch (error) {
        console.error('Error fetching weather:', error);
        setErrorMsg('Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: '#000' }]}>
        <ActivityIndicator size="large" color="#0ff" />
        <Text style={styles.loadingText}>Loading Weather...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={[styles.container, { backgroundColor: '#000' }]}>
        <Text style={styles.errorText}>⚠ {errorMsg}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: '#1a1a2e' }]}>
      <Text style={styles.header}>🌍 Futuristic Weather</Text>
      <Text style={styles.locationText}>📍 {locationName}</Text>

      <View style={styles.weatherBox}>
        <Image
          source={{ uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png` }}
          style={styles.weatherIcon}
        />
        <Text style={styles.tempText}>{weather.main.temp}°C</Text>
        <Text style={styles.weatherDescription}>{weather.weather[0].description}</Text>
        <Text style={styles.feelsLike}>Feels like: {weather.main.feels_like}°C</Text>
      </View>

      <View style={styles.detailsBox}>
        <Text style={styles.detailText}>💧 Humidity: {weather.main.humidity}%</Text>
        <Text style={styles.detailText}>🌬 Wind Speed: {weather.wind.speed} m/s</Text>
        <Text style={styles.detailText}>🔎 Visibility: {weather.visibility / 1000} km</Text>
        <Text style={styles.detailText}>📊 Pressure: {weather.main.pressure} hPa</Text>
        <Text style={styles.detailText}>🌅 Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</Text>
        <Text style={styles.detailText}>🌇 Sunset: {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1a1a2e',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0ff',
    textShadowColor: '#00f',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  locationText: {
    fontSize: 18,
    color: '#fff',
    marginVertical: 10,
  },
  weatherBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 255, 0.2)',
    padding: 20,
    borderRadius: 15,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: '#0ff',
  },
  weatherIcon: {
    width: 120,
    height: 120,
  },
  tempText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  weatherDescription: {
    fontSize: 22,
    color: '#0ff',
    textTransform: 'capitalize',
    marginTop: 5,
  },
  feelsLike: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#ccc',
  },
  detailsBox: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 15,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: '#0ff',
  },
  detailText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 5,
  },
  loadingText: {
    fontSize: 18,
    color: '#0ff',
    marginTop: 10,
  },
  errorText: {
    fontSize: 20,
    color: 'red',
    fontWeight: 'bold',
  },
});

export default WeatherPage;
