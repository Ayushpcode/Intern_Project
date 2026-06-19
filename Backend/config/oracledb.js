import oracledb from "oracledb";
import dotenv from 'dotenv'

dotenv.config();

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const poolConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING,
  poolMin: 2,
  poolMax: 10,
  poolIncrement: 1,
}

export async function initPool(){
    try {
        await oracledb.createPool(poolConfig);
        console.log('Oracle connection pool created');
        
    } catch (error) {
        console.error('Failed to create Oracle pool', error.message);
        process.exit(1);
        
    }
}

export function getPool(){
    return oracledb.getPool();
}