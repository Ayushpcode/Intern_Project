import OracleDB from 'oracledb';
import { getPool } from '../config/oracledb.js';

export const getEmployeesByRegion = async (req, res) => {
    const { region } = req.query;

    if (!region) {
        return res.status(400).json({
            success: false,
            message: 'Region is required'
        });
    }

    let connection;
    try {
        connection = await getPool().getConnection();

        const result = await connection.execute(
            `SELECT emp_id, emp_name 
             FROM employee 
             WHERE UPPER(region) = UPPER(:region) 
             AND status = 'ACTIVE'
             ORDER BY emp_name`,
            { region: region.trim() },
            { outFormat: OracleDB.OUT_FORMAT_OBJECT }
        );

        return res.status(200).json({
            success: true,
            employees: result.rows.map(emp => ({
                emp_id: emp.EMP_ID,
                emp_name: emp.EMP_NAME
            }))
        });

    } catch (error) {
        console.error('Oracle DB error:', error);
        return res.status(500).json({
            success: false,
            message: 'Database error',
            error: error.message
        });
    } finally {
        if (connection) await connection.close();
    }
};

export const dataInsert = async (req, res) => {
    const {
        emp_id,                         // ← ab body se aayega (admin selected employee)
        region, deport, acc_number,
        acc_name, trx_date, invoice_number,
        volume, value
    } = req.body;

    // Validation
    const requiredFields = { emp_id, region, deport, acc_number, acc_name, trx_date, invoice_number, volume, value };
    const missing = Object.keys(requiredFields).filter(key => !requiredFields[key]);

    if (missing.length > 0) {
        return res.status(400).json({
            success: false,
            message: `Missing required fields: ${missing.join(', ')}`
        });
    }

    let connection;
    try {
        connection = await getPool().getConnection();

        // Step 1: fetch emp_name from selected emp_id
        const empResult = await connection.execute(
            `SELECT emp_name FROM employee 
             WHERE emp_id = :emp_id AND status = 'ACTIVE'`,
            { emp_id },
            { outFormat: OracleDB.OUT_FORMAT_OBJECT }
        );

        if (empResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Selected employee not found or not active'
            });
        }

        const emp_name = empResult.rows[0].EMP_NAME;

        // Step 2: insert record
        const result = await connection.execute(
            `INSERT INTO data (
                region, deport, acc_number,
                acc_name, trx_date, invoice_number,
                volume, value, emp_name
            ) VALUES (
                :region, :deport, :acc_number,
                :acc_name, TO_DATE(:trx_date, 'YYYY-MM-DD'), :invoice_number,
                :volume, :value, :emp_name
            )`,
            {
                region:         String(region),
                deport:         String(deport),
                acc_number:     Number(acc_number),
                acc_name:       String(acc_name),
                trx_date:       String(trx_date),
                invoice_number: Number(invoice_number),
                volume:         Number(volume),
                value:          Number(value),
                emp_name
            },
            { autoCommit: true }
        );

        return res.status(201).json({
            success: true,
            message: 'Record inserted successfully',
            rowsAffected: result.rowsAffected
        });

    } catch (error) {
        console.error('Oracle DB error:', error);

        if (error.errorNum === 1) {
            return res.status(409).json({
                success: false,
                message: 'Duplicate record — invoice_number already exists'
            });
        }
        if (error.errorNum === 1438) {
            return res.status(400).json({
                success: false,
                message: 'A numeric value exceeds the allowed column size'
            });
        }
        if (error.errorNum === 1861) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format — expected YYYY-MM-DD'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Database error',
            error: error.message
        });

    } finally {
        if (connection) await connection.close();
    }
};

export const getTransactions = async (req, res) => {
    let connection;
    try {
        connection = await getPool().getConnection();

        const result = await connection.execute(
            `SELECT 
                region, deport, acc_number,
                acc_name, trx_date, invoice_number,
                volume, value, emp_name
             FROM data
             ORDER BY trx_date DESC`,
            {},
            { outFormat: OracleDB.OUT_FORMAT_OBJECT }
        );

        return res.status(200).json({
            success: true,
            transactions: result.rows.map(row => ({
                region:         row.REGION,
                deport:         row.DEPORT,
                acc_number:     row.ACC_NUMBER,
                acc_name:       row.ACC_NAME,
                trx_date:       row.TRX_DATE,
                invoice_number: row.INVOICE_NUMBER,
                volume:         row.VOLUME,
                value:          row.VALUE,
                emp_name:       row.EMP_NAME,
            }))
        });

    } catch (error) {
        console.error('Oracle DB error:', error);
        return res.status(500).json({
            success: false,
            message: 'Database error',
            error: error.message
        });
    } finally {
        if (connection) await connection.close();
    }
};

