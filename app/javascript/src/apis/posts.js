import axios from "axios";

const fetch = () => axios.get("/api/v1/posts");

const postsApi = { fetch };

export default postsApi;
