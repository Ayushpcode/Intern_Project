import express from 'express';
import { dataInsert, deleteTransaction, getAllEmployees, getDataStats, getEmployeesByRegion, getTransactions, updateEmployee } from '../controllers/dataController.js';
import { verifyAdmin, verifyRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/employees', verifyAdmin, getEmployeesByRegion); 
router.post('/data', verifyAdmin, dataInsert); 
router.get('/list', verifyRoles("admin", "cio", "ceo"), getTransactions);              
router.get('/data-stats', verifyAdmin, getDataStats); 
router.get('/all-employees', verifyRoles("admin", "cio", "ceo"), getAllEmployees); 
router.delete('/transaction/:trx_id',verifyAdmin,  deleteTransaction);
router.put("/employee/:emp_id",verifyAdmin, updateEmployee);            

export default router;