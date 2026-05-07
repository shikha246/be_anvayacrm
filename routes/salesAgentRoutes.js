import express from "express";
import { createAgent,getAgents,updateAgent,deleteAgent,} from "../controllers/salesAgentController.js";

const router = express.Router();

router.post("/agents", createAgent);
router.get("/agents", getAgents);
// Update
router.put("/agents/:id", updateAgent);

// Delete
router.delete("/agents/:id", deleteAgent);
export default router;