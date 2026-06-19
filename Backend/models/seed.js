import bcrypt from "bcrypt";
import { initPool, getPool } from "../config/oracledb.js";
import dotenv from "dotenv";
dotenv.config();

const seedAdmin = async () => {
  await initPool();
  let connection;

  try {
    connection = await getPool().getConnection();

    // Check if admin already exists
    const check = await connection.execute(
      `SELECT admin_id FROM admin WHERE username = :username`,
      { username: "admin" }
    );

    if (check.rows.length > 0) {
      console.log("Admin already exists!");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    // Insert admin
    await connection.execute(
      `INSERT INTO admin (username, password) VALUES (:username, :password)`,
      { username: "admin", password: hashedPassword },
      { autoCommit: true }
    );

    console.log("✅ Default admin created!");
    console.log("Username: admin");
    console.log("Password: Admin@123");

  } catch (error) {
    console.error("Seed error:", error);
  } finally {
    if (connection) await connection.close();
    process.exit(0);
  }
};

seedAdmin();