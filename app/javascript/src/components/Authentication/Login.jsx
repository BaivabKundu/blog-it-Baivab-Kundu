import React, { useState } from "react";

import authApi from "apis/auth";
import { setAuthHeaders } from "apis/axios";
import LoginForm from "components/Authentication/Form/Login";
import { setToLocalStorage } from "utils/storage";

const Login = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async values => {
    setLoading(true);
    try {
      const response = await authApi.login({
        email: values.email,
        password: values.password,
      });

      setToLocalStorage({
        authToken: response.data.authentication_token,
        email: values.email.toLowerCase(),
        userId: response.data.id,
        userName: response.data.username,
      });
      setAuthHeaders();
      window.location.href = "/blogs";
      setLoading(false);
    } catch (error) {
      logger.error(error);
      setLoading(false);
    }
  };

  return (
    <LoginForm
      handleSubmit={handleSubmit}
      loading={loading}
      initialValues={{
        email: "",
        password: "",
      }}
    />
  );
};

export default Login;
