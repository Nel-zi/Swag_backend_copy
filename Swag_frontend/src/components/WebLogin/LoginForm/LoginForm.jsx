import React from "react";
import FastLogin from "./FastLogin/FastLogin";
import EmailInput from "./EmailInput/EmailInput";
import "./LoginForm.css";

const LoginForm = ({ onSwitchToQR, setLoginError, onSwitchToPassword, setSharedEmail }) => {
  return (
    <section className="login-form">
      <FastLogin onSwitchToQR={onSwitchToQR} />
      <EmailInput
        showLoginError={setLoginError}
        onSwitchToPassword={onSwitchToPassword}
        setSharedEmail={setSharedEmail}
      />
    </section>
  );
};

export default LoginForm;
