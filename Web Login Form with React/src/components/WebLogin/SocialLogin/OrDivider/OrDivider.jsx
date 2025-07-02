import React from "react";
import "./OrDivider.css";

const OrDivider = () => {
  return (
    <div className="flex flex-row gap-3 items-center justify-center w-full my-6">
      <hr className="border-1 border-gray-400 w-[25%]" />
      <span className=" text-white">or</span>
      <hr className="border-1 border-gray-400 w-[25%]" />
    </div>
  );
};

export default OrDivider;
