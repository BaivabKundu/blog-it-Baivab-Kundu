import React, { useState } from "react";

import { Input, Pane, Select, Typography, Button } from "@bigbinary/neetoui";

const FilterPane = ({
  isOpen,
  onClose,
  categories,
  onApplyFilters,
  currentFilters = {},
}) => {
  const [title, setTitle] = useState(currentFilters.title || "");
  const [selectedCategories, setSelectedCategories] = useState(
    currentFilters.category_names
      ? currentFilters.category_names.map(name => ({
          label: name,
          value: name,
        }))
      : []
  );

  const [status, setStatus] = useState(
    currentFilters.status
      ? {
          label: currentFilters.status === "draft" ? "Draft" : "Published",
          value: currentFilters.status,
        }
      : null
  );

  const statusOptions = [
    { label: "Draft", value: "draft" },
    { label: "Published", value: "published" },
  ];

  const categoryOptions = categories.map(category => ({
    label: category,
    value: category,
  }));

  const handleApplyFilters = () => {
    const filters = {
      title: title || undefined,
      category_names:
        selectedCategories.length > 0
          ? selectedCategories.map(category => category.value)
          : undefined,
      status: status ? status.value : undefined,
    };

    onApplyFilters(filters);
    onClose();
  };

  const handleClearFilters = () => {
    setTitle("");
    setSelectedCategories([]);
    setStatus(null);
    onApplyFilters({});
    onClose();
  };

  return (
    <Pane isOpen={isOpen} onClose={onClose}>
      <Pane.Header>
        <Typography className="text-2xl font-bold">Filters</Typography>
      </Pane.Header>
      <Pane.Body>
        <div className="w-full">
          <div className="space-y-2">
            <Typography className="text-md font-bold">Title</Typography>
            <Input
              placeholder="Enter title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <Typography className="text-md font-bold">Category</Typography>
            <Select
              isMulti
              options={categoryOptions}
              placeholder="Select categories"
              value={selectedCategories}
              onChange={setSelectedCategories}
            />
            <Typography className="text-md font-bold">Status</Typography>
            <Select
              options={statusOptions}
              placeholder="Select status"
              value={status}
              onChange={setStatus}
            />
          </div>
        </div>
      </Pane.Body>
      <Pane.Footer className="flex items-center space-x-2">
        <Button
          className="bg-black px-5 text-white"
          label="Done"
          style="text"
          onClick={handleApplyFilters}
        />
        <Button
          className="px-5"
          label="Clear filters"
          style="text"
          onClick={handleClearFilters}
        />
      </Pane.Footer>
    </Pane>
  );
};

export default FilterPane;
