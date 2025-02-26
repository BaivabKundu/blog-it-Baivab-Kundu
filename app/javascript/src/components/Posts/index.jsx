import React, { useState, useEffect } from "react";

import { Typography } from "@bigbinary/neetoui";
import { format } from "date-fns";
import { isNil, isEmpty, either } from "ramda";

import postsApi from "apis/posts";
import PageLoader from "components/commons/PageLoader";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const {
        data: { posts },
      } = await postsApi.fetch();
      setPosts(posts);
      setLoading(false);
    } catch (error) {
      logger.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  if (either(isNil, isEmpty)(posts)) {
    return (
      <Typography className="my-5 text-center text-xl leading-5">
        You have not created or been assigned any posts.
      </Typography>
    );
  }

  logger.log(posts);

  return (
    <div className="w-full px-4 py-8">
      <Typography className="mb-8 text-5xl font-bold text-gray-800">
        Blog posts
      </Typography>
      <div className="space-y-8">
        {posts.map(post => (
          <article className="group" key={post.id}>
            <section className="block space-y-2 hover:no-underline">
              <Typography className="text-xl font-bold text-gray-800 group-hover:text-blue-600">
                {post.title}
              </Typography>
              <Typography className="text-gray-600">
                {post.description}
              </Typography>
              <Typography className="text-gray-500">
                {format(new Date(post.created_at), "dd MMMM yyyy")}
              </Typography>
            </section>
            <hr className="my-4" />
          </article>
        ))}
      </div>
    </div>
  );
};

export default Posts;
