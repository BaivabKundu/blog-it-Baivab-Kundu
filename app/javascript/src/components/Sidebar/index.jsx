import React from "react";

import { Book, List } from "@bigbinary/neeto-icons";
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
    <div className="mt-4 flex h-full flex-col justify-end">
      <div className="h-12 w-12 rounded-full bg-gray-300" />
    </div>
  </div>
);

export default Sidebar;
