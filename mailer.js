const nodemailer = require("nodemailer");

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 465,              // ✅ CHANGE
    secure: true,           // ✅ REQUIRED for 465
    auth: {
      user: "apikey",       // 🔥 Brevo rule
      pass: process.env.SMTP_PASS, // xsmtpsib-xxxx
    },
    connectionTimeout: 20000,
    socketTimeout: 20000,
  });

  return transporter;
}

// ================= SEND MAIL =================
exports.sendBookingMail = async (to, data, type = "CONFIRMATION") => {
  if (!to) return;

  let subject = "";
  let html = "";

  // ===== USER CONFIRMATION =====
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

  // ===== ADMIN NOTIFICATION =====
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
    const mailer = getTransporter();

    // ❌ verify() REMOVE (Render pe timeout deta hai)
    await mailer.sendMail({
      from: `"BHS Travels" <${process.env.MAIL_FROM}>`,
      to,
      subject,
      html,
    });

    console.log(`✅ Mail sent → ${to} [${type}]`);
  } catch (err) {
    console.error("❌ Mail failed:", err.message);
  }
};
