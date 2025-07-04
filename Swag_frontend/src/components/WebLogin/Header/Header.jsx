import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <header className=" text-center">
      <div className="flex justify-center">
        {/* <div className="header-icon"></div> */}
        <h1 className=" text-2xl text-[#94ffbf] font-bold text-center w-fit">
          Welcome Back!
        </h1>
      </div>
      <p className=" text-white text-center">
        Enter your information to login.
      </p>
      <hr className="w-[310.991px] h-[0.25px] mt-2 md:mt-6 mb-0  flex mx-auto border-0 bg-white opacity-60" />
      {/* <div className="header-divider"></div> */}
    </header>
  );
};

export default Header;
