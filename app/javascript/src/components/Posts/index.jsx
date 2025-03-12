import React, { useState, useEffect } from "react";

import { MenuHorizontal } from "@bigbinary/neeto-icons";
import {
  Typography,
  Button,
  Table as NeetoTable,
  Tooltip,
  Dropdown,
} from "@bigbinary/neetoui";
import { format } from "date-fns";
import { isNil, isEmpty, either } from "ramda";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

import postsApi from "apis/posts";
import PageLoader from "components/commons/PageLoader";

const Posts = ({ categorySearched, selectedCategories, showUserPosts }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const handleSelect = selectedRowKeys => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const handleDelete = async slug => {
    try {
      await postsApi.destroy(slug);
    } catch (error) {
      logger.error(error);
    }
  };

  const handlePublish = async (slug, status) => {
    try {
      const postData = {
        ...posts,
        status: status === "Published" ? "draft" : "published",
      };

      await postsApi.update(slug, postData);

      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.slug === slug
            ? {
                ...post,
                status: status === "Published" ? "Draft" : "Published",
              }
            : post
        )
      );
    } catch (error) {
      logger.error(error);
    }
  };

  const { Menu, MenuItem, Divider } = Dropdown;
  const { Button: MenuButton } = MenuItem;

  const columns = [
    {
      dataIndex: "title",
      key: "title",
      title: "Title",
      render: (text, record) => (
        <Tooltip content={text} position="top">
          <Link
            className="block max-w-xs truncate"
            to={`/posts/${record.slug}/show`}
          >
            {text.length > 30 ? `${text.slice(0, 30)}...` : text}
          </Link>
        </Tooltip>
      ),
      width: 250,
    },
    {
      dataIndex: "categories",
      key: "categories",
      title: "Category",
      width: 200,
    },
    {
      dataIndex: "updated_at",
      key: "updated_at",
      title: "Last published at",
      width: 200,
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      width: 150,
    },
    {
      dataIndex: "action",
      key: "action",
      title: "Action",
      render: (_, record) => (
        <Dropdown
          buttonStyle="text"
          icon={MenuHorizontal}
          position="bottom-end"
          strategy="fixed"
        >
          <Menu>
            <MenuItem>
              <MenuButton
                className="text-black"
                style="link"
                onClick={() => handlePublish(record.slug, record.status)}
              >
                {record.status === "Published" ? "Unpublish" : "Publish"}
              </MenuButton>
            </MenuItem>
            <Divider />
            <MenuItem>
              <MenuButton
                label="Delete"
                style="danger"
                type="delete"
                onClick={() => handleDelete(record.slug)}
              >
                Delete
              </MenuButton>
            </MenuItem>
          </Menu>
        </Dropdown>
      ),
      width: 100,
    },
  ];

  const fetchPosts = async () => {
    try {
      const params = {
        category_name: categorySearched,
        category_names: selectedCategories,
        show_user_posts: showUserPosts,
      };

      const {
        data: { posts },
      } = await postsApi.fetch(params);

      const postValues = posts.map(post => ({
        ...post,
        categories: post.categories
          .map(category => category.category_name)
          .join(", "),
        updated_at: format(new Date(post.updated_at), "dd MMMM yyyy HH:MM"),
        status: post.status === "published" ? "Published" : "Draft",
      }));

      setPosts(postValues);
      setLoading(false);
    } catch (error) {
      logger.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [categorySearched, selectedCategories, showUserPosts]);

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
        You have not created any posts.
      </Typography>
    );
  }

  return (
    <div className="ml-24 w-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <Typography className="text-5xl font-bold text-gray-800">
          {showUserPosts ? "My blog posts" : "Blog posts"}
        </Typography>
        <Link to="/posts/create">
          <Button className="mr-10 rounded-lg bg-black px-4 py-3 text-white hover:bg-gray-800">
            Create Post
          </Button>
        </Link>
      </div>
      <Typography className="mb-5 text-lg font-bold">
        {posts.length} articles
      </Typography>
      <NeetoTable
        rowSelection
        columns={columns}
        dataSource={posts}
        selectedRowKeys={selectedRowKeys}
        onRowSelect={handleSelect}
      />
    </div>
  );
};

export default Posts;
