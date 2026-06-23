import express from "express";
import { approveEmployee, getPendingEmployees, rejectEmployee } from "../controllers/adminController.js";
import { verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protected routes - JWT required (add approval APIs here later)
router.get("/pending", verifyAdmin, getPendingEmployees);
router.post("/approve/:id", verifyAdmin, approveEmployee);
router.delete("/reject/:id", verifyAdmin, rejectEmployee);

export default router;