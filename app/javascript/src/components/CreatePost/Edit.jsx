import React, { useEffect, useState } from "react";

import { ExternalLink, MenuHorizontal } from "@bigbinary/neeto-icons";
import {
  Typography,
  Button,
  ActionDropdown,
  Dropdown,
} from "@bigbinary/neetoui";
import { useHistory, useParams } from "react-router-dom";

import categoriesApi from "apis/categories";
import postsApi from "apis/posts";

import PostForm from "./Form";

const EditPost = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [count, setCount] = useState(0);
  const [post, setPost] = useState({});
  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    new_post_categories: [],
  });
  const [selectedOption, setSelectedOption] = useState("Publish");

  const { slug } = useParams();
  const history = useHistory();

  const handleSubmit = async values => {
    setLoading(true);
    try {
      const category_ids = values.new_post_categories.map(
        category => category.value
      );

      const postData = {
        ...values,
        status: selectedOption === "Save as draft" ? "draft" : "published",
        category_ids,
      };

      await postsApi.update(slug, postData);
      history.push(`/posts/${slug}/show`);
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPostDetails = async () => {
    try {
      const {
        data: { post },
      } = await postsApi.show(slug);

      const newInitialValues = {
        title: post.title,
        description: post.description,
        new_post_categories: post.categories.map(category => ({
          label: category.category_name,
          value: category.id,
        })),
      };

      setPost(post);
      setInitialValues(newInitialValues);
      setCount(prevCount => prevCount + 1);
    } catch (error) {
      logger.error(error);
      history.push("/blogs");
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
    } catch (error) {
      logger.error(error);
    }
  };

  const deletePost = async () => {
    try {
      await postsApi.destroy(slug);
      history.push("/blogs");
    } catch (error) {
      logger.error(error);
    }
  };

  const handleChange = values => {
    setPost({
      ...post,
      title: values.title,
      description: values.description,
      categories: values.new_post_categories.map(category => ({
        id: category.value,
        category_name: category.label,
      })),
    });
  };

  useEffect(() => {
    if (count === 2) {
      return;
    }

    const fetchData = async () => {
      try {
        await Promise.all([fetchPostDetails(), fetchCategories()]);
      } catch (error) {
        logger.error(error);
        history.push("/blogs");
      }
    };

    fetchData();
  }, [count]);

  return (
    <div className="mx-24 w-auto gap-y-8 px-4 py-8">
      <div className="flex items-center justify-between">
        <Typography className="text-5xl font-bold text-gray-800">
          Edit blog post
        </Typography>
        <div className="flex">
          <Button
            icon={ExternalLink}
            style="text"
            onClick={() => {
              localStorage.setItem("previewPost", JSON.stringify(post));
              window.open(`/posts/${slug}/preview`, "_blank");
            }}
          />
          <Button
            className="mx-2 rounded-md px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100"
            label="Cancel"
            style="secondary"
            onClick={() => history.push("/blogs")}
          />
          <ActionDropdown
            buttonStyle="text"
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
          <Dropdown buttonStyle="text" icon={MenuHorizontal}>
            <Button
              className="w-full"
              label="Delete"
              style="danger-text"
              onClick={deletePost}
            />
          </Dropdown>
        </div>
      </div>
      <div className="flex-grow-1 mt-10 border-2 px-10 py-6">
        {count === 2 && (
          <PostForm
            categories={categories}
            handleSubmit={handleSubmit}
            initialValues={initialValues}
            loading={loading}
            type="update"
            onChange={handleChange}
          />
        )}
      </div>
    </div>
  );
};

export default EditPost;
