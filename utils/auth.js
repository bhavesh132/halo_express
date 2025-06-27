import axios from "axios";

const getHaloToken = async (tokenURL) => {
  try {
    const tokenResponse = await axios.post(
      tokenURL,
      {
        grant_type: "client_credentials",
        client_id: process.env.HALO_CLIENT_ID,
        client_secret: process.env.HALO_CLIENT_SECRET,
        scope: "all",
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return tokenResponse.data;
  } catch (err) {
    console.log(err);
  }
};

export default getHaloToken;
