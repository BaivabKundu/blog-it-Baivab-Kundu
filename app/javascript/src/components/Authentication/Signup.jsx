import React, { useState } from "react";

import authApi from "apis/auth";
import SignupForm from "components/Authentication/Form/Signup";

const Signup = ({ history }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async values => {
    setLoading(true);
    try {
      await authApi.signup({
        username: values.username,
        email: values.email,
        password: values.password,
        password_confirmation: values.password_confirmation,
      });
      setLoading(false);
      history.push("/");
    } catch (error) {
      logger.error(error);
      setLoading(false);
    }
  };

  return (
    <SignupForm
      handleSubmit={handleSubmit}
      loading={loading}
      initialValues={{
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
      }}
    />
  );
};

export default Signup;
