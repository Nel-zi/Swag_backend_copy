import React from "react";
import "./Footer.css";

const Footer = ({ loginError }) => {
  if (loginError) {
    return (
      <div className="w-full bg-red-500 rounded-2xl ">
        <p className="text-white text-center mx-2 py-4 font-semibold text-xs ">
          Login Error! We couldn’t find an existing Email address!
        </p>
      </div>
    );
  }
  return (
    <footer className=" flex flex-col justify-center items-center md:py-4">
      <hr className="w-[310.991px] h-[0.25px] mb-3  border-0 bg-white opacity-60" />
      <div>
        <span className="footer-text">Don't have an account?</span>
        <span className="footer-link">Sign up</span>
      </div>
    </footer>
  );
};

export default Footer;
