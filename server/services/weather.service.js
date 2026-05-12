import axios from 'axios';
import redisClient from '../config/redis.js';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const API_KEY = process.env.WEATHER_API_KEY;

// Cache expiry time — 20 minutes in seconds
const CACHE_TTL = 60 * 20;

export const getCurrentWeather = async (city) => {

  // Create a unique cache key for this city
  const cacheKey = `weather:current:${city.toLowerCase()}`;

  // Check Redis first
  const cached = await redisClient.get(cacheKey);

  if (cached) {
    console.log(`⚡ Cache HIT for ${city}`);
    // Parse because Redis stores strings, we stored JSON
    return { source: 'cache', data: JSON.parse(cached) };
  }

  console.log(`🌐 Cache MISS for ${city} — calling API`);

  // Not in cache — call OpenWeatherMap
  const response = await axios.get(`${BASE_URL}/weather`, {
    params: {
      q: city,          // city name
      appid: API_KEY,   // our API key
      units: 'metric',  // celsius. Use 'imperial' for fahrenheit
    }
  });

  const weatherData = response.data;

  // Save to Redis with 20 min expiry
  await redisClient.setEx(
    cacheKey,           // key
    CACHE_TTL,          // seconds until expiry
    JSON.stringify(weatherData) // value (must be string)
  );

  return { source: 'api', data: weatherData };
};

export const getForecast = async (city) => {

  // 1. Unique cache key for forecast
  const cacheKey = `weather:forecast:${city.toLowerCase()}`;

  // 2. Check Redis cache
  const cached = await redisClient.get(cacheKey);

  if (cached) {
    console.log(`⚡ Cache HIT for forecast:${city}`);
    return { source: 'cache', data: JSON.parse(cached) };
  }

  console.log(`🌐 Cache MISS for forecast:${city} — calling API`);

  // Call OpenWeatherMap forecast endpoint
  // This returns weather every 3 hours for 5 days (40 data points)
  const response = await axios.get(`${BASE_URL}/forecast`, {
    params: {
      q: city,
      appid: API_KEY,
      units: 'metric',
    }
  });

  const forecastData = response.data;


  await redisClient.setEx(
    cacheKey,
    CACHE_TTL,
    JSON.stringify(forecastData)
  );

  return { source: 'api', data: forecastData };
};