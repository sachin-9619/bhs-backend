const axios = require("axios");

/**
 * SEND BOOKING MAIL
 * @param {string} to - receiver email
 * @param {object} data - booking data
 * @param {string} type - CONFIRMATION | ADMIN_NOTIFICATION
 */
exports.sendBookingMail = async (to, data, type = "CONFIRMATION") => {
  if (!to) return;

  let subject = "";
  let html = "";

  // ===== USER CONFIRMATION =====
  if (type === "CONFIRMATION") {
    subject = "🎫 Bus Ticket Confirmed | BHS Travels";
    html = `
      <div style="font-family:Arial,sans-serif;max-width:600px">
        <h2 style="color:#0a7cff">Booking Confirmed 🎉</h2>
        <p>Hello <b>${data.userName}</b>,</p>

        <table cellpadding="6" cellspacing="0" border="1" style="border-collapse:collapse">
          <tr><td><b>Bus</b></td><td>${data.busName}</td></tr>
          <tr><td><b>Route</b></td><td>${data.departure} → ${data.destination}</td></tr>
          <tr><td><b>Date</b></td><td>${data.travelDate}</td></tr>
          <tr><td><b>Time</b></td><td>${data.departureTime}</td></tr>
          <tr><td><b>Seats</b></td><td>${data.seats}</td></tr>
          <tr><td><b>Amount</b></td><td>₹${data.amount}</td></tr>
        </table>

        <p style="margin-top:15px">
          🙏 Thank you for choosing <b>BHS Travels</b>
        </p>
      </div>
    `;
  }

  // ===== ADMIN NOTIFICATION =====
  if (type === "ADMIN_NOTIFICATION") {
    subject = "🆕 New Booking Received | BHS Travels";
    html = `
      <div style="font-family:Arial,sans-serif">
        <h2>New Booking Alert 🚨</h2>
        <p><b>Name:</b> ${data.userName}</p>
        <p><b>Email:</b> ${data.email}</p>
        <p><b>Phone:</b> ${data.phone}</p>
        <p><b>Route:</b> ${data.departure} → ${data.destination}</p>
        <p><b>Seats:</b> ${data.seats}</p>
        <p><b>Amount:</b> ₹${data.amount}</p>
      </div>
    `;
  }

  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "BHS Travels",
          email: process.env.MAIL_FROM,
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        timeout: 20000,
      }
    );

    console.log(`✅ Mail sent → ${to} [${type}]`);
  } catch (err) {
    console.error(
      "❌ Mail error:",
      err.response?.data || err.message
    );
  }
};
