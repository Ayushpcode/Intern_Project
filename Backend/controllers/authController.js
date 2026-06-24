import { getPool } from "../config/oracledb.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const login = async (req, res) => {
  const { emp_id, password } = req.body;

  if (!emp_id || !password) {
    return res.status(400).json({ success: false, message: "Employee ID and password are required." });
  }

  let connection;
  try {
    connection = await getPool().getConnection();

    const result = await connection.execute(
      `SELECT * FROM employee WHERE emp_id = :emp_id`,
      { emp_id: emp_id.trim() },
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const employee = result.rows[0];

    if (employee.STATUS !== "ACTIVE") {
      return res.status(403).json({ success: false, message: "Your account is not active. Contact admin." });
    }

    const isMatch = await bcrypt.compare(password, employee.PASSWORD);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    if (employee.IS_TEMP_PASSWORD === 1) {
      const tempToken = jwt.sign(
        { emp_id: employee.EMP_ID },
        process.env.JWT_SECRET,
        { expiresIn: "15m" },
      );

      res.cookie('token', tempToken, COOKIE_OPTIONS);
      
      return res.status(200).json({
        success: true,
        is_temp_password: true,
        message: "Please change your password first!",
        temp_token: tempToken,
      });
    }

    const token = jwt.sign(
      {
        id: employee.ID,
        emp_id: employee.EMP_ID,
        name: employee.EMP_NAME,
        role: employee.ROLE,
        region: employee.REGION,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    res.cookie('token', token, COOKIE_OPTIONS);

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      user: {
        emp_id: employee.EMP_ID,
        name: employee.EMP_NAME,
        role: employee.ROLE,
        region: employee.REGION,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  } finally {
    if (connection) await connection.close();
  }
};

export const register = async (req, res) => {
  const { name, dob, email } = req.body;

  if (!name || !dob || !email) {
    return res.status(400).json({ success: false, message: "Name, date of birth and email are required." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email format." });
  }

  let connection;
  try {
    connection = await getPool().getConnection();

    const checkResult = await connection.execute(
      `SELECT emp_id FROM employee WHERE LOWER(email) = LOWER(:email)`,
      { email: email.trim() },
    );

    if (checkResult.rows.length > 0) {
      return res.status(409).json({ success: false, message: "Email already registered." });
    }

    await connection.execute(
      `INSERT INTO employee (emp_name, dob, email, status) VALUES (:name, :dob, :email, 'PENDING')`,
      { name: name.trim(), dob: new Date(dob), email: email.toLowerCase().trim() },
      { autoCommit: true },
    );

    return res.status(201).json({
      success: true,
      message: "Registration request submitted. Waiting for admin approval.",
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  } finally {
    if (connection) await connection.close();
  }
};

export const changePassword = async (req, res) => {
  const { new_password, confirm_password } = req.body;

  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Access denied. No token provided." });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(403).json({ success: false, message: "Invalid or expired token." });
  }

  const emp_id = decoded.emp_id;

  console.log("Decoded token:", decoded); // ✅ yahan dekho
  console.log("emp_id:", decoded.emp_id);

  if (!new_password || !confirm_password) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  if (new_password !== confirm_password) {
    return res.status(400).json({ success: false, message: "Passwords do not match." });
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(new_password)) {
    return res.status(400).json({
      success: false,
      message: "Password must be 8+ characters with uppercase, lowercase, number and special character.",
    });
  }

  let connection;
  try {
    connection = await getPool().getConnection();

    const result = await connection.execute(
      `SELECT id, emp_id, emp_name, role, region FROM employee WHERE emp_id = :emp_id AND is_temp_password = 1`,
      { emp_id },
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Employee not found or password already changed." });
    }

    const employee = result.rows[0];
    const hashedPassword = await bcrypt.hash(new_password, 10);

    await connection.execute(
      `UPDATE employee SET password = :password, is_temp_password = 0 WHERE emp_id = :emp_id`,
      { password: hashedPassword, emp_id },
      { autoCommit: true },
    );

    const finalToken = jwt.sign(
      {
        id: employee.ID,
        emp_id: employee.EMP_ID,
        name: employee.EMP_NAME,
        role: employee.ROLE,
        region: employee.REGION,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    res.cookie('token', finalToken, COOKIE_OPTIONS);

    return res.status(200).json({
      success: true,
      message: "Password changed successfully!",
      user: {
        emp_id: employee.EMP_ID,
        name: employee.EMP_NAME,
        role: employee.ROLE,
        region: employee.REGION,
      },
    });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  } finally {
    if (connection) await connection.close();
  }
};

// ✅ Naya — cookie se token verify karo
export const checkAuth = async (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authenticated." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({
      success: true,
      user: {
        emp_id: decoded.emp_id,
        name: decoded.name,
        role: decoded.role,
        region: decoded.region,
      },
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
};

export const checkStatus = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email required." });
  }

  let connection;
  try {
    connection = await getPool().getConnection();

    const result = await connection.execute(
      `SELECT status FROM employee WHERE LOWER(email) = LOWER(:email)`,
      { email: email.trim() }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    return res.status(200).json({ success: true, status: result.rows[0].STATUS });
  } catch (error) {
    console.error("Status check error:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  } finally {
    if (connection) await connection.close();
  }
};

export const logout = (req, res) => {
  res.clearCookie('token', COOKIE_OPTIONS);
  return res.status(200).json({ success: true, message: "Logged out successfully." });
};