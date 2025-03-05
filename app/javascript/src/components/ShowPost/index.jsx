import React, { useEffect, useState } from "react";

import { Typography, Tag, Avatar } from "@bigbinary/neetoui";
import { format } from "date-fns";
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
          <div className="flex space-x-2">
            {post.categories.map(category => (
              <Tag
                className="border-none bg-green-100 px-2 py-1 text-black"
                key={category.id}
                label={category.category_name}
              />
            ))}
          </div>
          <Typography className="text-3xl font-semibold">
            {post?.title}
          </Typography>
          <div className="ml-2 flex items-center space-x-5">
            <Avatar size="large" />
            <div className="flex flex-col">
              <Typography className="text-black-500 font-md">
                {post.assigned_user?.username}
              </Typography>
              <Typography className="text-gray-500">
                {format(new Date(post.created_at), "dd MMMM yyyy")}
              </Typography>
            </div>
          </div>
          <Typography className="ml-2 mt-5">{post?.description}</Typography>
        </div>
      </div>
    </div>
  );
};

export default Show;
