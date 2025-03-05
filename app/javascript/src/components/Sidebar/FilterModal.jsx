import React from "react";

import { Button, Modal, Input, Typography } from "@bigbinary/neetoui";

const FilterModal = ({ isOpen, onClose, onAddCategory }) => {
  const [filter, setFilter] = React.useState({
    search: "",
  });

  const handleApply = () => {
    if (filter.search.trim()) {
      onAddCategory(filter.search);
      setFilter({ search: "" });
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} size="medium" onClose={onClose}>
      <Modal.Header>
        <Typography className="text-2xl font-bold">New category</Typography>
      </Modal.Header>
      <Modal.Body>
        <Input
          label="Category title"
          value={filter.search}
          onChange={e => setFilter({ search: e.target.value })}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="rounded-md bg-black text-white transition-colors hover:bg-gray-800"
          label="Add"
          onClick={handleApply}
        />
        <Button label="Cancel" style="text" onClick={onClose} />
      </Modal.Footer>
    </Modal>
  );
};

export default FilterModal;
