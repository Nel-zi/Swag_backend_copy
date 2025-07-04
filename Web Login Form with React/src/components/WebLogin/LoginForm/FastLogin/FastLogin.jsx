import React from "react";
import "./FastLogin.css";

const FastLogin = ({ onSwitchToQR }) => {
  return (
    <div className="fast-login">
      <span className="fast-login-text">Fast Login</span>
      <div className="fast-login-container" onClick={onSwitchToQR}>
        <span
          className="qr-code-text"
          //style={{ cursor: "pointer", color: "#94ffbf" }}
          //onClick={onSwitchToQR}
        >
          Use QR Code
        </span>
        <div className="rating-star-empty"></div>
        <div className="rating-star-filled"></div>
        <div className="rating-dot-empty"></div>
        <div className="rating-dot-filled-1"></div>
        <div className="rating-dot-filled-2"></div>
        <div className="rating-dot-filled-3"></div>
      </div>
    </div>
  );
};

export default FastLogin;