export const getDataStats = async (req, res) => {
  let connection;
  try {
    connection = await getPool().getConnection();

    const [empResult, dataResult, pendingResult, lastMonthResult] = await Promise.all([
      // Total employees (non-admin)
      connection.execute(
        `SELECT COUNT(*) AS TOTAL_EMPLOYEES 
         FROM employee 
         WHERE LOWER(role) != 'admin'`,
        {},
        { outFormat: OracleDB.OUT_FORMAT_OBJECT }
      ),
      // Total transactions, volume, value
      connection.execute(
        `SELECT 
          COUNT(*)    AS TOTAL_TRANSACTIONS,
          SUM(volume) AS TOTAL_VOLUME,
          SUM(value)  AS TOTAL_VALUE
         FROM data`,
        {},
        { outFormat: OracleDB.OUT_FORMAT_OBJECT }
      ),
      // Total pending
      connection.execute(
        `SELECT COUNT(*) AS TOTAL_PENDING
         FROM employee
         WHERE status = 'PENDING'`,
        {},
        { outFormat: OracleDB.OUT_FORMAT_OBJECT }
      ),
      // Last month vs this month comparison
      connection.execute(
        `SELECT
          -- Employees this month vs last month
          COUNT(CASE WHEN TRUNC(created_at, 'MM') = TRUNC(SYSDATE, 'MM') THEN 1 END) AS EMP_THIS_MONTH,
          COUNT(CASE WHEN TRUNC(created_at, 'MM') = ADD_MONTHS(TRUNC(SYSDATE, 'MM'), -1) THEN 1 END) AS EMP_LAST_MONTH
         FROM employee
         WHERE LOWER(role) != 'admin'`,
        {},
        { outFormat: OracleDB.OUT_FORMAT_OBJECT }
      ),
      
    ]);

    // Data this month vs last month
    const [dataThisMonth, dataLastMonth] = await Promise.all([
      connection.execute(
        `SELECT 
          COUNT(*)    AS TOTAL_TRANSACTIONS,
          SUM(volume) AS TOTAL_VOLUME,
          SUM(value)  AS TOTAL_VALUE
         FROM data
         WHERE TRUNC(trx_date, 'MM') = TRUNC(SYSDATE, 'MM')`,
        {},
        { outFormat: OracleDB.OUT_FORMAT_OBJECT }
      ),
      connection.execute(
        `SELECT 
          COUNT(*)    AS TOTAL_TRANSACTIONS,
          SUM(volume) AS TOTAL_VOLUME,
          SUM(value)  AS TOTAL_VALUE
         FROM data
         WHERE TRUNC(trx_date, 'MM') = ADD_MONTHS(TRUNC(SYSDATE, 'MM'), -1)`,
        {},
        { outFormat: OracleDB.OUT_FORMAT_OBJECT }
      ),
    ]);

   const calcChange = (current, previous) => {
  if (!previous || previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
};

    const empThis  = lastMonthResult.rows[0].EMP_THIS_MONTH  || 0;
    const empLast  = lastMonthResult.rows[0].EMP_LAST_MONTH  || 0;
    const trxThis  = dataThisMonth.rows[0].TOTAL_TRANSACTIONS || 0;
    const trxLast  = dataLastMonth.rows[0].TOTAL_TRANSACTIONS || 0;
    const volThis  = dataThisMonth.rows[0].TOTAL_VOLUME       || 0;
    const volLast  = dataLastMonth.rows[0].TOTAL_VOLUME       || 0;
    const valThis  = dataThisMonth.rows[0].TOTAL_VALUE        || 0;
    const valLast  = dataLastMonth.rows[0].TOTAL_VALUE        || 0;

    return res.status(200).json({
      success: true,
      totalEmployees:       empResult.rows[0].TOTAL_EMPLOYEES     || 0,
      totalTransactions:    dataResult.rows[0].TOTAL_TRANSACTIONS  || 0,
      totalVolume:          dataResult.rows[0].TOTAL_VOLUME        || 0,
      totalValue:           dataResult.rows[0].TOTAL_VALUE         || 0,
      totalPending:         pendingResult.rows[0].TOTAL_PENDING    || 0,
      employeeChange:       calcChange(empThis, empLast),
      transactionChange:    calcChange(trxThis, trxLast),
      volumeChange:         calcChange(volThis, volLast),
      valueChange:          calcChange(valThis, valLast),
    });

  } catch (error) {
    console.error("Dashboard stats error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  } finally {
    if (connection) {
      try { await connection.close(); }
      catch (error) { console.error("Connection close error:", error); }
    }
  }
};

export const getAllEmployees = async (req, res) => {
  let connection;
  try {
    connection = await getPool().getConnection();

    const result = await connection.execute(
      `SELECT 
        emp_id, emp_name, email, role, 
        region, status, is_temp_password
       FROM employee
       ORDER BY emp_name`,
      {},
      { outFormat: OracleDB.OUT_FORMAT_OBJECT }
    );

    return res.status(200).json({
      success: true,
      employees: result.rows.map(emp => ({
        emp_id:           emp.EMP_ID,
        emp_name:         emp.EMP_NAME,
        email:            emp.EMAIL,
        role:             emp.ROLE,
        region:           emp.REGION,
        status:           emp.STATUS,
        is_temp_password: emp.IS_TEMP_PASSWORD,
      }))
    });

  } catch (error) {
    console.error("Get all employees error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  } finally {
    if (connection) await connection.close();
  }
};