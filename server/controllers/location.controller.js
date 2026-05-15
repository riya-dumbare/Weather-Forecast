import prisma from '../config/db.js';
import { getCurrentWeather } from '../services/weather.service.js';

// SAVE A LOCATION
export const saveLocation = async (req, res) => {
  try {
    const { city, latitude, longitude } = req.body;
    const userId = req.user.userId;

    // Only city is required now
    if (!city) {
      return res.status(400).json({ error: 'City is required' });
    }

    // Check duplicate
    const existing = await prisma.location.findFirst({
      where: {
        userId,
        city: {
          equals: city,
          mode: 'insensitive'
        }
      }
    });

    if (existing) {
      return res.status(409).json({ error: 'Location already saved' });
    }

    const location = await prisma.location.create({
      data: {
        city,
        latitude: latitude ?? 0,   // default 0 if not sent
        longitude: longitude ?? 0,  // default 0 if not sent
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