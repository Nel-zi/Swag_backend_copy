import React, { useState, useEffect } from "react";
import Header from "./Header/Header";
import LoginForm from "./LoginForm/LoginForm";
import SocialLogin from "./SocialLogin/SocialLogin";
import Footer from "./Footer/Footer";
import QRCodeLogin from "./LoginForm/FastLogin/QRCodeLogin";
import WebPassword from "./LoginForm/EmailInput/WebPassword";
import "./WebLogin.css";

const WebLogin = () => {
  const [showQR, setShowQR] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    let timer;
    if (loginError) {
      timer = setTimeout(() => setLoginError(false), 5000);
    }
    return () => clearTimeout(timer);
  }, [loginError]);

  return (
    <main className="w-full h-screen flex items-center justify-center min-h-screen bg-gray-100">
      {!showQR && !showPassword && (
        <div className="w-[480px] h-[800px] bg-[#292C35] rounded-2xl">
          <Header />
          <LoginForm
            onSwitchToQR={() => setShowQR(true)}
            setLoginError={setLoginError}
            onSwitchToPassword={() => setShowPassword(true)}
          />
          <SocialLogin />
          <Footer loginError={loginError} />
        </div>
      )}
      {showQR && !showPassword && (
        <div className="w-[480px] h-[599.04px] bg-[#292C35] rounded-2xl flex items-center justify-center">
          <QRCodeLogin onBack={() => setShowQR(false)} />
        </div>
      )}
      {!showQR && showPassword && (
        <div>
          <WebPassword onBack={() => setShowPassword(false)} />
        </div>
      )}
    </main>
  );
};

export default WebLogin;
