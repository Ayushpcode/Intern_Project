import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getPool } from "../config/oracledb.js";
import { sendApprovalEmail } from "../config/emailService.js";

async function generateEmpId(connection, name) {
  const initials = name.trim().split(" ")[0].slice(0, 3).toUpperCase();

  const result = await connection.execute(
    `SELECT emp_id FROM employee
     WHERE emp_id LIKE :prefix
     ORDER BY id DESC
     FETCH FIRST 1 ROWS ONLY`,
    { prefix: `${initials}-%` }
  );

  if (result.rows.length === 0) {
    return `${initials}-1001`;
  }

  const lastId = result.rows[0].EMP_ID;
  const lastNum = parseInt(lastId.split("-")[1], 10);
  return `${initials}-${lastNum + 1}`;
}

export const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required!",
    });
  }

  let connection;
  try {
    connection = await getPool().getConnection();

    const result = await connection.execute(
      `SELECT admin_id, username, password FROM admin WHERE username = :username`,
      { username: username.trim() }
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const admin = result.rows[0];

    const isMatch = await bcrypt.compare(password, admin.PASSWORD);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const token = jwt.sign(
      { admin_id: admin.ADMIN_ID, username: admin.USERNAME },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
    });

  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  } finally {
    if (connection) await connection.close();
  }
};

export const getPendingEmployees = async (req, res) => {
  let connection;
  try {
    connection = await getPool().getConnection();

    const result = await connection.execute(
      `SELECT id, emp_name, dob, email, created_at
       FROM employee
       WHERE status = 'PENDING'
       ORDER BY created_at ASC`
    );

    return res.status(200).json({
      success: true,
      data: result.rows,
    });

  } catch (error) {
    console.error("Get pending error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  } finally {
    if (connection) await connection.close();
  }
};

export const approveEmployee = async (req, res) => {
  const { id } = req.params;
  const { role, region } = req.body;

  if (!role || !region) {
    return res.status(400).json({
      success: false,
      message: "Role and region are required.",
    });
  }

  const validRoles = ["ADMIN", "CEO", "CIO", "EMPLOYEE"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      message: "Invalid role. Allowed: ADMIN, CEO, CIO, EMPLOYEE",
    });
  }

  let connection;
  try {
    connection = await getPool().getConnection();

    const result = await connection.execute(
      `SELECT id, emp_name, email FROM employee
       WHERE id = :id AND status = 'PENDING'`,
      { id }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Employee not found or already processed.",
      });
    }

    const employee = result.rows[0];

    const empId = await generateEmpId(connection, employee.EMP_NAME);

    const tempPassword = `Temp@${Math.random().toString(36).slice(-6).toUpperCase()}`;
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    await connection.execute(
      `UPDATE employee
       SET emp_id           = :empId,
           role             = :role,
           region           = :region,
           password         = :password,
           is_temp_password = 1,
           status           = 'ACTIVE'
       WHERE id = :id`,
      {
        empId,
        role,
        region: region.trim(),
        password: hashedPassword,
        id,
      },
      { autoCommit: true }
    );

    await sendApprovalEmail(employee.EMAIL, empId, tempPassword);

    return res.status(200).json({
      success: true,
      message: `Employee approved! Credentials sent to ${employee.EMAIL}`,
      data: {
        emp_id: empId,
        name: employee.EMP_NAME,
        role,
        region,
      },
    });

  } catch (error) {
    console.error("Approve error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  } finally {
    if (connection) await connection.close();
  }
};

export const rejectEmployee = async (req, res) => {
  const { id } = req.params;

  let connection;
  try {
    connection = await getPool().getConnection();

    const result = await connection.execute(
      `SELECT id, emp_name, email FROM employee
       WHERE id = :id AND status = 'PENDING'`,
      { id }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Employee not found or already processed.",
      });
    }

    await connection.execute(
      `UPDATE employee SET status = 'REJECTED' WHERE id = :id`,
      { id },
      { autoCommit: true }
    );

    return res.status(200).json({
      success: true,
      message: "Employee registration rejected.",
    });

  } catch (error) {
    console.error("Reject error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  } finally {
    if (connection) await connection.close();
  }
};