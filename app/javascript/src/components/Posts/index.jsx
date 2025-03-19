import React, { useState, useEffect } from "react";

import { Filter, MenuHorizontal } from "@bigbinary/neeto-icons";
import {
  Typography,
  Button,
  Table as NeetoTable,
  Tooltip,
  Dropdown,
  ActionDropdown,
  Checkbox,
} from "@bigbinary/neetoui";
import { format } from "date-fns";
import { isNil, isEmpty, either } from "ramda";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

import postsApi from "apis/posts";
import PageLoader from "components/commons/PageLoader";

import BulkAction from "./BulkAction";
import FilterPane from "./FilterPane";

const Posts = ({ categorySearched, selectedCategories, showUserPosts }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isPaneOpen, setIsPaneOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    title: true,
    categories: true,
    updated_at: true,
    status: true,
    action: true,
  });
  const [filters, setFilters] = useState({});

  const handleSelect = selectedRowKeys => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const handleColumnVisibilityChange = columnKey => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  const handleDelete = async slug => {
    try {
      await postsApi.destroy(slug);
    } catch (error) {
      logger.error(error);
    }
  };

  const handleBulkStatusChange = async newStatus => {
    try {
      const postsToUpdate = posts.filter(
        post => selectedRowKeys.includes(post.id) && post.status !== newStatus
      );

      logger.log(postsToUpdate);

      if (postsToUpdate.length === 0) return;

      const updatePromises = postsToUpdate.map(post => {
        const postData = {
          ...post,
          status: newStatus === "Published" ? "published" : "draft",
        };

        return postsApi.update(post.slug, postData);
      });

      await Promise.all(updatePromises);

      setPosts(prevPosts =>
        prevPosts.map(post =>
          selectedRowKeys.includes(post.id) && post.status !== newStatus
            ? { ...post, status: newStatus }
            : post
        )
      );
    } catch (error) {
      logger.error(error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      const slugsToDelete = posts
        .filter(post => selectedRowKeys.includes(post.id))
        .map(post => post.slug);

      const deletePromises = slugsToDelete.map(slug => postsApi.destroy(slug));

      await Promise.all(deletePromises);

      setPosts(prevPosts =>
        prevPosts.filter(post => !selectedRowKeys.includes(post.id))
      );

      setSelectedRowKeys([]);
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

  const allColumns = [
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

  const columns = allColumns.filter(column => visibleColumns[column.key]);

  const fetchPosts = async () => {
    try {
      const params = {
        category_name: categorySearched,
        category_names: selectedCategories,
        show_user_posts: showUserPosts,
      };

      if (showUserPosts && !isEmpty(filters)) {
        params.filter = filters;
      }

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

  const filterCategories = Array.from(
    new Set(
      posts.flatMap(post =>
        post.categories
          .split(", ")
          .map(category => category.trim())
          .filter(category => category !== "")
      )
    )
  );

  const handleApplyFilters = newFilters => {
    setFilters(newFilters);
  };

  useEffect(() => {
    fetchPosts();
  }, [categorySearched, selectedCategories, showUserPosts, filters]);

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
      <div className="mb-8 flex items-center justify-between">
        <Typography className="mb-5 text-lg font-bold">
          {posts.length} articles
        </Typography>
        {showUserPosts && isEmpty(selectedRowKeys) && (
          <div className="flex items-center">
            <ActionDropdown
              buttonStyle="secondary"
              className="mr-3"
              label="Columns"
            >
              <div onClick={e => e.stopPropagation()}>
                <Checkbox checked disabled className="p-2" label="Title" />
                <Checkbox
                  checked={visibleColumns.categories}
                  className="p-2"
                  label="Category"
                  onChange={() => handleColumnVisibilityChange("categories")}
                />
                <Checkbox
                  checked={visibleColumns.updated_at}
                  className="p-2"
                  label="Last published at"
                  onChange={() => handleColumnVisibilityChange("updated_at")}
                />
                <Checkbox
                  checked={visibleColumns.status}
                  className="p-2"
                  label="Status"
                  onChange={() => handleColumnVisibilityChange("status")}
                />
              </div>
            </ActionDropdown>
            <Button
              icon={() => <Filter className="h-5 w-5" />}
              style="text"
              onClick={() => setIsPaneOpen(true)}
            />
          </div>
        )}
        {showUserPosts && !isEmpty(selectedRowKeys) && (
          <BulkAction
            onBulkDelete={handleBulkDelete}
            onBulkStatusChange={handleBulkStatusChange}
          />
        )}
      </div>
      <NeetoTable
        rowSelection
        columns={columns}
        dataSource={posts}
        selectedRowKeys={selectedRowKeys}
        onRowSelect={handleSelect}
      />
      {isPaneOpen && (
        <FilterPane
          categories={filterCategories}
          currentFilters={filters}
          isOpen={isPaneOpen}
          onApplyFilters={handleApplyFilters}
          onClose={() => setIsPaneOpen(false)}
        />
      )}
    </div>
  );
};

export default Posts;
