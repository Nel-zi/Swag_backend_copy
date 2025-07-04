import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Herosection from "./Herosection";

const Dashboard = () => {
  const [userEmail, setUserEmail] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLoggedIn = !!userEmail;

  const handleLogin = (email) => {
    setUserEmail(email);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-[#23232a] overflow-hidden">
      {/* Mobile/Tablet menu toggle button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-[#292C35] p-2 rounded-md"
        onClick={toggleSidebar}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar with mobile/tablet responsive behavior */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:relative z-40 transition-transform duration-300 ease-in-out h-full`}
      >
        <Sidebar
          onLogin={handleLogin}
          userEmail={userEmail}
          isLoggedIn={isLoggedIn}
          closeSidebar={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main content */}
      <div
        className="flex-1 flex flex-col w-full lg:w-auto overflow-auto"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#59cca4 #23232a",
        }}
      >
        <Herosection isLoggedIn={isLoggedIn} />
        {/* Add main dashboard content here below Herosection if needed */}
      </div>

      {/* Overlay to close sidebar on mobile/tablet */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Dashboard;
