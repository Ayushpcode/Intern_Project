import express from "express"
import cors from "cors"
import {initPool}  from "./config/oracledb.js";
import dotenv from 'dotenv'
import authRoute from './routes/authRoute.js'
import adminRoute  from './routes/adminRoute.js'
import dataRoute  from './routes/dataRoute.js'
dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());

app.use('/api/auth',authRoute )
app.use('/api/admin', adminRoute )
app.use('/api/transaction', dataRoute )

const port = process.env.PORT;

initPool().then(() =>{
 app.listen(port, () =>{
    console.log(`Server in running on ${port}` );
    
}) 
})

