import axios from "axios";

const fetch = () => axios.get("/api/v1/organizations");

const organizationsApi = {
  fetch,
};

export default organizationsApi;
