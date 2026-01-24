const axios = require("axios");

exports.sendBookingMail = async (to, data, type = "CONFIRMATION") => {
  if (!to) return;

  let subject = "";
  let html = "";

  if (type === "CONFIRMATION") {
    subject = "🎫 Bus Ticket Confirmed | BHS Travels";
    html = `
      <div style="font-family:Arial,sans-serif">
        <h2 style="color:#0a7cff">Booking Confirmed 🎉</h2>
        <p>Hello <b>${data.userName}</b>,</p>

        <table cellpadding="6">
          <tr><td><b>Bus</b></td><td>${data.busName}</td></tr>
          <tr><td><b>Route</b></td><td>${data.departure} → ${data.destination}</td></tr>
          <tr><td><b>Date</b></td><td>${data.travelDate}</td></tr>
          <tr><td><b>Time</b></td><td>${data.departureTime}</td></tr>
          <tr><td><b>Seats</b></td><td>${data.seats}</td></tr>
          <tr><td><b>Amount</b></td><td>₹${data.amount}</td></tr>
        </table>

        <p>🙏 Thank you for choosing <b>BHS Travels</b></p>
      </div>
    `;
  }

  if (type === "ADMIN_NOTIFICATION") {
    subject = "🆕 New Booking Received | BHS";
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
          email: process.env.MAIL_FROM,
          name: "BHS Travels",
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
      }
    );

    console.log(`✅ Mail sent → ${to} [${type}]`);
  } catch (err) {
    console.error("❌ Mail error:", err.response?.data || err.message);
  }
};
