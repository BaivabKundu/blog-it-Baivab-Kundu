import React, { useState } from "react";

import { Delete } from "@bigbinary/neeto-icons";
import { ActionDropdown, Alert, Button, Typography } from "@bigbinary/neetoui";

const BulkAction = ({ onBulkStatusChange, onBulkDelete }) => {
  const [shouldShowDeleteAlert, setShouldShowDeleteAlert] = useState(false);

  const handleDelete = () => {
    setShouldShowDeleteAlert(true);
  };

  return (
    <div className="flex items-center">
      <ActionDropdown
        buttonStyle="secondary"
        className="mr-3"
        label="Change status"
      >
        <div className="flex flex-col" onClick={e => e.stopPropagation()}>
          <Button
            label="Draft"
            style="text"
            onClick={() => onBulkStatusChange("Draft")}
          />
          <Button
            label="Published"
            style="text"
            onClick={() => onBulkStatusChange("Published")}
          />
        </div>
      </ActionDropdown>
      <Button
        icon={Delete}
        label="Delete"
        style="danger-text"
        onClick={handleDelete}
      />
      <Alert
        isOpen={shouldShowDeleteAlert}
        submitButtonLabel="Delete"
        title="Delete post(s)?"
        message={
          <Typography>Do you want to delete the selected post(s)?</Typography>
        }
        onClose={() => setShouldShowDeleteAlert(false)}
        onSubmit={onBulkDelete}
      />
    </div>
  );
};

export default BulkAction;
