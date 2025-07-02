import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-wrapper">
        <div className="header-icon"></div>
        <h1 className="header-title">Welcome Back!</h1>
      </div>
      <p className="header-subtitle">Enter your information to login.</p>
      <hr className="w-[310.991px] h-[0.25px] mt-6 mb-0 ml-[84.678px] border-0 bg-white opacity-60" />
      {/* <div className="header-divider"></div> */}
    </header>
  );
};

export default Header;
