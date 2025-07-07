import haloAxios from "../utils/haloClient.js";

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
