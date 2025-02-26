import axios from "axios";

const fetch = () => axios.get("/posts");

const postsApi = { fetch };

export default postsApi;
