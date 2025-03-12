import React from "react";

import { Typography } from "@bigbinary/neetoui";
import {
  Input,
  Textarea,
  Select,
  Form as NeetoUIForm,
} from "@bigbinary/neetoui/formik";
import PropTypes from "prop-types";

import { validationSchema } from "utils/validationSchema";

const Form = ({ initialValues, handleSubmit, categories }) => (
  <NeetoUIForm
    formikProps={{
      initialValues,
      validationSchema,
      onSubmit: values => handleSubmit(values),
    }}
  >
    {({ values, handleChange, setFieldValue }) => (
      <div className="w-full">
        <div className="space-y-2">
          <Typography>Title</Typography>
          <Input
            required
            name="title"
            placeholder="Enter title"
            size="large"
            value={values.title}
            onChange={e => {
              setFieldValue("title", e.target.value);
              handleChange(e);
              initialValues.title = e.target.value;
            }}
          />
          <Select
            isMulti
            name="new_post_categories"
            options={categories}
            placeholder="Select categories"
            onChange={selectedOptions => {
              setFieldValue("new_post_categories", selectedOptions);
              initialValues.new_post_categories = selectedOptions;
            }}
          />
          <Typography>Description</Typography>
          <Textarea
            required
            maxLength={10000}
            name="description"
            placeholder="Enter description"
            rows={10}
            value={values.description}
            onChange={e => {
              setFieldValue("description", e.target.value);
              handleChange(e);
              initialValues.description = e.target.value;
            }}
          />
        </div>
      </div>
    )}
  </NeetoUIForm>
);

Form.propTypes = {
  initialValues: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};
export default Form;
