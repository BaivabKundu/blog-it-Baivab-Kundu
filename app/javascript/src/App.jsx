import React from "react";

import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { ToastContainer } from "react-toastify";

import BlogPosts from "components/BlogPosts";
import Lists from "components/Lists";

const App = () => (
  <Router>
    <ToastContainer />
    <Switch>
      <Route exact component={BlogPosts} path="/blogs" />
      <Route exact component={Lists} path="/lists" />
      <Redirect path="*" to="/blogs" />
    </Switch>
  </Router>
);

export default App;
