import mysql from "mysql2/promise";


if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing from environment variables.");
}

// Create the connection pool once and export it
export const db_pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10, 
  queueLimit: 0,
});