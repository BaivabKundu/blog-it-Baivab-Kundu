import React, { useState, useEffect } from "react";

import authApi from "apis/auth";
import organizationsApi from "apis/organizations";
import SignupForm from "components/Authentication/Form/Signup";

const Signup = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const [organizations, setOrganizations] = useState();

  const handleSubmit = async values => {
    setLoading(true);
    try {
      await authApi.signup({
        username: values.username,
        email: values.email,
        password: values.password,
        password_confirmation: values.password_confirmation,
        assigned_organization_id: values.assigned_organization_id.value,
      });
      setLoading(false);
      history.push("/blogs");
    } catch (error) {
      logger.error(error);
      setLoading(false);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const {
        data: { organizations },
      } = await organizationsApi.fetch();

      setOrganizations(organizations);
      setLoading(false);
    } catch (error) {
      logger.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  return (
    <SignupForm
      handleSubmit={handleSubmit}
      loading={loading}
      organizations={organizations}
      initialValues={{
        username: "",
        email: "",
        assigned_organization_id: null,
        password: "",
        password_confirmation: "",
      }}
    />
  );
};

export default Signup;
