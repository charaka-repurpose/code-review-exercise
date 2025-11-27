require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Add helper method for direct queries
pool.query = async function(sql) {
  const connection = await this.getConnection();
  try {
    const [results] = await connection.query(sql);
    connection.release();
    return [results];
  } catch (error) {
    connection.release();
    throw error;
  }
};

module.exports = pool;

