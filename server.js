require("dotenv").config();
const app = require("./app");
const { initDB } = require("./db");
const { getTransporter } = require("./mailer"); // nodemailer setup file


const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await initDB();
    console.log("✅ DB ready");

    const mailer = getTransporter();
    await mailer.verify();
    console.log("✅ Mail server connected");


    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ DB init failed", err);
    process.exit(1);
  }
})();
