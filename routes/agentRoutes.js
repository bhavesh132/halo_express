import express from "express";
import {
  getOnlineAgents,
  getAgentListbyID,
  agentLogins,
} from "../controllers/agentController.js";

import { getEmployeeDirectory } from "../utils/bambooClient.js";

const router = express.Router();

router.get("/online-agents", getOnlineAgents);

router.get("/agent_listbyID", getAgentListbyID);

router.get("/agent/bambooLogin", agentLogins);

router.get("/agent/directory", getEmployeeDirectory);

export default router;
