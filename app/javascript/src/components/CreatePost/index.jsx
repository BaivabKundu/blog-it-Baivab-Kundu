import React, { useEffect, useState } from "react";

import { Typography } from "@bigbinary/neetoui";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import categoriesApi from "apis/categories";
import postsApi from "apis/posts";
import usersApi from "apis/users";

import PostForm from "./Form";

const CreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState();

  const history = useHistory();

  const handleSubmit = async values => {
    setLoading(true);
    try {
      const response = await usersApi.fetch();
      const defaultUser = response.data.users[0];

      const category_ids = values.new_post_categories.map(
        category => category.value
      );

      const postData = {
        ...values,
        assigned_user_id: defaultUser.id,
        assigned_organization_id: defaultUser.assigned_organization_id,
        category_ids,
      };

      await postsApi.create(postData);
      history.push("/blogs");
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesApi.fetch();

      const categories_posts = response.data.categories;

      setCategories(
        categories_posts.map(category => ({
          label: category.category_name,
          value: category.id,
        }))
      );
      setLoading(false);
    } catch (error) {
      logger.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="mx-24 w-auto gap-y-8 px-4 py-8">
      <Typography className="text-5xl font-bold text-gray-800">
        New blog post
      </Typography>
      <div className="flex-grow-1 mt-10 border-2 px-10 py-6">
        <PostForm
          categories={categories}
          handleSubmit={handleSubmit}
          loading={loading}
          type="create"
          initialValues={{
            title: "",
            description: "",
            new_post_categories: [],
          }}
          onCancel={() => history.push("/blogs")}
        />
      </div>
    </div>
  );
};

export default CreatePost;
