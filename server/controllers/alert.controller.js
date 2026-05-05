import prisma from '../config/db.js';

// CREATE ALERT
export const createAlert = async (req, res) => {
  try {
    const { city, alertType } = req.body;
    const userId = req.user.userId;

    if (!city || !alertType) {
      return res.status(400).json({ error: 'City and alertType are required' });
    }

    // Check duplicate
    const existing = await prisma.alert.findFirst({
      where: { userId, city, alertType }
    });

    if (existing) {
      return res.status(409).json({ error: 'Alert already exists' });
    }

    const alert = await prisma.alert.create({
      data: { city, alertType, userId }
    });

    res.status(201).json({ message: 'Alert created', alert });

  } catch (error) {
    console.error('Create alert error:', error.message);
    res.status(500).json({ error: 'Failed to create alert' });
  }
};

// GET ALL ALERTS
export const getAlerts = async (req, res) => {
  try {
    const userId = req.user.userId;

    const alerts = await prisma.alert.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ alerts });

  } catch (error) {
    console.error('Get alerts error:', error.message);
    res.status(500).json({ error: 'Failed to get alerts' });
  }
};

// DELETE ALERT
export const deleteAlert = async (req, res) => {
  try {
    const userId = req.user.userId;
    const alertId = parseInt(req.params.id);

    const alert = await prisma.alert.findUnique({
      where: { id: alertId }
    });

    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    if (alert.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await prisma.alert.delete({ where: { id: alertId } });

    res.status(200).json({ message: 'Alert deleted successfully' });

  } catch (error) {
    console.error('Delete alert error:', error.message);
    res.status(500).json({ error: 'Failed to delete alert' });
  }
};