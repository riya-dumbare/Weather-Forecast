import express from 'express';
import { createAlert, getAlerts, deleteAlert } from '../controllers/alert.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

// All protected
router.post('/', protect, createAlert);
router.get('/', protect, getAlerts);
router.delete('/:id', protect, deleteAlert);

export default router;