import React, { useState } from "react";
import LoginForm from "../WebLogin/LoginForm/LoginForm";
import WebLogin from "../WebLogin/WebLogin";
import ReactDOM from "react-dom";

const navItems = [
  {
    label: "For You",
    icon: "/svg/for-you.svg",
  },
  {
    label: "Explore",
    icon: "/svg/explore.svg",
  },
  {
    label: "Profile",
    icon: "/svg/profile.svg",
  },
  {
    label: "Upload",
    icon: "/svg/upload.svg",
  },
];

const footerLinks = ["Company", "Program", "Terms & Policies"];

const Sidebar = ({ onLogin, userEmail, isLoggedIn, closeSidebar }) => {
  const [showLogin, setShowLogin] = useState(false);

  // Handler for login success
  const handleLoginSuccess = (email) => {
    if (onLogin) onLogin(email);
    setShowLogin(false);
  };

  // Use portal to render modal outside of sidebar hierarchy
  const renderLoginModal = () => {
    if (!showLogin) return null;

    return ReactDOM.createPortal(
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9999] p-4 ">
        <div className="rounded-xl shadow-lg max-w-full w-[95%] sm:w-auto h-auto">
          <WebLogin
            onSuccess={handleLoginSuccess}
            onClose={() => setShowLogin(false)}
          />
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className="w-auto h-fit bg-gray-100 flex">
      <aside className="flex flex-col  h-screen w-[280px] sm:w-[310px] lg:w-[340px] py-4 sm:py-6 lg:py-8 px-4 sm:px-5 lg:px-7 shadow-lg bg-[#292C35] overflow-auto lg:overflow-hidden">
        {/* Close button for mobile and tablet */}
        <div className="lg:hidden flex justify-end mb-2">
          <button
            onClick={closeSidebar}
            className="text-white p-1 rounded-full hover:bg-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Top: Logo & App Name */}
        <div>
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-2 lg:mb-8">
            <img
              src="/svg/logo.svg"
              alt="SWAG Logo"
              className="w-16 h-12 sm:w-20 sm:h-16"
            />
            <span className="text-white text-base sm:text-lg font-poppins">
              Stuff We All Get
            </span>
          </div>
          <hr className="w-full h-[0.25px] mb-4 sm:mb-6 lg:mb-8 border-0 bg-gray-500 opacity-60" />

          {/* Search Input */}
          <div className="relative mb-4 sm:mb-6 lg:mb-8">
            <input
              type="text"
              placeholder="Search"
              className="w-full py-2 sm:py-3 pl-10 sm:pl-12 pr-4 rounded-xl bg-[#111118] text-white font-poppins text-sm sm:text-base outline-none border-none font-medium"
            />
            <img
              src="/svg/search.svg"
              alt="Search"
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 opacity-70"
            />
          </div>

          {/* Navigation Menu */}
          <nav className="flex flex-col gap-1 sm:gap-2  sm:mb-8 lg:mb-10">
            {navItems.map((item) => (
              <button
                key={item.label}
                className="flex items-center gap-2 sm:gap-4 py-2 sm:py-3 px-3 sm:px-4 rounded-xl hover:bg-[#292c35] transition-colors text-[#f9f9f9] font-semibold font-poppins text-sm sm:text-base"
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  className="w-5 h-5 sm:w-6 sm:h-6 opacity-80 group-hover:opacity-100"
                />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Section */}
          <div className="mt-2 sm:mt-4 lg:mt-20 mb-4 sm:mb-6">
            {userEmail ? (
              <div
                className="text-white font-bold rounded-xl py-2 sm:py-3 px-4 sm:px-6 text-center font-poppins text-sm sm:text-base shadow"
                style={{
                  background:
                    "linear-gradient(90deg, #007F7D 0%, #59CCA4 59%, #94FFBF 100%)",
                }}
              >
                {`Welcome back, ${userEmail.split("@")[0]}`}
              </div>
            ) : (
              <button
                className="w-full bg-gradient-to-r from-[#007F7D] via-[#59CCA4] to-[#94FFBF] text-white font-bold rounded-xl py-2 sm:py-3 px-4 sm:px-6 text-center font-poppins text-sm sm:text-base shadow hover:opacity-90 transition"
                onClick={() => setShowLogin(true)}
              >
                Login
              </button>
            )}
            {renderLoginModal()}
          </div>
          <hr className="w-full h-[0.25px] mb-4 sm:mb-6 lg:mb-8 border-0 bg-gray-500 opacity-60" />
        </div>

        {/* Bottom: Download & Footer */}
        <div className="flex flex-col gap-1 sm:gap-2 mb-2">
          {footerLinks.map((link) => (
            <span
              key={link}
              className="text-[#8e8e8e] text-xs sm:text-sm font-poppins font-medium cursor-pointer hover:text-[#94ffbf] transition-colors"
            >
              {link}
            </span>
          ))}
          <div className="text-[#8e8e8e] text-xs sm:text-sm font-poppins font-medium">
            © 2025 SWAG
          </div>
        </div>

        <div>
          {/* Download Section */}
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <button className="text-[#8e8e8e] font-bold rounded-sm py-2 sm:py-3">
              Download SWAG
            </button>
            <div className="flex">
              <img
                src="/svg/appQR.svg"
                alt="Download SWAG"
                className="w-24 h-16 sm:w-32 sm:h-20 object-contain"
              />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
