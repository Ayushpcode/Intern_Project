import express from 'express'
import {changePassword, checkAuth, checkStatus, login, logout, register} from '../controllers/authController.js';
import { verifyAdmin, verifyRoles } from '../middlewares/authMiddleware.js';


const route = express.Router();
route.post('/register', register)
route.post("/login", login)
route.patch("/change-password", changePassword)
route.get("/status", checkStatus);
route.get('/check-auth', checkAuth) 
route.post('/logout', logout)


export default route;