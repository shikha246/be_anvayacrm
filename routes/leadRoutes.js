import express from "express";
import {
  createLead,
  getLeads,
  getLeadStats,
  getLeadById,
  updateLead,
  deleteLead,
} from "../controllers/leadController.js";

const router = express.Router();



router.post("/leads", createLead);
router.get("/leads", getLeads);
router.get("/leads/stats", getLeadStats);
router.get("/leads/:id", getLeadById);
// router.patch("/leads/:id", updateLead);
router.delete("/leads/:id", deleteLead);
router.put("/leads/:id", updateLead);
export default router;