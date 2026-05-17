import { getCurrentWeather, getForecast } from '../services/weather.service.js';

// GET CURRENT WEATHER
export const fetchCurrentWeather = async (req, res) => {
  try {
    // Get city from query parameter: /api/weather/current?city=Mumbai
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ error: 'City name is required' });
    }

    const result = await getCurrentWeather(city);

    // Extract only what frontend needs (API returns a LOT of raw data)
    const { data, source } = result;

    res.status(200).json({
      source,
      city: data.name,
      country: data.sys.country,
      coordinates: {
        lat: data.coord.lat,    // ← add this
        lon: data.coord.lon     // ← add this
      },
      temperature: {
        current: data.main.temp,
        feelsLike: data.main.feels_like,
        min: data.main.temp_min,
        max: data.main.temp_max,
      },
      weather: {
        main: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
      },
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      visibility: data.visibility,
    });

  } catch (error) {
    // OpenWeatherMap returns 404 if city not found
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'City not found' });
    }
    console.error('Weather fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
};

// GET 5-DAY FORECAST
export const fetchForecast = async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ error: 'City name is required' });
    }

    const result = await getForecast(city);
    const { data, source } = result;

    // API returns 40 data points (every 3hrs for 5 days)
    // We filter to get just one reading per day (at noon)
    const dailyForecasts = data.list.filter(item =>
      item.dt_txt.includes('12:00:00')
    );

    res.status(200).json({
      source,
      city: data.city.name,
      country: data.city.country,
      forecast: dailyForecasts.map(item => ({
        date: item.dt_txt.split(' ')[0],  // just the date part
        temperature: {
          min: item.main.temp_min,
          max: item.main.temp_max,
          feelsLike: item.main.feels_like,
        },
        weather: {
          main: item.weather[0].main,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        },
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
      }))
    });

  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'City not found' });
    }
    console.error('Forecast fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch forecast data' });
  }
};
// GET CITY SUGGESTIONS
export const fetchCitySuggestions = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.status(200).json({ suggestions: [] });
    }

    const response = await axios.get(
      'http://api.openweathermap.org/geo/1.0/direct',
      {
        params: {
          q,
          limit: 5,
          appid: process.env.WEATHER_API_KEY
        }
      }
    );

    const suggestions = response.data.map(item => ({
      name: item.name,
      country: item.country,
      state: item.state || '',
      lat: item.lat,
      lon: item.lon,
      // Display label like "Mumbai, MH, IN"
      label: item.state
        ? `${item.name}, ${item.state}, ${item.country}`
        : `${item.name}, ${item.country}`
    }));

    res.status(200).json({ suggestions });

  } catch (error) {
    console.error('Suggestions error:', error.message);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
};
