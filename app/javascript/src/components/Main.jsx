import React, { useState } from "react";

import classnames from "classnames";
import { either, isEmpty, isNil } from "ramda";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { ToastContainer } from "react-toastify";

import { Signup, Login } from "components/Authentication";
import PrivateRoute from "components/commons/PrivateRoute";
import CreatePost from "components/CreatePost";
import EditPost from "components/CreatePost/Edit";
import PreviewPost from "components/CreatePost/Preview";
import Lists from "components/Lists";
import BlogPosts from "components/Posts";
import ShowPost from "components/ShowPost";
import Sidebar from "components/Sidebar";
import { getFromLocalStorage } from "utils/storage";

const App = () => {
  const [categorySearched, setCategorySearched] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showUserPosts, setShowUserPosts] = useState(false);

  const authToken = getFromLocalStorage("authToken");
  const isLoggedIn = !either(isNil, isEmpty)(authToken);

  const handleCategorySearch = searchTerm => {
    setCategorySearched(searchTerm || "");
  };

  const handleCategorySelect = categories => {
    setSelectedCategories(categories || []);
  };

  const handleSidepane = isSidepaneOpen => {
    setIsSidebarOpen(isSidepaneOpen || false);
  };

  const handleUserPosts = value => {
    setShowUserPosts(value);
  };

  return (
    <Router>
      <div className="flex h-screen w-full overflow-hidden">
        <ToastContainer />
        {!["/login", "/signup"].includes(window.location.pathname) && (
          <Sidebar
            onCategorySearch={handleCategorySearch}
            onCategorySelect={handleCategorySelect}
            onShowUserPosts={handleUserPosts}
            onSidebarOpen={handleSidepane}
          />
        )}
        <div
          className={classnames(
            "flex-1 overflow-auto transition-all duration-300 ease-in-out",
            {
              "ml-80": isSidebarOpen,
              "ml-0": !isSidebarOpen,
            }
          )}
        >
          <Switch>
            <Route exact component={PreviewPost} path="/posts/:slug/preview" />
            <Route exact component={ShowPost} path="/posts/:slug/show" />
            <Route exact component={EditPost} path="/posts/:slug/edit" />
            <Route exact component={CreatePost} path="/posts/create" />
            <PrivateRoute
              exact
              condition={isLoggedIn}
              path="/blogs"
              redirectRoute="/login"
              render={() => (
                <BlogPosts
                  categorySearched={categorySearched}
                  selectedCategories={selectedCategories}
                  showUserPosts={showUserPosts}
                />
              )}
            />
            <Route exact component={Lists} path="/lists" />
            <Route exact component={Login} path="/login">
              {isLoggedIn ? <Redirect to="/blogs" /> : <Login />}
            </Route>
            <Route exact component={Signup} path="/signup" />
            <Redirect path="*" to="/blogs" />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
