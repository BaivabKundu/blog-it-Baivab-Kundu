import React from "react";

import { Typography } from "@bigbinary/neetoui";

import Sidebar from "components/Sidebar";

const Lists = () => (
  <div className="flex">
    <Sidebar />
    <main className="ml-24 flex-1">
      <div className="w-full px-4 py-8">
        <Typography className="mb-8 text-5xl font-bold text-gray-800">
          Lists
        </Typography>
      </div>
    </main>
  </div>
);

export default Lists;
