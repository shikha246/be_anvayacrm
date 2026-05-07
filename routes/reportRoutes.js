

import express from "express";
import { getReports } from "../controllers/reportController.js";

const router = express.Router();

router.get("/reports", getReports);

export default router;