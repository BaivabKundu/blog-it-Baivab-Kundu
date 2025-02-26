import React from "react";

import Posts from "components/Posts";
import Sidebar from "components/Sidebar";

const BlogPosts = () => (
  <div className="flex">
    <Sidebar />
    <main className="ml-24 flex-1">
      <Posts />
    </main>
  </div>
);

export default BlogPosts;
