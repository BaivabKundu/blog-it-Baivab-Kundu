import axios from "axios";

const fetch = (params = {}) => axios.get("/api/v1/categories", { params });

const create = payload =>
  axios.post("/api/v1/categories", { category: payload });

const categoriesApi = { fetch, create };

export default categoriesApi;
