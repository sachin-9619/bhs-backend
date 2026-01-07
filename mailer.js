const nodemailer = require("nodemailer");

let transporter; // 🔥 lazy init

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    connectionTimeout: 7000,
    greetingTimeout: 7000,
    socketTimeout: 7000,
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
      <p><b>Name:</b> ${data.user_name}</p>
      <p><b>Bus:</b> ${data.busName}</p>
      <p><b>From:</b> ${data.departure}</p>
      <p><b>To:</b> ${data.destination}</p>
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
      <p><b>Customer:</b> ${data.user_name}</p>
      <p><b>Email:</b> ${data.email}</p>
      <p><b>Phone:</b> ${data.phone}</p>
      <p><b>Bus:</b> ${data.busName}</p>
      <p><b>Route:</b> ${data.departure} → ${data.destination}</p>
      <p><b>Amount:</b> ₹${data.amount}</p>
    `;
  }

  try {
    const mailer = getTransporter();

    await Promise.race([
      mailer.sendMail({
        from: `"BHS Travels" <${process.env.MAIL_USER}>`,
        to,
        subject,
        html,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("SMTP timeout")), 8000)
      ),
    ]);

    console.log(`✅ Mail sent → ${to} [${type}]`);
  } catch (err) {
    console.error("❌ Mail skipped:", err.message);
    // 🔥 NEVER throw
  }
};
