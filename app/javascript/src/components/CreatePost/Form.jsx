import React from "react";

import { Button, Typography } from "@bigbinary/neetoui";
import {
  Input,
  Textarea,
  Select,
  Form as NeetoUIForm,
} from "@bigbinary/neetoui/formik";
import PropTypes from "prop-types";

import { validationSchema } from "utils/validationSchema";

const Form = ({
  type,
  initialValues,
  handleSubmit,
  onCancel,
  loading,
  categories,
}) => (
  <NeetoUIForm
    formikProps={{
      initialValues,
      validationSchema,
      onSubmit: values => handleSubmit(values),
    }}
  >
    <div className="w-full">
      <div className="space-y-2">
        <Typography>Title</Typography>
        <Input required name="title" placeholder="Enter title" size="large" />
        <Select
          isMulti
          name="new_post_categories"
          options={categories}
          placeholder="Select categories"
        />
        <Typography>Description</Typography>
        <Textarea
          required
          maxLength={10000}
          name="description"
          placeholder="Enter description"
          rows={10}
        />
        <div className="flex justify-end space-x-2">
          <Button
            className="rounded-md bg-black px-4 py-3 text-white transition-colors hover:bg-gray-800"
            label={type === "create" ? "Create Post" : "Update Post"}
            loading={loading}
            type="submit"
          />
          <Button
            className="rounded-md px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100"
            label="Cancel"
            style="text"
            onClick={onCancel}
          />
        </div>
      </div>
    </div>
  </NeetoUIForm>
);

Form.propTypes = {
  type: PropTypes.oneOf(["create", "update"]),
  initialValues: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};
export default Form;
