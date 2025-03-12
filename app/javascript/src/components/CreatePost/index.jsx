import React, { useEffect, useState } from "react";

import { ActionDropdown, Button, Typography } from "@bigbinary/neetoui";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import categoriesApi from "apis/categories";
import postsApi from "apis/posts";
import usersApi from "apis/users";
import { getFromLocalStorage } from "utils/storage";

import PostForm from "./Form";

const CreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState();
  const [selectedOption, setSelectedOption] = useState("Publish");

  const history = useHistory();

  const handleSubmit = async values => {
    setLoading(true);
    try {
      const authUserId = getFromLocalStorage("authUserId");
      const response = await usersApi.fetch();
      const defaultUser = response.data.users.find(
        user => user.id === authUserId
      );

      const category_ids = values.new_post_categories.map(
        category => category.value
      );

      const postData = {
        ...values,
        status: selectedOption === "Save as draft" ? "draft" : "published",
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
      <div className="flex items-center justify-between">
        <Typography className="text-5xl font-bold text-gray-800">
          New blog post
        </Typography>
        <div className="flex">
          <Button
            className="mr-3 rounded-md px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100"
            label="Cancel"
            style="secondary"
            onClick={() => history.push("/blogs")}
          />
          <ActionDropdown
            buttonStyle="secondary"
            // className="rounded-l-md bg-black px-4 py-3 text-white"
            label={selectedOption}
            loading={loading}
            onClick={() => document.querySelector("form").requestSubmit()}
          >
            <div className="flex flex-col">
              <Button
                label="Publish"
                style="secondary"
                onClick={() => setSelectedOption("Publish")}
              />
              <Button
                label="Save as draft"
                style="secondary"
                onClick={() => setSelectedOption("Save as draft")}
              />
            </div>
          </ActionDropdown>
        </div>
      </div>
      <div className="flex-grow-1 mt-10 border-2 px-10 py-6">
        <PostForm
          categories={categories}
          handleSubmit={handleSubmit}
          initialValues={{
            title: "",
            description: "",
            new_post_categories: [],
          }}
        />
      </div>
    </div>
  );
};

export default CreatePost;
