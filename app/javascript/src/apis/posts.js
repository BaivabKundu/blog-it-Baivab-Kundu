import axios from "axios";

const fetch = (params = {}) => axios.get("/api/v1/posts", { params });

const show = slug => axios.get(`/api/v1/posts/${slug}`);

const create = payload =>
  axios.post("/api/v1/posts", {
    post: payload,
  });

const update = (slug, payload) =>
  axios.put(`/api/v1/posts/${slug}`, {
    post: payload,
  });

const postsApi = { fetch, show, create, update };

export default postsApi;
