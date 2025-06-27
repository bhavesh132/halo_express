import express from "express";
import {
  getOnlineAgents,
  getAgentListbyID,
} from "../controllers/agentController.js";

const router = express.Router();

router.get("/online-agents", getOnlineAgents);

router.get("/agent_listbyID", getAgentListbyID);

export default router;
