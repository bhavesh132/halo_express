import axios from "axios";
import "dotenv/config";

const API_KEY = process.env.BAMBOOHR_API_KEY;

const bambooAxios = axios.create({
  baseURL: "https://api.bamboohr.com/api/gateway.php/itbd/v1/",
  headers: {
    Accept: "application/json",
  },
  auth: {
    username: API_KEY,
    password: "x",
  },
});

export const getEmployeeDirectory = async () => {
  try {
    const response = await bambooAxios.get("employees/directory");
    console.log(response.data);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
  }
};

export default bambooAxios;
