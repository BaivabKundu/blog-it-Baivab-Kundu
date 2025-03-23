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

const destroy = slug => axios.delete(`/api/v1/posts/${slug}`);

const vote = (slug, voteType) =>
  axios.post(`/api/v1/posts/${slug}/vote`, { vote_type: voteType });

const generatePdf = slug => axios.post(`/api/v1/posts/${slug}/report`, {});

const downloadPdf = slug =>
  axios.get(`/api/v1/posts/${slug}/report/download`, { responseType: "blob" });

const postsApi = {
  fetch,
  show,
  create,
  update,
  destroy,
  vote,
  generatePdf,
  downloadPdf,
};

export default postsApi;
