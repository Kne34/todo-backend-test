const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  waitForConnections: true,
  connectionLimit: 10,
});

async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
          id INT AUTO_INCREMENT PRIMARY KEY,
          text TEXT NOT NULL,
          done BOOLEAN NOT NULL DEFAULT FALSE
      )
    `);
    console.log("Database table 'todos' is ready.");
  } catch (error) {
    console.error("Database connection/initialization failed:", error.message);
  }
}

module.exports = { pool, initDb };
