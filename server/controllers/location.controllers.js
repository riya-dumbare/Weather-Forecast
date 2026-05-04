import prisma from '../config/db.js';
import { getCurrentWeather } from '../services/weather.service.js';

export const saveLocation = async (req, res) => {
  try {
    const { city, latitude, longitude } = req.body;

    // req.user comes from our auth middleware
    const userId = req.user.userId;

    // Validate input
    if (!city || !latitude || !longitude) {
      return res.status(400).json({ error: 'City, latitude and longitude are required' });
    }

    // Check if user already saved this city
    const existing = await prisma.location.findFirst({
      where: {
        userId,
        city: {
          equals: city,
          mode: 'insensitive' // case insensitive check
        }
      }
    });

    if (existing) {
      return res.status(409).json({ error: 'Location already saved' });
    }

    // Save to DB
    const location = await prisma.location.create({
      data: {
        city,
        latitude,
        longitude,
        userId
      }
    });

    res.status(201).json({
      message: 'Location saved successfully',
      location
    });

  } catch (error) {
    console.error('Save location error:', error.message);
    res.status(500).json({ error: 'Failed to save location' });
  }
};

export const getLocations = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get all locations for this user
    const locations = await prisma.location.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    if (locations.length === 0) {
      return res.status(200).json({ locations: [] });
    }

    // Fetch weather for each saved location
    // Promise.all runs all requests simultaneously (parallel, not one by one)
    const locationsWithWeather = await Promise.all(
      locations.map(async (location) => {
        try {
          const result = await getCurrentWeather(location.city);
          return {
            ...location,          // spread all location fields
            weather: {
              temperature: result.data.main.temp,
              feelsLike: result.data.main.feels_like,
              description: result.data.weather[0].description,
              icon: result.data.weather[0].icon,
              humidity: result.data.main.humidity,
              windSpeed: result.data.wind.speed,
            }
          };
        } catch {
          // If weather fetch fails for one city, don't crash everything
          return { ...location, weather: null };
        }
      })
    );

    res.status(200).json({ locations: locationsWithWeather });

  } catch (error) {
    console.error('Get locations error:', error.message);
    res.status(500).json({ error: 'Failed to get locations' });
  }
};

// ─────────────────────────────────────────
// DELETE A LOCATION
// ─────────────────────────────────────────
export const deleteLocation = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get location id from URL parameter: /api/locations/3
    const locationId = parseInt(req.params.id);

    // Find the location first
    const location = await prisma.location.findUnique({
      where: { id: locationId }
    });

    // Check it exists
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }

    // Check it belongs to THIS user (security!)
    // Without this check, any logged in user could delete anyone's locations
    if (location.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this location' });
    }

    // Delete it
    await prisma.location.delete({
      where: { id: locationId }
    });

    res.status(200).json({ message: 'Location deleted successfully' });

  } catch (error) {
    console.error('Delete location error:', error.message);
    res.status(500).json({ error: 'Failed to delete location' });
  }
};