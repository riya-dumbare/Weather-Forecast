import cron from 'node-cron';
import prisma from '../config/db.js';
import { getCurrentWeather } from './weather.service.js';
import { sendAlertEmail } from './email.service.js';

// WEATHER CONDITIONS THAT TRIGGER ALERTS
const ALERT_CONDITIONS = {
  rain: ['Rain', 'Drizzle', 'Thunderstorm'],
  storm: ['Thunderstorm', 'Squall', 'Tornado'],
  snow: ['Snow'],
  heat: null,   // handled separately (temperature based)
  fog: ['Fog', 'Mist', 'Haze'],
};

// CHECK IF WEATHER MATCHES ALERT TYPE
const shouldSendAlert = (alertType, weatherData) => {
  const condition = weatherData.weather[0].main;
  const temperature = weatherData.main.temp;

  if (alertType === 'heat') {
    // Send heat alert if temperature above 40°C
    return temperature > 40;
  }

  const triggerConditions = ALERT_CONDITIONS[alertType];
  if (!triggerConditions) return false;

  // Check if current weather matches any trigger condition
  return triggerConditions.includes(condition);
};

// MAIN ALERT CHECKER FUNCTION
const checkWeatherAlerts = async () => {
  console.log('⏰ Cron job running — checking weather alerts...');

  try {
    // Get all active alerts with their user's email
    const alerts = await prisma.alert.findMany({
      where: { isActive: true },
      include: {
        user: {
          select: { email: true, name: true }
        }
      }
    });

    if (alerts.length === 0) {
      console.log('No active alerts to check');
      return;
    }

    console.log(`Checking ${alerts.length} active alerts...`);

    // Check each alert
    for (const alert of alerts) {
      try {
        // Get current weather for this city
        const result = await getCurrentWeather(alert.city);
        const weatherData = result.data;

        // Should we send an alert?
        if (shouldSendAlert(alert.alertType, weatherData)) {
          console.log(`🚨 Alert triggered for ${alert.city} - ${alert.alertType}`);

          // Send email to the user
          await sendAlertEmail({
            to: alert.user.email,
            city: alert.city,
            alertType: alert.alertType,
            weatherData: {
              temperature: weatherData.main.temp,
              description: weatherData.weather[0].description,
              humidity: weatherData.main.humidity,
              windSpeed: weatherData.wind.speed,
            }
          });
        }

      } catch (error) {
        // If one alert fails don't stop checking others
        console.error(`Failed to check alert for ${alert.city}:`, error.message);
      }
    }

    console.log('✅ Alert check complete');

  } catch (error) {
    console.error('Cron job error:', error.message);
  }
};

// START THE CRON JOB
export const startCronJob = () => {
  // Run every 30 minutes
  cron.schedule('*/30 * * * *', checkWeatherAlerts);

  console.log('✅ Cron job scheduled — checking alerts every 30 minutes');
};