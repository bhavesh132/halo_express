import haloAxios from "../utils/haloClient.js";

export const onlineAgentService = async () => {
  try {
    // 1) Online agents → normalized Agent_IDs (strings)
    const { data: onlineAgents } = await haloAxios.post("/OnlineStatus", [
      { fetch_all: true },
    ]);
    const onlineIdSet = new Set(
      (onlineAgents ?? [])
        .map((a) => a.techID) // adjust if property differs
        .filter((v) => v !== null && v !== undefined)
        .map((v) => String(v).trim())
    );
    if (onlineIdSet.size === 0) return [];

    // 2) Agent → Bamboo mapping (SQL report)
    const query = `
      SELECT DISTINCT 
          agent.unum AS [Agent_ID],
          agent.uname AS [Agent_Name],
          l.fvalue AS [Work_Role],
          usmtp AS [Email],
          u.CFEmployeeCode AS [Employee_Code],
          u.CFBambooEmployeeID AS [Bamboo_ID]
      FROM UNAME agent
      LEFT JOIN Users u ON u.uemail = agent.usmtp
      LEFT JOIN Lookup l ON agent.CFWorkRole = l.fcode AND fid = 182
      WHERE agent.CFWorkRole IS NOT NULL 
        AND l.fvalue NOT IN ('Non Billable','MDE','Dispatch','RMM Admin Services')
        AND u.uinactive = 'False'
    `;

    const { data: reportResp } = await haloAxios.post("/report", [
      { sql: query, _loadreportonly: true },
    ]);
    const rows = reportResp?.report?.rows ?? [];

    // 3) Filter by online set and collect Bamboo_IDs
    const bambooIds = Array.from(
      new Set(
        rows
          .filter((r) => onlineIdSet.has(String(r.Agent_ID).trim()))
          .map((r) => String(r.Bamboo_ID ?? "").trim())
          .filter((id) => id.length > 0)
      )
    );

    return bambooIds; // e.g. ["123","453","3256","1354"]
  } catch (error) {
    console.error("Error in onlineAgentService", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return [];
  }
};
