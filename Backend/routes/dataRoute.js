import express from 'express';
import { dataInsert, getAllEmployees, getDataStats, getEmployeesByRegion, getTransactions } from '../controllers/dataController.js';
import { verifyAdmin, verifyRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/employees', verifyAdmin, getEmployeesByRegion); 
router.post('/data', verifyAdmin, dataInsert); 
router.get('/list', verifyAdmin, getTransactions);              
router.get('/data-stats', verifyAdmin, getDataStats); 
router.get('/all-employees', verifyRoles("admin", "cio", "ceo"), getAllEmployees);             

export default router;