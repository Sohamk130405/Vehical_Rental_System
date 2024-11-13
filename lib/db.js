// lib/db.js
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
export const db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function executeQuery(query, values = []) {
  const [rows] = await db.execute(query, values);
  return rows;
}

export async function getUserByEmail(email) {
  const users = await executeQuery("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return users[0];
}

export async function verifyPassword(password1, password2) {
  console.log(password1);
  console.log(password2);
  const isPasswordCorrect = await bcrypt.compare(password1, password2);

  return isPasswordCorrect;
}
