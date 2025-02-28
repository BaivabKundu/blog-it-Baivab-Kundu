import React, { useState, useEffect } from "react";

import { Typography, Button } from "@bigbinary/neetoui";
import { format } from "date-fns";
import { isNil, isEmpty, either } from "ramda";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

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

  return (
    <div className="ml-24 w-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <Typography className="text-5xl font-bold text-gray-800">
          Blog posts
        </Typography>
        <Link to="/posts/create">
          <Button className="mr-10 rounded-lg bg-black px-4 py-3 text-white hover:bg-gray-800">
            Create Post
          </Button>
        </Link>
      </div>
      <div className="space-y-8">
        {posts
          .sort(
            (post1, post2) =>
              new Date(post2.created_at) - new Date(post1.created_at)
          )
          .map(post => (
            <article className="group" key={post.id}>
              <section className="block space-y-2 hover:no-underline">
                <Link to={`/posts/${post.slug}/show`}>
                  <Typography className="text-xl font-bold text-gray-800 group-hover:text-blue-600">
                    {post.title}
                  </Typography>
                </Link>
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
