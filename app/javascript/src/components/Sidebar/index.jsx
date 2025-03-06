import React, { useState } from "react";

import { Book, Edit, Left, List, ListDetails } from "@bigbinary/neeto-icons";
import { Avatar, Button, Dropdown, Typography } from "@bigbinary/neetoui";
import { NavLink } from "react-router-dom";

import authApi from "apis/auth";
import { resetAuthTokens } from "apis/axios";
import { getFromLocalStorage, setToLocalStorage } from "utils/storage";

import SidePane from "./SidePane";

const Sidebar = ({ onCategorySearch, onCategorySelect, onSidebarOpen }) => {
  const [isPaneOpen, setIsPaneOpen] = useState(false);

  const userName = getFromLocalStorage("authUserName");
  const email = getFromLocalStorage("authEmail");

  const handleSidePane = () => {
    setIsPaneOpen(!isPaneOpen);
    onSidebarOpen(!isPaneOpen);
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setToLocalStorage({
        authToken: null,
        email: null,
        userId: null,
        userName: null,
      });
      resetAuthTokens();
      window.location.href = "/login";
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <div className="fixed flex h-screen">
      <div className="flex w-16 flex-col items-center border-r border-gray-200 bg-white py-4">
        <NavLink
          activeClassName="bg-black text-white"
          className="my-2 rounded-lg p-2 hover:bg-gray-400"
          to="/blogs"
        >
          <Book className="h-6 w-6" />
        </NavLink>
        <NavLink
          activeClassName="bg-black text-white"
          className="my-2 rounded-lg p-2 hover:bg-gray-400"
          to="/lists"
        >
          <List className="h-6 w-6" />
        </NavLink>
        <NavLink
          activeClassName="bg-black text-white"
          className="my-2 rounded-lg p-2 hover:bg-gray-400"
          to="/posts/create"
        >
          <Edit className="h-7 w-7" />
        </NavLink>
        <Button
          className="my-2 rounded-lg p-2 hover:bg-gray-400"
          icon={() => <ListDetails />}
          label=""
          style="text"
          onClick={handleSidePane}
        />
        <div className="mb-6 flex h-full flex-col justify-end">
          <Dropdown
            buttonSize="large"
            buttonStyle="text"
            className=""
            closeOnSelect={false}
            position="right"
            customTarget={
              <Avatar className="mx-5 cursor-pointer" size="large" />
            }
            onClickOutside={function noRefCheck() {}}
          >
            <div className="rounded-lg border p-3 shadow-sm">
              <div className="mb-4 flex items-center">
                <Avatar
                  className="mr-3 h-12 w-12 rounded-full bg-blue-200"
                  size="large"
                />
                <div>
                  <Typography className="text-xl font-medium text-gray-800">
                    {userName}
                  </Typography>
                  <Typography className="text-gray-600">{email}</Typography>
                </div>
              </div>
              <div className="mt-2 border-t pt-4">
                <Button
                  className=" bg-white text-gray-700 hover:bg-gray-100"
                  icon={Left}
                  iconPosition="left"
                  label="Logout"
                  size="medium"
                  style="secondary"
                  onClick={handleLogout}
                />
              </div>
            </div>
          </Dropdown>
        </div>
      </div>
      <SidePane
        isOpen={isPaneOpen}
        onCategorySearch={onCategorySearch}
        onCategorySelect={onCategorySelect}
      />
    </div>
  );
};

export default Sidebar;
