import axios from "axios";

const fetch = () => axios.get("/api/v1/posts");

const show = slug => axios.get(`/api/v1/posts/${slug}`);

const create = payload =>
  axios.post("/api/v1/posts", {
    post: payload,
  });

const postsApi = { fetch, show, create };

export default postsApi;
