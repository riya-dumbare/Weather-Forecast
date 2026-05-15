import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import WeatherCard from '../components/WeatherCard';
import ForecastCard from '../components/ForecastCard';
import LocationCard from '../components/LocationCard';
import {
  getCurrentWeather,
  getForecast,
  getLocations,
  saveLocation,
  deleteLocation
} from '../services/api';

const Dashboard = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saveMsg, setSaveMsg] = useState('');

  // Load saved locations on mount
  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await getLocations();
      setLocations(res.data.locations);
    } catch (err) {
      console.error('Failed to fetch locations:', err);
    }
  };

  // Search weather for a city
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError('');
    setWeather(null);
    setForecast([]);

    try {
      // Fetch current weather and forecast simultaneously
      const [weatherRes, forecastRes] = await Promise.all([
        getCurrentWeather(city),
        getForecast(city)
      ]);

      setWeather(weatherRes.data);
      setForecast(forecastRes.data.forecast);

    } catch (err) {
      setError(
        err.response?.data?.error || 'City not found. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Save current city to locations
  const handleSaveLocation = async () => {
  if (!weather) return;

  const lat = weather.coordinates?.lat ?? 0;
  const lon = weather.coordinates?.lon ?? 0;

  console.log('Saving:', weather.city, lat, lon); // debug

  try {
    await saveLocation({
      city: weather.city,
      latitude: lat,
      longitude: lon
    });
    setSaveMsg('✅ Location saved!');
    fetchLocations();
    setTimeout(() => setSaveMsg(''), 3000);
  } catch (err) {
    console.log('Error:', err.response?.data);
    setSaveMsg(err.response?.data?.error || '❌ Could not save location');
    setTimeout(() => setSaveMsg(''), 3000);
  }
};

  // Delete a saved location
  const handleDeleteLocation = async (id) => {
    try {
      await deleteLocation(id);
      // Remove from state instantly without refetching
      setLocations(locations.filter(loc => loc.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <Navbar />

      <div className="max-w-4xl mx-auto p-6 space-y-6">

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search city... (e.g. Mumbai, London, Tokyo)"
            className="flex-1 border border-gray-300 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50 shadow-sm"
          >
            {loading ? '...' : '🔍 Search'}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Current Weather */}
        {weather && (
          <div>
            <WeatherCard data={weather} />

            {/* Save Location Button */}
            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={handleSaveLocation}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                📍 Save Location
              </button>
              {saveMsg && (
                <span className="text-sm text-gray-600">{saveMsg}</span>
              )}
            </div>
          </div>
        )}

        {forecast.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              📅 5-Day Forecast
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {forecast.map((day, index) => (
                <ForecastCard key={index} day={day} />
              ))}
            </div>
          </div>
        )}

        {locations.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              📍 Saved Locations
            </h3>
            <div className="space-y-3">
              {locations.map((location) => (
                <LocationCard
                  key={location.id}
                  location={location}
                  onDelete={handleDeleteLocation}
                />
              ))}
            </div>
          </div>
        )}

        {!weather && locations.length === 0 && !loading && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-6xl mb-4">🌍</p>
            <p className="text-xl font-medium">Search for a city to get started!</p>
            <p className="text-sm mt-2">Get current weather and 5-day forecasts</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;