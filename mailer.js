const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// 🔥 VERY IMPORTANT (debug)
transporter.verify((err, success) => {
  if (err) {
    console.error("❌ Mail server error:", err);
  } else {
    console.log("✅ Mail server ready");
  }
});

exports.sendBookingMail = async (to, data, type = "CONFIRMATION") => {
  try {
    let subject = "";
    let html = "";

    if (type === "CONFIRMATION") {
      subject = "🎫 Bus Ticket Confirmation";
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
        <p>Thank you for booking with BHS Travels 🙏</p>
      `;
    } else if (type === "ADMIN_NOTIFICATION") {
  subject = "🆕 New Booking Received";
  html = `
    <h2>New Booking</h2>
    <p><b>Customer:</b> ${data.userName}</p>
    <p><b>Email:</b> ${data.email}</p>
    <p><b>Phone:</b> ${data.phone}</p>
    <p><b>Bus:</b> ${data.busName}</p>
    <p><b>From:</b> ${data.departure}</p>
    <p><b>To:</b> ${data.destination}</p>
    <p><b>Seats:</b> ${data.seats}</p>
    <p><b>Amount:</b> ₹${data.amount}</p>
    <p><b>Departure:</b> ${data.departureTime}</p>
  `;
}

    await transporter.sendMail({
      from: `"BHS Travels" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`✅ Mail sent to: ${to} (${type})`);
  } catch (err) {
    console.error("❌ Mail sending failed:", err);
    throw err; // Important: so caller knows mail failed
  }
};
