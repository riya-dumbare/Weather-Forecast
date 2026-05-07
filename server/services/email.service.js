import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false  
  }
});

// Verify connection on startup
transporter.verify((error) => {
  if (error) {
    console.error('❌ Email service error:', error.message);
  } else {
    console.log('✅ Email service ready');
  }
});

// SEND WEATHER ALERT EMAIL
export const sendAlertEmail = async ({ to, city, alertType, weatherData }) => {
  try {
    // Build a nice looking email
    const mailOptions = {
      from: `"Weather Alert 🌦️" <${process.env.EMAIL_USER}>`,
      to,
      subject: `⚠️ Weather Alert: ${alertType.toUpperCase()} expected in ${city}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e74c3c;">⚠️ Weather Alert for ${city}</h2>
          
          <p>Hi there! You asked us to notify you about <strong>${alertType}</strong> in <strong>${city}</strong>.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0;">Current Conditions:</h3>
            <p>🌡️ Temperature: <strong>${weatherData.temperature}°C</strong></p>
            <p>🌤️ Condition: <strong>${weatherData.description}</strong></p>
            <p>💧 Humidity: <strong>${weatherData.humidity}%</strong></p>
            <p>💨 Wind Speed: <strong>${weatherData.windSpeed} m/s</strong></p>
          </div>

          <p style="color: #666; font-size: 12px;">
            You are receiving this because you set up a weather alert.
            You can manage your alerts in the app.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Alert email sent to ${to} for ${city}`);

  } catch (error) {
    console.error('Send email error:', error.message);
  }
};