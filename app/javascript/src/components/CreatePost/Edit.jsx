import React, { useEffect, useState } from "react";

import { Typography } from "@bigbinary/neetoui";
import { useHistory, useParams } from "react-router-dom";

import categoriesApi from "apis/categories";
import postsApi from "apis/posts";

import PostForm from "./Form";

const EditPost = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [count, setCount] = useState(0);
  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    new_post_categories: [],
  });

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
      <Typography className="text-5xl font-bold text-gray-800">
        Edit blog post
      </Typography>
      <div className="flex-grow-1 mt-10 border-2 px-10 py-6">
        {count === 2 && (
          <PostForm
            categories={categories}
            handleSubmit={handleSubmit}
            initialValues={initialValues}
            loading={loading}
            type="update"
            onCancel={() => history.push(`/posts/${slug}/show`)}
          />
        )}
      </div>
    </div>
  );
};

export default EditPost;
