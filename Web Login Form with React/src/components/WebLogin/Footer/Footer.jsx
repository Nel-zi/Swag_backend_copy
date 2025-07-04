import React from "react";
import "./Footer.css";

const Footer = ({ loginError }) => {
  if (loginError) {
    return (
      <div className="w-full  mt-10  bg-red-500 rounded-lg">
        <p className="text-white text-center mx-2 py-4 font-semibold">
          Login Error! We couldn’t find an existing Email address!
        </p>
      </div>
    );
  }
  return (
    <footer className="footer">
      <hr className="w-[310.991px] h-[0.25px] mb-3 ml-[-42px] border-0 bg-white opacity-60" />
      <span className="footer-text">Don't have an account?</span>
      <span className="footer-link">Sign up</span>
    </footer>
  );
};

export default Footer;
