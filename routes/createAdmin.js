const bcrypt = require("bcrypt");
const mysql = require("mysql2/promise");

async function createAdmin() {
  const db = await mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Sachin@4511",
    database: "bhstravels",
  });

  const username = "admin";
  const plainPassword = "admin123";

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  await db.query("INSERT INTO admins (username, password) VALUES (?, ?)", [
    username,
    hashedPassword,
  ]);

  console.log("Admin created!");
  process.exit();
}

createAdmin();
