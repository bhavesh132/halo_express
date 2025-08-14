import bambooAxios from "../utils/bambooClient.js";
import haloAxios from "../utils/haloClient.js";
import { onlineAgentService } from "../services/agentService.js";

export const getOnlineAgents = async (req, res) => {
  try {
    const response = await haloAxios.post("/OnlineStatus", [
      {
        fetch_all: true,
      },
    ]);

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Halo API Error", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    res.status(500).json({ error: `Failed to fetch online agents ${error}` });
  }
};

export const getAgentListbyID = async (req, res) => {
  const query =
    "SELECT unum as id, uname as agent_name from Uname JOIN LOOKUP v on uname.CFWorkRole = v.fcode AND fid = 182 WHERE v.fcode in (1,2,3,4)";
  try {
    const response = await haloAxios.post("/report", [
      {
        sql: query,
        _loadreportonly: true,
      },
    ]);

    res.status(200).json(response.data.report.rows);
  } catch (error) {
    console.error("Halo API Error", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    res.status(500).json({ error: `Failed to fetch online agents ${error}` });
  }
};

export const agentLogins = async (req, res) => {
  const toYmd = (d) => d.toISOString().slice(0, 10);
  try {
    // 1) Get the list of Bamboo IDs from your modular service
    const bambooIdsRaw = await onlineAgentService(); // already filtered & mapped
    const bambooIds = Array.from(
      new Set((bambooIdsRaw ?? []).filter(Boolean).map(String))
    );

    if (bambooIds.length === 0) {
      return res.status(200).json({
        employeeIds: [],
        start: null,
        end: null,
        timesheetEntries: [],
      });
    }

    // 2) Time window: now ± 9h (converted to YYYY-MM-DD)
    const now = new Date();
    const startDt = new Date(now.getTime() - 9 * 60 * 60 * 1000);
    const endDt = new Date(now.getTime() + 9 * 60 * 60 * 1000);

    let start = toYmd(startDt);
    let end = toYmd(endDt);
    if (start > end) [start, end] = [end, start];

    // 3) BambooHR API call
    const { data } = await bambooAxios.get("time_tracking/timesheet_entries", {
      params: {
        start,
        end,
        employeeIds: bambooIds.join(","),
      },
    });

    return res.status(200).json({
      employeeIds: bambooIds,
      start,
      end,
      timesheetEntries: data,
    });
  } catch (err) {
    const status = err.response?.status || 500;
    console.error("agentLogins error", {
      status,
      data: err.response?.data,
      message: err.message,
    });
    return res.status(status).json({
      status,
      error: "failed to get data",
      message: err.message,
    });
  }
};
