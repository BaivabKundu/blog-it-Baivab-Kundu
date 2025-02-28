import React, { useEffect, useState } from "react";

import { Typography } from "@bigbinary/neetoui";
import { useHistory, useParams } from "react-router-dom";

import postsApi from "apis/posts";
import PageLoader from "components/commons/PageLoader";

const Show = () => {
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  const history = useHistory();

  const fetchPostDetails = async () => {
    try {
      const {
        data: { post },
      } = await postsApi.show(slug);
      setPost(post);
      setLoading(false);
    } catch (error) {
      logger.error(error);
      history.push("/blogs");
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="ml-24 w-auto px-4 py-8">
      <div className="mt-24 flex w-full items-start justify-between gap-x-6">
        <div className="flex flex-col gap-y-2">
          <Typography className="text-3xl font-semibold">
            {post?.title}
          </Typography>
          <Typography className="ml-2 mt-5">{post?.description}</Typography>
        </div>
      </div>
    </div>
  );
};

export default Show;
