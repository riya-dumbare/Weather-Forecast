import express from 'express';
import { fetchCurrentWeather, fetchForecast } from '../controllers/weather.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes — no auth needed to check weather
// GET /api/weather/current?city=Mumbai
router.get('/current', fetchCurrentWeather);

// GET /api/weather/forecast?city=Mumbai
router.get('/forecast', fetchForecast);
router.get('/suggestions', fetchCitySuggestions);
export default router;