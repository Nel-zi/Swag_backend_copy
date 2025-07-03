import React, { useState, useEffect } from "react";
import Header from "./Header/Header";
import LoginForm from "./LoginForm/LoginForm";
import SocialLogin from "./SocialLogin/SocialLogin";
import Footer from "./Footer/Footer";
import QRCodeLogin from "./LoginForm/FastLogin/QRCodeLogin";
import WebPassword from "./LoginForm/EmailInput/WebPassword";
import "./WebLogin.css";

const WebLogin = ({ onSuccess, onClose }) => {
  const [showQR, setShowQR] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [sharedEmail, setSharedEmail] = useState("");

  useEffect(() => {
    let timer;
    if (loginError) {
      timer = setTimeout(() => setLoginError(false), 5000);
    }
    return () => clearTimeout(timer);
  }, [loginError]);

  // Handler for login success (simulate after password)
  const handlePasswordSuccess = () => {
    if (onSuccess && email) {
      onSuccess(email);
    }
    if (onClose) onClose();
  };

  return (
    <main className="w-full flex items-center justify-center h-screen">
      <div className="flex items-center justify-center">
        {!showQR && !showPassword && (
          <div className="pt-5 pb-2 w-[95%] max-h-[95%] md:h-fit  md:max-w-[480px] bg-[#292C35] rounded-2xl  md:pt-0">
            <div
              className="flex justify-end w-full pt-5 pr-5"
              onClick={onClose}
            >
              <button
                // onClick={onClose}
                className="text-[#94ffbf] hover:text-white bg-black rounded-full p-1"
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
            <Header />
            <LoginForm
              onSwitchToQR={() => setShowQR(true)}
              setLoginError={setLoginError}
              onSwitchToPassword={() => setShowPassword(true)}
              setSharedEmail={setSharedEmail}
            />
            <SocialLogin />
            <Footer loginError={loginError} />
          </div>
        )}
        {showQR && !showPassword && (
          <div className="w-full max-w-[480px] bg-[#292C35] rounded-2xl flex items-center justify-center">
            <QRCodeLogin onBack={() => setShowQR(false)} />
          </div>
        )}
        {!showQR && showPassword && (
          <div className="w-full max-w-[480px]">
            <WebPassword
              sharedEmail={sharedEmail}
              onBack={() => setShowPassword(false)}
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default WebLogin;
