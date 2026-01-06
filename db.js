// models/db.js
const mysql = require("mysql2/promise");
require("dotenv").config();

const dbUrl = new URL(process.env.MYSQL_URL);

const pool = mysql.createPool({
  host: dbUrl.hostname,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.replace("/", ""),
  port: dbUrl.port || 3306,
});

module.exports = pool;
