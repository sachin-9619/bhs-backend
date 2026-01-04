const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS, // Gmail App Password
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
});

/**
 * ❌ DO NOT verify() on Railway / production
 * Gmail SMTP timeout causes app issues
 */
if (process.env.NODE_ENV !== "production") {
  transporter.verify((err) => {
     if (err) console.error("Mail verify error:", err);
     else console.log("Mail server ready");
   });
 }

exports.sendBookingMail = async (to, data, type = "CONFIRMATION") => {
  let subject = "";
  let html = "";

  if (type === "CONFIRMATION") {
    subject = "🎫 Bus Ticket Confirmation - BHS Travels";
    html = `
      <h2>Booking Confirmed 🎉</h2>
      <p><b>Name:</b> ${data.userName}</p>
      <p><b>Bus:</b> ${data.busName}</p>
      <p><b>From:</b> ${data.departure}</p>
      <p><b>To:</b> ${data.destination}</p>
      <p><b>Seats:</b> ${data.seats}</p>
      <p><b>Amount:</b> ₹${data.amount}</p>
      <p><b>Departure Time:</b> ${data.departureTime}</p>
      <br/>
      <p>Thank you for booking with <b>BHS Travels</b> 🙏</p>
    `;
  }

  if (type === "ADMIN_NOTIFICATION") {
    subject = "🆕 New Booking Received - BHS";
    html = `
      <h2>New Booking Alert</h2>
      <p><b>Customer:</b> ${data.userName}</p>
      <p><b>Email:</b> ${data.email}</p>
      <p><b>Phone:</b> ${data.phone}</p>
      <p><b>Bus:</b> ${data.busName}</p>
      <p><b>Route:</b> ${data.departure} → ${data.destination}</p>
      <p><b>Seats:</b> ${data.seats}</p>
      <p><b>Amount:</b> ₹${data.amount}</p>
      <p><b>Departure:</b> ${data.departureTime}</p>
    `;
  }

  try {
    await transporter.sendMail({
      from: `"BHS Travels" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`✅ Mail sent → ${to} [${type}]`);
  } catch (err) {
    console.error("❌ Mail failed (ignored):", err.message);
    // ❌ DO NOT throw → booking must not fail
  }
};
