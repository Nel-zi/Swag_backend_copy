import React from 'react'
import './FastLogin.css'

const FastLogin = () => {
  return (
    <div className="fast-login">
      <span className="fast-login-text">Fast Login</span>
      <button className="fast-login-button">
        <span className="qr-code-text">Use QR Code</span>
        <div className="rating-star-empty"></div>
        <div className="rating-star-filled"></div>
        <div className="rating-dot-empty"></div>
        <div className="rating-dot-filled-1"></div>
        <div className="rating-dot-filled-2"></div>
        <div className="rating-dot-filled-3"></div>
      </button>
    </div>
  )
}

export default FastLogin
