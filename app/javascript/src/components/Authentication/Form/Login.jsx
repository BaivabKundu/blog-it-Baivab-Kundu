import React from "react";

import { Button, Typography } from "@bigbinary/neetoui";
import { Input, Form as NeetoUIForm } from "@bigbinary/neetoui/formik";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

import { loginSchema } from "utils/validationSchema";

const Login = ({ handleSubmit, initialValues, loading }) => (
  <div
    className="flex min-h-screen items-center justify-center bg-gray-50
    px-4 py-12 sm:px-6 lg:px-8 "
  >
    <div className="w-full max-w-md">
      <Typography
        className="mt-6 text-center text-3xl font-extrabold
        leading-9 text-gray-700"
      >
        Sign in
      </Typography>
      <div className="text-center">
        <Link
          to="/signup"
          className="focus:outline-none mt-2 text-center text-sm
            font-medium text-bb-purple transition duration-150
            ease-in-out focus:underline"
        >
          Or register now
        </Link>
      </div>
      <NeetoUIForm
        formikProps={{
          initialValues,
          loginSchema,
          onSubmit: values => handleSubmit(values),
        }}
      >
        <div className="w-full">
          <div className="space-y-2">
            <Typography>Email</Typography>
            <Input
              required
              name="email"
              placeholder="Enter email"
              size="medium"
            />
            <Typography>Password</Typography>
            <Input
              required
              name="password"
              placeholder="********"
              size="medium"
              type="password"
            />
            <Button
              className="w-full justify-center px-4 py-3"
              label="Sign in"
              loading={loading}
              type="submit"
            />
          </div>
        </div>
      </NeetoUIForm>
    </div>
  </div>
);

export default Login;
