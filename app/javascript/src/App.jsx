import React from "react";

import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { ToastContainer } from "react-toastify";

import CreatePost from "components/CreatePost";
import Lists from "components/Lists";
import BlogPosts from "components/Posts";
import ShowPost from "components/ShowPost";
import Sidebar from "components/Sidebar";

const App = () => (
  <Router>
    <ToastContainer />
    <Sidebar />
    <Switch>
      <Route exact component={ShowPost} path="/posts/:slug/show" />
      <Route exact component={CreatePost} path="/posts/create" />
      <Route exact component={BlogPosts} path="/blogs" />
      <Route exact component={Lists} path="/lists" />
      <Redirect path="*" to="/blogs" />
    </Switch>
  </Router>
);

export default App;
