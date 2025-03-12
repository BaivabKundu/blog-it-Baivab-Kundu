import React, { useEffect, useState } from "react";

import { Edit } from "@bigbinary/neeto-icons";
import { Typography, Tag, Avatar, Button } from "@bigbinary/neetoui";
import { format } from "date-fns";
import { useHistory, useParams, Link } from "react-router-dom";

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
        <div className="flex w-full flex-col gap-y-2">
          <div className="flex space-x-2">
            {post.categories.map(category => (
              <Tag
                className="border-none bg-green-100 px-2 py-1 text-black"
                key={category.id}
                label={category.category_name}
              />
            ))}
          </div>
          <div className="flex justify-between pr-10">
            <div className="flex">
              <Typography className="mr-5 text-3xl font-semibold">
                {post?.title}
              </Typography>
              {post.status === "draft" && (
                <Tag
                  className="my-2 border-none px-2 py-1 text-black"
                  label={post.status}
                  style="danger"
                />
              )}
            </div>
            <Link to={`/posts/${post.slug}/edit`}>
              <Button
                icon={Edit}
                size="large"
                style="text"
                tooltipProps={{
                  content: "Edit",
                  position: "top",
                }}
              />
            </Link>
          </div>
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
