import React from "react";

import { Book, Edit, List } from "@bigbinary/neeto-icons";
import { Avatar } from "@bigbinary/neetoui";
import { NavLink } from "react-router-dom";

const Sidebar = () => (
  <div className="fixed flex h-screen w-16 flex-col items-center border-r border-gray-200 bg-white py-4">
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
    <div className="mb-6 mt-4 flex h-full flex-col justify-end">
      <Avatar size="large" />
    </div>
  </div>
);

export default Sidebar;
