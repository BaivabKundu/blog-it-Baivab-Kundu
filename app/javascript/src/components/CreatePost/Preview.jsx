import React, { useState, useEffect } from "react";

import { Typography, Tag, Avatar } from "@bigbinary/neetoui";
import { format } from "date-fns";

import PageLoader from "components/commons/PageLoader";

const Preview = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const previewPost = JSON.parse(localStorage.getItem("previewPost"));

      if (previewPost) {
        setPost(previewPost);
      } else {
        logger.error("No preview data found in localStorage");
      }
    } catch (error) {
      logger.error("Error retrieving preview data:", error);
    } finally {
      setLoading(false);
    }

    return () => {
      localStorage.removeItem("previewPost");
    };
  }, []);

  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem("previewPost");
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="ml-24 w-auto px-4 py-8">
      <Typography className="mb-8 text-4xl font-bold text-gray-800">
        Preview mode
      </Typography>
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

export default Preview;
