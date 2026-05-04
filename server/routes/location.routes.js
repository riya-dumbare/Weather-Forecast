import express from 'express';
import {
  saveLocation,
  getLocations,
  deleteLocation
} from '../controllers/location.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

// All location routes are protected — must be logged in
// protect middleware runs first, then the controller

// POST /api/locations
router.post('/', protect, saveLocation);

// GET /api/locations
router.get('/', protect, getLocations);

// DELETE /api/locations/:id
router.delete('/:id', protect, deleteLocation);

export default router;