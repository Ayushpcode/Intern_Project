import express from 'express'
import {changePassword, checkStatus, login, register} from '../controllers/authController.js';
import { verifyAdmin, verifyRoles } from '../middlewares/authMiddleware.js';


const route = express.Router();
route.post('/register', register)
route.post("/login", login)
route.patch("/change-password", changePassword)
route.get("/status", checkStatus);


export default route;