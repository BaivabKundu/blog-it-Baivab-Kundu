import React, { useState } from "react";

import { Typography } from "@bigbinary/neetoui";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import postsApi from "apis/posts";

import PostForm from "./Form";

const CreatePost = () => {
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const handleSubmit = async values => {
    setLoading(true);
    try {
      await postsApi.create(values);
      history.push("/blogs");
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-24 w-auto gap-y-8 px-4 py-8">
      <Typography className="text-5xl font-bold text-gray-800">
        New blog post
      </Typography>
      <div className="flex-grow-1 mt-10 border-2 px-10 py-6">
        <PostForm
          handleSubmit={handleSubmit}
          initialValues={{ title: "", description: "" }}
          loading={loading}
          type="create"
          onCancel={() => history.push("/blogs")}
        />
      </div>
    </div>
  );
};

export default CreatePost;
