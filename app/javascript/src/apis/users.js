import axios from "axios";

const fetch = () => axios.get("/api/v1/users");

const usersApi = {
  fetch,
};

export default usersApi;
