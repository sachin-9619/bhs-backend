const nodemailer = require("nodemailer");

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: true,
    auth: {
      user: "9fa352001@smtp-brevo.com",
      pass: "qWBYAN0QM723bl1j",
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 15000,
  });

  return transporter;
}

exports.sendBookingMail = async (to, data, type = "CONFIRMATION") => {
  if (!to) return;

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
    `;
  }

  try {
    const mailer = getTransporter();

    await mailer.sendMail({
      from: `"BHS Travels" <${process.env.ADMIN_EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log(`✅ Mail sent → ${to} [${type}]`);
  } catch (err) {
    console.error("❌ Mail failed:", err.message);
  }
};
