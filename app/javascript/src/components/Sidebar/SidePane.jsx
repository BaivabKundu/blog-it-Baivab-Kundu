import React, { useEffect, useState } from "react";

import { AddCircle, Search } from "@bigbinary/neeto-icons";
import { Button, Input, Typography, Checkbox } from "@bigbinary/neetoui";
import classnames from "classnames";

import categoriesApi from "apis/categories";

import FilterModal from "./FilterModal";

const SidePane = ({ isOpen, onCategorySearch, onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [categorySearched, setCategorySearched] = useState("");

  const fetchCategories = async () => {
    try {
      const { data } = await categoriesApi.fetch();
      setCategories(data.categories);
    } catch (error) {
      logger.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async categoryName => {
    try {
      await categoriesApi.create({
        category_name: categoryName,
      });
      fetchCategories();
    } catch (error) {
      logger.error("Error creating category:", error);
    }
  };

  const handleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleCategoryClick = categoryName => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryName)) {
        return prev.filter(name => name !== categoryName);
      }

      return [...prev, categoryName];
    });
  };

  useEffect(() => {
    onCategorySelect(selectedCategories);
    onCategorySearch(categorySearched);
  }, [categorySearched, selectedCategories]);

  return (
    <div
      className={classnames(
        "h-screen overflow-hidden bg-gray-100 shadow-lg transition-all duration-300 ease-in-out",
        {
          "w-0": !isOpen,
          "w-80": isOpen,
        }
      )}
    >
      <div className="h-full">
        <div className="flex flex-col">
          <div className="mt-10 flex items-center justify-between p-4">
            <Typography className="text-xl font-semibold">
              Categories
            </Typography>
            <div className="flex space-x-1">
              <Button
                icon={() => <Search />}
                style="text"
                onClick={handleSearch}
              />
              <Button
                icon={() => <AddCircle />}
                style="text"
                onClick={() => setIsModalOpen(true)}
              />
            </div>
          </div>
          {isSearchOpen && (
            <Input
              className="mx-3"
              label="Search category"
              value={categorySearched}
              onChange={event => setCategorySearched(event.target.value)}
            />
          )}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              <Typography className="text-gray-500">
                Filter by categories
              </Typography>
              {categories.map(category => (
                <Checkbox
                  checked={selectedCategories.includes(category.category_name)}
                  className="p-2"
                  key={category.id}
                  label={category.category_name}
                  onChange={() => handleCategoryClick(category.category_name)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <FilterModal
          isOpen={isModalOpen}
          onAddCategory={handleAddCategory}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default SidePane;
