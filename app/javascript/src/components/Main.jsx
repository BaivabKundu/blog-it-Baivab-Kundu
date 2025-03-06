import React, { useState } from "react";

import classnames from "classnames";
import { Route, Switch } from "react-router-dom";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { ToastContainer } from "react-toastify";

import Signup from "components/Authentication/Signup";
import CreatePost from "components/CreatePost";
import Lists from "components/Lists";
import BlogPosts from "components/Posts";
import ShowPost from "components/ShowPost";
import Sidebar from "components/Sidebar";

const App = () => {
  const [categorySearched, setCategorySearched] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleCategorySearch = searchTerm => {
    setCategorySearched(searchTerm);
  };

  const handleCategorySelect = categories => {
    setSelectedCategories(categories);
  };

  const handleSidepane = isSidepaneOpen => {
    setIsSidebarOpen(isSidepaneOpen);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <ToastContainer />
      <Sidebar
        onCategorySearch={handleCategorySearch}
        onCategorySelect={handleCategorySelect}
        onSidebarOpen={handleSidepane}
      />
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
          <Route exact component={CreatePost} path="/posts/create" />
          <Route exact component={ShowPost} path="/posts/:slug" />
          <Route
            exact
            path="/blogs"
            render={() => (
              <BlogPosts
                categorySearched={categorySearched}
                selectedCategories={selectedCategories}
              />
            )}
          />
          <Route exact component={Lists} path="/lists" />
          <Route exact component={Signup} path="/signup" />
          <Redirect path="*" to="/blogs" />
        </Switch>
      </div>
    </div>
  );
};

export default App;
